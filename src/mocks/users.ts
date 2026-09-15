import { User } from "../types";

export const MOCK_CURRENT_USER: User = {
  id: "user-phi-long",
  fullName: "Nguyễn Phi Long",
  email: "philong@adpp.edu.vn",
  role: "Learner",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  isActive: true,
  createdAt: "2026-01-01"
};

export interface MatchmakingUser {
  id: string;
  fullName: string;
  avatarUrl: string;
  totalMatches: number;
  averageScore: number;
  winRate: number;
  status: "Online" | "Offline";
  badgeRank: string;
}

export const MOCK_MATCHMAKING_USERS: MatchmakingUser[] = [
  {
    id: "user-1",
    fullName: "Trần Minh Anh",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    totalMatches: 28,
    averageScore: 82.5,
    winRate: 68,
    status: "Online",
    badgeRank: "Kim cương"
  },
  {
    id: "user-2",
    fullName: "Lê Hoàng Dũng",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    totalMatches: 19,
    averageScore: 78.0,
    winRate: 58,
    status: "Online",
    badgeRank: "Vàng"
  },
  {
    id: "user-3",
    fullName: "Phạm Thu Trang",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    totalMatches: 42,
    averageScore: 85.2,
    winRate: 74,
    status: "Online",
    badgeRank: "Cao thủ"
  },
  {
    id: "user-4",
    fullName: "Nguyễn Bảo Nam",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    totalMatches: 14,
    averageScore: 74.5,
    winRate: 50,
    status: "Offline",
    badgeRank: "Bạc"
  },
  {
    id: "user-5",
    fullName: "Vũ Khánh Linh",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    totalMatches: 31,
    averageScore: 79.8,
    winRate: 61,
    status: "Offline",
    badgeRank: "Vàng"
  }
];
