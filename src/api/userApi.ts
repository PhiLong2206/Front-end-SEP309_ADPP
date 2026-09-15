import axiosClient from "./axiosClient";
import { User, ApiResponse, PaginatedResponse, PaginationParams } from "../types";

const userApi = {
  getProfile: (): Promise<ApiResponse<User>> => axiosClient.get("/users/profile"),

  updateProfile: (data: Partial<User>): Promise<ApiResponse<User>> =>
    axiosClient.put("/users/profile", data),

  changePassword: (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<void>> =>
    axiosClient.post("/users/change-password", data),

  // Administrator user management
  getAllUsers: (params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<User>>> =>
    axiosClient.get("/admin/users", { params }),

  getUserById: (id: string): Promise<ApiResponse<User>> =>
    axiosClient.get(`/admin/users/${id}`),

  createUser: (data: Partial<User>): Promise<ApiResponse<User>> =>
    axiosClient.post("/admin/users", data),

  updateUser: (id: string, data: Partial<User>): Promise<ApiResponse<User>> =>
    axiosClient.put(`/admin/users/${id}`, data),

  deleteUser: (id: string): Promise<ApiResponse<void>> =>
    axiosClient.delete(`/admin/users/${id}`),

  updateUserStatus: (id: string, isActive: boolean): Promise<ApiResponse<User>> =>
    axiosClient.patch(`/admin/users/${id}/status`, { isActive }),
};

export default userApi;
