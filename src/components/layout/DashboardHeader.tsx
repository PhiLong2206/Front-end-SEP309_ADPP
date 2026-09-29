import React from "react";
import { Bell, Sparkles, Menu, Sun, Moon } from "lucide-react";
import UserAvatarDropdown from "./UserAvatarDropdown";
import { useTheme } from "../../hooks/useTheme";

export interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  onMenuClick?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  action,
  onMenuClick,
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-colors duration-200">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden cursor-pointer"
            title="Mở menu"
          >
            <Menu size={20} />
          </button>
        )}

        {title ? (
          <div>
            <h1 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-slate-100 leading-tight">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/40 text-xs font-bold text-[#008A64] dark:text-emerald-400">
              <Sparkles size={13} className="text-[#008A64] dark:text-emerald-400" />
              <span>Nền tảng Luyện tập Tranh biện AI</span>
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {action && <div>{action}</div>}

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-[#101F1A] hover:bg-slate-100 dark:hover:bg-[#172C23] border border-slate-200 dark:border-[rgba(148,163,184,0.18)] flex items-center justify-center text-slate-700 dark:text-amber-400 hover:text-slate-900 transition-all duration-200 shadow-xs cursor-pointer active:scale-95 group"
          title={resolvedTheme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
          aria-label={resolvedTheme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
        >
          {resolvedTheme === "dark" ? (
            <Sun size={17} className="text-amber-400 transition-transform duration-200 group-hover:rotate-45" />
          ) : (
            <Moon size={17} className="text-slate-600 transition-transform duration-200 group-hover:-rotate-12" />
          )}
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 text-slate-500 hover:text-[#008A64] dark:text-slate-400 dark:hover:text-emerald-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Thông báo"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#008A64] ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* User avatar & logout dropdown */}
        <div className="pl-2 border-l border-slate-200 dark:border-slate-800">
          <UserAvatarDropdown />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;



