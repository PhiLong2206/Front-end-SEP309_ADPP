export type RoleType = "Learner" | "Educator" | "Administrator" | "Member" | "Admin";

export interface UserInfoDto {
  userId: number;
  fullName: string;
  email: string;
  roles: string[];
}

export interface User {
  id?: string | number;
  userId?: number;
  email: string;
  fullName: string;
  role: RoleType;
  roles?: string[];
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  isEmailVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role?: RoleType;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: "Learner" | "Educator" | "Member" | "Administrator" | "Admin";
}

export interface VerifyRegisterOtpRequest {
  email: string;
  otpCode: string;
}

export interface SendOtpRequest {
  email: string;
  type: string;
}

export interface VerifyOtpRequest {
  email: string;
  code: string;
  type: string;
}

export interface ResetPasswordRequest {
  email: string;
  otpCode: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfileResponse {
  userId: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  roles: string[];
}

export interface UpdateProfileRequest {
  fullName: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  user: UserInfoDto;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  role: RoleType | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; message?: string; user?: User }>;
  googleLogin: (idToken: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

