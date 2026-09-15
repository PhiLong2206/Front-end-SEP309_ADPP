import axiosClient from "./axiosClient";
import { AuthResponse, LoginRequest, RegisterRequest, User, ApiResponse } from "../types";

const authApi = {
  login: (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> =>
    axiosClient.post("/auth/login", credentials),

  register: (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> =>
    axiosClient.post("/auth/register", data),

  logout: (): Promise<ApiResponse<void>> => axiosClient.post("/auth/logout"),

  getMe: (): Promise<ApiResponse<User>> => axiosClient.get("/auth/me"),

  refreshToken: (refreshToken: string): Promise<ApiResponse<{ token: string }>> =>
    axiosClient.post("/auth/refresh-token", { refreshToken }),
};

export default authApi;
