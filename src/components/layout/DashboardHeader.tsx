import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Bell, LogOut } from "lucide-react";
import Button from "../common/Button";

export interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle, action }) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-[#0a0f1d]/90 backdrop-blur-xl border-b border-slate-800/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-lg shadow-black/20">
      <div>
        {title ? (
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white leading-tight">{title}</h1>
            {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 uppercase tracking-wider">
              AI DEBATE PRACTICE PLATFORM
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {action && <div>{action}</div>}

        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 text-slate-400 hover:text-cyan-400 rounded-xl hover:bg-slate-800/80 transition-colors"
          title="Thông báo"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#0a0f1d]" />
        </button>

        {/* User avatar & logout */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user?.fullName || "Avatar"}
              className="w-8 h-8 rounded-full object-cover border border-blue-500/40 shadow-xs"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs border border-blue-400/30">
              {(user?.fullName || user?.email || "U").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="hidden sm:block text-left">
            <div className="text-sm font-bold text-slate-200 leading-tight">
              {user?.fullName || user?.email?.split("@")[0] || "Người dùng"}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {user?.email || "Học viên"}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            title="Đăng xuất"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

