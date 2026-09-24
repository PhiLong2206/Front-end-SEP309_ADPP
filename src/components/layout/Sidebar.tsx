import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/constants";
import {
  LayoutDashboard,
  BookOpen,
  Bot,
  Swords,
  History,
  TrendingUp,
  User as UserIcon,
  Settings,
  LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const Sidebar: React.FC = () => {
  const { user, role } = useAuth();

  const learnerNavItems: NavItem[] = [
    { label: "Trang tổng quan", path: "/learner/dashboard", icon: LayoutDashboard },
    { label: "Chủ đề tranh biện", path: "/learner/topics", icon: BookOpen },
    { label: "Tranh biện với AI", path: "/learner/debate/session-demo-01", icon: Bot },
    { label: "Tranh biện 1 vs 1", path: "/learner/debate-1v1", icon: Swords },
    { label: "Trận của tôi", path: "/learner/history", icon: History },
    { label: "Tiến độ học tập", path: "/learner/progress", icon: TrendingUp },
  ];

  return (
    <aside className="fixed top-0 bottom-0 left-0 w-64 bg-[#0a0f1d] border-r border-slate-800/80 z-40 flex flex-col justify-between select-none shadow-2xl">
      <div>
        {/* Top: ADPP Logo */}
        <div className="h-20 px-6 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-blue-600/30">
            A
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base text-white tracking-tight leading-tight">
              ADPP
            </span>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest leading-none">
              AI DEBATE PLATFORM
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-md ml-auto">
            {role === ROLES.ADMIN ? "Admin" : role === ROLES.EDUCATOR ? "Educator" : "Học viên"}
          </span>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1.5 mt-3">
          {learnerNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold shadow-lg shadow-blue-500/10"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  }`
                }
              >
                <Icon size={19} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Hồ sơ, Cài đặt, User Info */}
      <div className="p-3 border-t border-slate-800/80 space-y-1">
        <NavLink
          to="/learner/profile"
          className={({ isActive }) =>
            `flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
            }`
          }
        >
          <UserIcon size={18} />
          <span>Hồ sơ cá nhân</span>
        </NavLink>

        <NavLink
          to="/learner/settings"
          className={({ isActive }) =>
            `flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
            }`
          }
        >
          <Settings size={18} />
          <span>Cài đặt hệ thống</span>
        </NavLink>

        {/* User Card */}
        <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center gap-3 px-2">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user?.fullName || "Avatar"}
              className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-md">
              {(user?.fullName || user?.email || "U").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate leading-snug">
              {user?.fullName || user?.email?.split("@")[0] || "Người dùng"}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user?.email || "Tài khoản học viên"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );

};

export default Sidebar;

