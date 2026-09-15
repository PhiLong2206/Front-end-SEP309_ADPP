import { ROLES, SystemRole } from "../utils/constants";
import { User } from "../types/auth.types";

export interface MockAccount {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: SystemRole;
  avatarUrl?: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: string;
}

export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    id: "acc-learner-001",
    fullName: "Nguyễn Phi Long (Học viên)",
    email: "learner@adpp.local",
    password: "123456",
    role: ROLES.LEARNER,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phoneNumber: "0901234567",
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "acc-educator-001",
    fullName: "TS. Trần Văn Nam (Nhà giáo dục)",
    email: "educator@adpp.local",
    password: "123456",
    role: ROLES.EDUCATOR,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phoneNumber: "0912345678",
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "acc-admin-001",
    fullName: "Ban Quản trị ADPP (Quản trị viên)",
    email: "admin@adpp.local",
    password: "123456",
    role: ROLES.ADMIN,
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    phoneNumber: "0987654321",
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
];

export const toUser = (account: MockAccount): User => {
  return {
    id: account.id,
    fullName: account.fullName,
    email: account.email,
    role: account.role,
    avatarUrl: account.avatarUrl,
    phoneNumber: account.phoneNumber,
    isActive: account.isActive,
    createdAt: account.createdAt,
  };
};
