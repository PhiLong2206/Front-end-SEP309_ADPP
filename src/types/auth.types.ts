export type RoleType = "Learner" | "Educator" | "Administrator";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: RoleType;
  avatarUrl?: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role?: RoleType;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: "Learner" | "Educator";
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
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}
