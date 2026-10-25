import axiosClient from "./axiosClient";
import {
  ApiResponse,
  PaginatedResponse,
  AdminDashboardStats,
  AdminUserItem,
  AdminRoleItem,
  AdminGetUsersParams,
  CreditPackageAdminItem,
  CreateCreditPackageRequest,
  PatchCreditPackageRequest,
} from "../types";

const adminApi = {
  /**
   * GET /api/admin/dashboard/stats
   * Lấy tổng quan thống kê: TotalUsers, TotalDebateSessions, TotalTopics
   */
  getDashboardStats: (): Promise<ApiResponse<AdminDashboardStats>> =>
    axiosClient.get("/admin/dashboard/stats"),

  /**
   * GET /api/admin/users
   * Lấy danh sách người dùng phân trang và tìm kiếm
   */
  getUsers: (params?: AdminGetUsersParams): Promise<ApiResponse<PaginatedResponse<AdminUserItem>>> =>
    axiosClient.get("/admin/users", { params }),

  /**
   * GET /api/admin/users/{id}
   * Xem chi tiết 1 người dùng theo ID
   */
  getUserById: (id: number | string): Promise<ApiResponse<AdminUserItem>> =>
    axiosClient.get(`/admin/users/${id}`),

  /**
   * PATCH /api/admin/users/{id}/status
   * Khóa hoặc mở khóa tài khoản người dùng
   */
  updateUserStatus: (id: number | string, isActive: boolean): Promise<ApiResponse<object>> =>
    axiosClient.patch(`/admin/users/${id}/status`, { isActive }),

  /**
   * GET /api/admin/roles
   * Lấy danh sách vai trò chuẩn trong hệ thống
   */
  getRoles: (): Promise<ApiResponse<AdminRoleItem[]>> =>
    axiosClient.get("/admin/roles"),

  /**
   * PUT /api/admin/users/{id}/roles
   * Phân quyền vai trò cho người dùng
   */
  assignUserRoles: (id: number | string, roleIds: number[]): Promise<ApiResponse<object>> =>
    axiosClient.put(`/admin/users/${id}/roles`, { roleIds }),

  /**
   * GET /api/admin/credit-packages
   * Lấy danh sách tất cả các gói nạp credit
   */
  getCreditPackages: (): Promise<ApiResponse<CreditPackageAdminItem[]>> =>
    axiosClient.get("/admin/credit-packages"),

  /**
   * POST /api/admin/credit-packages
   * Tạo gói nạp credit mới
   */
  createCreditPackage: (data: CreateCreditPackageRequest): Promise<ApiResponse<CreditPackageAdminItem>> =>
    axiosClient.post("/admin/credit-packages", data),

  /**
   * PATCH /api/admin/credit-packages/{packageId}
   * Cập nhật thông tin hoặc trạng thái gói credit
   */
  patchCreditPackage: (
    packageId: number,
    data: PatchCreditPackageRequest
  ): Promise<ApiResponse<CreditPackageAdminItem>> =>
    axiosClient.patch(`/admin/credit-packages/${packageId}`, data),
};

export default adminApi;
