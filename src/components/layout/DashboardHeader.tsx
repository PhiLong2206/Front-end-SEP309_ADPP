import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { MOCK_CURRENT_USER } from "../../mocks/users";
import { Bell, LogOut } from "lucide-react";
import Button from "../common/Button";

export interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle, action }) => {
  const { user, logout } = useAuth();
  const currentUser = user || MOCK_CURRENT_USER;

  return (
    <header className="h-14 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30">
      <div>
        {title ? (
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">{title}</h1>
            {subtitle && <p className="text-[11px] text-slate-500">{subtitle}</p>}
          </div>
        ) : (
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            AI Debate Practice Platform
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {action && <div>{action}</div>}

        {/* Notifications */}
        <button
          type="button"
          className="relative p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
          title="Thông báo"
        >
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        {/* User avatar & logout */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <img
            src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt="Nguyễn Phi Long"
            className="w-7 h-7 rounded-full object-cover border border-slate-200"
          />
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-800 leading-tight">
              {currentUser?.fullName || "Nguyễn Phi Long"}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            title="Đăng xuất"
            className="p-1 text-slate-400 hover:text-red-600"
          >
            <LogOut size={14} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
