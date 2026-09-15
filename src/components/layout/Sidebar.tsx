import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/constants";
import { MOCK_CURRENT_USER } from "../../mocks/users";
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
  const currentUser = user || MOCK_CURRENT_USER;

  // Exact 6 main navigation items matching the Reference Sidebar
  const learnerNavItems: NavItem[] = [
    { label: "Trang tổng quan", path: "/learner/dashboard", icon: LayoutDashboard },
    { label: "Chủ đề tranh biện", path: "/learner/topics", icon: BookOpen },
    { label: "Tranh biện với AI", path: "/learner/debate/session-demo-01", icon: Bot },
    { label: "Tranh biện 1 vs 1", path: "/learner/debate-1v1", icon: Swords },
    { label: "Trận của tôi", path: "/learner/history", icon: History },
    { label: "Tiến độ học tập", path: "/learner/progress", icon: TrendingUp },
  ];

  return (
    <aside className="fixed top-0 bottom-0 left-0 w-56 bg-white border-r border-slate-200/90 z-40 flex flex-col justify-between select-none">
      <div>
        {/* Top: ADPP Logo */}
        <div className="h-14 px-5 flex items-center gap-2 border-b border-slate-100">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            A
          </div>
          <span className="font-extrabold text-sm text-slate-900 tracking-tight">
            ADPP
          </span>
          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded ml-auto">
            {role === ROLES.ADMIN ? "Admin" : role === ROLES.EDUCATOR ? "Educator" : "Học viên"}
          </span>
        </div>

        {/* Navigation list */}
        <nav className="p-2 space-y-0.5 mt-2">
          {learnerNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={16} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Hồ sơ, Cài đặt, User Info */}
      <div className="p-2 border-t border-slate-100 space-y-0.5">
        <NavLink
          to="/learner/profile"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isActive
                ? "bg-blue-50 text-blue-600 font-bold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`
          }
        >
          <UserIcon size={15} />
          <span>Hồ sơ</span>
        </NavLink>

        <NavLink
          to="/learner/settings"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isActive
                ? "bg-blue-50 text-blue-600 font-bold"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`
          }
        >
          <Settings size={15} />
          <span>Cài đặt</span>
        </NavLink>

        {/* User Card: Nguyễn Phi Long - Học viên */}
        <div className="pt-2.5 mt-1 border-t border-slate-100 flex items-center gap-2.5 px-2">
          <img
            src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
            alt="Nguyễn Phi Long"
            className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate leading-tight">
              {currentUser?.fullName || "Nguyễn Phi Long"}
            </p>
            <p className="text-[10px] text-slate-400 truncate leading-tight">
              Học viên
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
