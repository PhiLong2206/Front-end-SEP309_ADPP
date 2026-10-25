export interface AdminDashboardStats {
  totalUsers: number;
  totalDebateSessions: number;
  totalTopics: number;
}

export interface AdminUserItem {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  roles: string[];
}

export interface AdminRoleItem {
  roleId: number;
  roleName: string;
  description?: string | null;
}

export interface AdminGetUsersParams {
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface UpdateUserStatusRequest {
  isActive: boolean;
}

export interface AssignRolesRequest {
  roleIds: number[];
}

export interface CreditPackageAdminItem {
  packageId: number;
  packageCode: string;
  packageName: string;
  price: number;
  currency: string;
  creditAmount: number;
  bonusCredit: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateCreditPackageRequest {
  packageCode: string;
  packageName: string;
  price: number;
  currency?: string;
  creditAmount: number;
  bonusCredit?: number;
  isActive?: boolean;
}

export interface PatchCreditPackageRequest {
  packageCode?: string;
  packageName?: string;
  price?: number;
  currency?: string;
  creditAmount?: number;
  bonusCredit?: number;
  isActive?: boolean;
}
