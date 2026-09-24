import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getToken, clearAuthStorage } from "../utils/token";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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

// Response interceptor: unwrap response data and handle errors
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      clearAuthStorage();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }

    // Friendly message when server is down or unreachable
    if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
      return Promise.reject({
        success: false,
        message: "Không thể kết nối đến máy chủ Backend (Port 5001). Vui lòng đảm bảo SystemService đang chạy.",
      });
    }

    return Promise.reject({
      success: false,
      message: error.message || "Đã xảy ra lỗi khi kết nối máy chủ.",
    });
  }
);

export default axiosClient;

