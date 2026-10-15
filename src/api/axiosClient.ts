import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  getToken,
  setToken,
  getRefreshToken,
  setRefreshToken,
  clearAuthStorage,
} from "../utils/token";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach Bearer JWT token if present
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor: unwrap response data and handle errors
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Auto token refresh on 401 Unauthorized (except for login & refresh-token endpoints)
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      const storedRefreshToken = getRefreshToken();

      if (storedRefreshToken) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              return axiosClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshRes = await axios.post(
            `${baseURL}/auth/refresh-token`,
            { refreshToken: storedRefreshToken },
            { headers: { "Content-Type": "application/json" } }
          );

          if (refreshRes.data?.success && refreshRes.data?.data?.accessToken) {
            const newAccessToken = refreshRes.data.data.accessToken;
            const newRefreshToken = refreshRes.data.data.refreshToken;

            setToken(newAccessToken);
            if (newRefreshToken) {
              setRefreshToken(newRefreshToken);
            }

            processQueue(null, newAccessToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return axiosClient(originalRequest);
          } else {
            processQueue(new Error("Refresh token invalid"));
            clearAuthStorage();
            if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
              window.location.href = "/login";
            }
          }
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          clearAuthStorage();
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
            window.location.href = "/login";
          }
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      } else {
        clearAuthStorage();
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (data && typeof data === "object") {
        return Promise.reject({
          ...data,
          status: (data as { status?: number }).status ?? status,
          statusCode: (data as { statusCode?: number }).statusCode ?? status,
        });
      }

      return Promise.reject({
        success: false,
        status,
        statusCode: status,
        message: typeof data === "string" && data.trim() ? data : error.message,
        data,
      });
    }

    // Friendly message when server is down or unreachable
    if (error.message === "Network Error" || error.code === "ERR_NETWORK" || !error.response) {
      return Promise.reject({
        success: false,
        status: 0,
        statusCode: 0,
        isNetworkError: true,
        message: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.",
      });
    }

    return Promise.reject({
      success: false,
      status: 0,
      statusCode: 0,
      message: error.message || "Đã xảy ra lỗi khi kết nối máy chủ.",
    });
  }
);

export default axiosClient;


