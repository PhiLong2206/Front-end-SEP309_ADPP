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
  Sparkles,
  Calendar,
  Trophy,
  Users,
  CreditCard,
  Sliders,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  LucideIcon,
} from "lucide-react";

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { user, role } = useAuth();

  const getRoleLabel = () => {
    switch (role) {
      case ROLES.ADMIN:
        return "Quản trị viên";
      case ROLES.EDUCATOR:
        return "Giảng viên";
      default:
        return "Học viên";
    }
  };

  const getRoleBadgeVariant = () => {
    switch (role) {
      case ROLES.ADMIN:
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case ROLES.EDUCATOR:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    }
  };

  const getSections = (): NavSection[] => {
    if (role === ROLES.ADMIN) {
      return [
        {
          title: "TỔNG QUAN & QUẢN TRỊ",
          items: [
            { label: "Bảng điều khiển", path: "/admin/dashboard", icon: LayoutDashboard },
            { label: "Quản lý người dùng", path: "/admin/users", icon: Users },
            { label: "Quản lý chủ đề", path: "/admin/topics", icon: BookOpen },
          ],
        },
        {
          title: "HOẠT ĐỘNG & TÀI CHÍNH",
          items: [
            { label: "Quản lý sự kiện", path: "/admin/events", icon: Calendar },
            { label: "Quản lý cuộc thi", path: "/admin/competitions", icon: Trophy },
            { label: "Quản lý giao dịch", path: "/admin/payments", icon: CreditCard },
            { label: "Cấu hình hệ thống", path: "/admin/system", icon: Sliders },
          ],
        },
      ];
    }

    if (role === ROLES.EDUCATOR) {
      return [
        {
          title: "GIẢNG DẠY & HUẤN LUYỆN",
          items: [
            { label: "Bảng điều khiển", path: "/educator/dashboard", icon: LayoutDashboard },
            { label: "Quản lý chủ đề", path: "/educator/topics", icon: BookOpen },
            { label: "Sự kiện & Hội thảo", path: "/educator/events", icon: Calendar },
            { label: "Cuộc thi & Giải đấu", path: "/educator/competitions", icon: Trophy },
          ],
        },
      ];
    }

    // Default Learner
    return [
      {
        title: "LUYỆN TẬP & THI ĐẤU",
        items: [
          { label: "Bảng điều khiển", path: "/learner/dashboard", icon: LayoutDashboard },
          { label: "Chủ đề tranh biện", path: "/learner/topics", icon: BookOpen },
          { label: "Tranh biện với AI", path: "/learner/debate/session-demo-01", icon: Bot },
          { label: "Tranh biện 1 vs 1", path: "/learner/debate-1v1", icon: Swords },
          { label: "Giải đấu & Cuộc thi", path: "/learner/competitions", icon: Trophy },
          { label: "Sự kiện học tập", path: "/learner/events", icon: Calendar },
        ],
      },
      {
        title: "PHÂN TÍCH & TIẾN ĐỘ",
        items: [
          { label: "Trận của tôi", path: "/learner/history", icon: History },
          { label: "Tiến độ học tập", path: "/learner/progress", icon: TrendingUp },
        ],
      },
    ];
  };

  const sections = getSections();

  const getProfilePath = () => {
    if (role === ROLES.ADMIN) return "/admin/dashboard";
    if (role === ROLES.EDUCATOR) return "/educator/profile";
    return "/learner/profile";
  };

  const getSettingsPath = () => {
    if (role === ROLES.ADMIN) return "/admin/system";
    if (role === ROLES.EDUCATOR) return "/educator/dashboard";
    return "/learner/settings";
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 bg-[#0a0f1d] border-r border-slate-800/80 z-50 flex flex-col justify-between select-none shadow-2xl transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0 w-[280px]" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-[76px]" : "lg:w-[280px]"}`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand Header */}
          <div
            className={`h-20 flex items-center border-b border-slate-800/80 bg-slate-900/30 shrink-0 transition-all duration-300 ${
              isCollapsed ? "justify-center px-2" : "justify-between px-4"
            }`}
          >
            {isCollapsed ? (
              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/20 hover:scale-105 transition-all group relative cursor-pointer"
                  title="Mở rộng thanh bên"
                >
                  <Sparkles size={20} className="group-hover:hidden text-white" />
                  <PanelLeftOpen size={20} className="hidden group-hover:block text-white" />
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
                    Mở rộng thanh bên
                  </div>
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/20 shrink-0">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-[17px] tracking-tight text-white leading-none">
                        ADPP
                      </span>
                      <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 leading-none">
                        AI
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-400 tracking-normal mt-1 leading-none truncate">
                      Nền tảng Tranh biện
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shrink-0 ${getRoleBadgeVariant()}`}
                  >
                    {getRoleLabel()}
                  </span>

                  {/* Desktop Collapse Button */}
                  {onToggleCollapse && (
                    <button
                      type="button"
                      onClick={onToggleCollapse}
                      className="hidden lg:flex p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
                      title="Thu gọn thanh bên"
                    >
                      <PanelLeftClose size={18} />
                    </button>
                  )}

                  {/* Mobile Close Drawer Button */}
                  {onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
                      title="Đóng menu"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Navigation Area */}
          <div
            className={`flex-1 sidebar-scroll py-4 space-y-6 transition-all duration-300 ${
              isCollapsed ? "px-2" : "px-4"
            }`}
          >
            {sections.map((sec, secIdx) => (
              <div key={secIdx} className="space-y-1">
                {!isCollapsed && sec.title && (
                  <div className="px-3 pb-1.5 text-[12px] font-bold tracking-[0.5px] text-slate-400 uppercase">
                    {sec.title}
                  </div>
                )}

                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      title={item.label}
                      onClick={() => onClose?.()}
                      className={({ isActive }) =>
                        `group relative flex items-center h-[54px] rounded-xl transition-all duration-150 cursor-pointer ${
                          isCollapsed
                            ? `justify-center w-full ${
                                isActive
                                  ? "bg-[#14213d] text-white shadow-inner before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-1 before:rounded-r-md before:bg-blue-500"
                                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                              }`
                            : `px-3.5 ${
                                isActive
                                  ? "bg-[#14213d]/80 text-white font-semibold shadow-inner before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-1 before:rounded-r-md before:bg-blue-500"
                                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 font-medium"
                              }`
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isActive
                                ? "bg-blue-500/20 text-blue-400"
                                : "text-slate-400 group-hover:text-slate-200"
                            }`}
                          >
                            <Icon size={21} />
                          </div>

                          {!isCollapsed && (
                            <span className="text-[15px] truncate ml-[14px]">
                              {item.label}
                            </span>
                          )}

                          {/* Floating Tooltip when Collapsed */}
                          {isCollapsed && (
                            <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 flex items-center">
                              {item.label}
                              <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900" />
                            </div>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Area: Account Navigation & User Card */}
        <div
          className={`border-t border-slate-800/80 bg-slate-900/40 space-y-3 shrink-0 transition-all duration-300 ${
            isCollapsed ? "p-2" : "p-4"
          }`}
        >
          <div className="space-y-1">
            {/* Hồ sơ cá nhân */}
            <NavLink
              to={getProfilePath()}
              title="Hồ sơ cá nhân"
              onClick={() => onClose?.()}
              className={({ isActive }) =>
                `group relative flex items-center h-[48px] rounded-xl transition-all duration-150 cursor-pointer ${
                  isCollapsed
                    ? `justify-center w-full ${
                        isActive
                          ? "bg-[#14213d] text-white before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-md before:bg-blue-500"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                      }`
                    : `px-3.5 ${
                        isActive
                          ? "bg-[#14213d]/80 text-white font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-md before:bg-blue-500"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 font-medium"
                      }`
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? "bg-blue-500/20 text-blue-400"
                        : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  >
                    <UserIcon size={20} />
                  </div>

                  {!isCollapsed && (
                    <span className="text-[15px] truncate ml-[14px]">
                      Hồ sơ cá nhân
                    </span>
                  )}

                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 flex items-center">
                      Hồ sơ cá nhân
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900" />
                    </div>
                  )}
                </>
              )}
            </NavLink>

            {/* Cài đặt & Tùy chọn */}
            <NavLink
              to={getSettingsPath()}
              title="Cài đặt & Tùy chọn"
              onClick={() => onClose?.()}
              className={({ isActive }) =>
                `group relative flex items-center h-[48px] rounded-xl transition-all duration-150 cursor-pointer ${
                  isCollapsed
                    ? `justify-center w-full ${
                        isActive
                          ? "bg-[#14213d] text-white before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-md before:bg-blue-500"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                      }`
                    : `px-3.5 ${
                        isActive
                          ? "bg-[#14213d]/80 text-white font-semibold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-md before:bg-blue-500"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 font-medium"
                      }`
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? "bg-blue-500/20 text-blue-400"
                        : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  >
                    <Settings size={20} />
                  </div>

                  {!isCollapsed && (
                    <span className="text-[15px] truncate ml-[14px]">
                      Cài đặt & Tùy chọn
                    </span>
                  )}

                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 flex items-center">
                      Cài đặt & Tùy chọn
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900" />
                    </div>
                  )}
                </>
              )}
            </NavLink>
          </div>

          {/* User Profile Card */}
          <div
            className={`rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center hover:border-slate-700/80 transition-colors relative group ${
              isCollapsed ? "justify-center p-2" : "p-2.5 gap-3"
            }`}
            title={user?.fullName || user?.email || "Người dùng"}
          >
            <div className="relative shrink-0">
              {user?.avatarUrl && user.avatarUrl !== "string" ? (
                <img
                  src={user.avatarUrl}
                  alt={user?.fullName || "Avatar"}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-xs"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-md">
                  {(user?.fullName || user?.email || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0a0f1d]" />
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate leading-tight">
                  {user?.fullName || user?.email?.split("@")[0] || "Người dùng"}
                </p>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {user?.email || "Tài khoản ADPP"}
                </p>
              </div>
            )}

            {isCollapsed && (
              <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
                <div className="font-bold">{user?.fullName || "Người dùng"}</div>
                <div className="text-[11px] text-slate-400 font-normal">{user?.email}</div>
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900" />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;




