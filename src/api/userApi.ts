import axiosClient from "./axiosClient";
import {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  UpdateProfileRequest,
  User,
  UserProfileResponse,
} from "../types";

const userApi = {
  /**
   * GET /api/users/me [Authorized]
   * Gets current logged-in user profile with roles and account metadata.
   */
  getMyProfile: (): Promise<ApiResponse<UserProfileResponse>> =>
    axiosClient.get("/users/me"),

  /**
   * Alias for getMyProfile
   */
  getProfile: (): Promise<ApiResponse<UserProfileResponse>> =>
    axiosClient.get("/users/me"),

  /**
   * PUT /api/users/me [Authorized]
   * Updates profile information (FullName, AvatarUrl, DateOfBirth, Gender, PhoneNumber)
   */
  updateMyProfile: (data: UpdateProfileRequest): Promise<ApiResponse<UserProfileResponse>> =>
    axiosClient.put("/users/me", data),

  /**
   * Alias for updateMyProfile
   */
  updateProfile: (data: UpdateProfileRequest): Promise<ApiResponse<UserProfileResponse>> =>
    axiosClient.put("/users/me", data),

  /**
   * GET /api/admin/test [Authorized(Roles = "Admin")]
   * Tests administrator authorization and role validation.
   */
  testAdminAuth: (): Promise<ApiResponse<object>> =>
    axiosClient.get("/admin/test"),

  // -------------------------------------------------------------
  // Admin Management Endpoints (Pending Backend Microservice Implementation)
  // -------------------------------------------------------------
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

