import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { Moon, Sun } from "lucide-react";
import UserAvatarDropdown from "./UserAvatarDropdown";

const PublicLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { resolvedTheme, toggleTheme } = useTheme();

  const navLinks = [
    { label: "Trang chủ", path: "/" },
    { label: "Phương pháp", path: "/#methods", hash: "methods" },
    { label: "Chủ đề nổi bật", path: "/#featured-topics", hash: "featured-topics" },
    { label: "Kho đề tài", path: "/learner/topics" },
    { label: "Bảng xếp hạng", path: "/#leaderboard", hash: "leaderboard" },
  ];

  const handleNavClick = (e: React.MouseEvent, item: typeof navLinks[0]) => {
    if (item.hash) {
      if (location.pathname === "/") {
        e.preventDefault();
        const targetEl = document.getElementById(item.hash);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth" });
        } else {
          window.scrollTo({ top: 600, behavior: "smooth" });
        }
      } else {
        navigate(`/#${item.hash}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#00966F] selection:text-white bg-[#FAF9F4] dark:bg-[#07110E] text-[#101828] dark:text-[#F8FAFC] transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="h-20 bg-white/94 dark:bg-[rgba(8,18,15,0.95)] backdrop-blur-md border-b border-[#E5E7EB] dark:border-[rgba(148,163,184,0.15)] px-6 sm:px-12 sticky top-0 z-50 shadow-xs transition-colors duration-200">
        <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between">
          {/* Left Brand Area */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-[#00966F] dark:bg-[#10B981] flex items-center justify-center text-white font-black text-lg shadow-md shadow-[#00966F]/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              A
            </div>
            <div className="flex flex-col">
              <span className="tracking-tight font-extrabold text-lg text-[#101828] dark:text-[#F8FAFC] leading-tight group-hover:text-[#00966F] dark:group-hover:text-[#34D399] transition-colors">
                ADPP
              </span>
              <span className="text-[10px] font-bold text-[#00966F] dark:text-[#34D399] uppercase tracking-wider leading-none">
                NỀN TẢNG TRANH BIỆN AI
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            {navLinks.map((item) => {
              const isDirectActive = location.pathname === item.path;
              const isHashMatch = Boolean(item.hash && location.hash === `#${item.hash}`);
              const isActive = isDirectActive || isHashMatch;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`relative py-2 transition-all duration-200 group flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "text-[#00966F] dark:text-[#34D399] font-bold"
                      : "text-[#475467] dark:text-[#94A3B8] hover:text-[#00966F] dark:hover:text-[#34D399]"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00966F] dark:bg-[#34D399] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Sun / Moon Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-white dark:bg-[#101F1A] hover:bg-slate-50 dark:hover:bg-[#172C23] border border-[#E5E7EB] dark:border-[rgba(148,163,184,0.18)] flex items-center justify-center text-slate-700 dark:text-amber-400 hover:text-slate-900 transition-all duration-200 shadow-xs cursor-pointer active:scale-95 group"
              title={resolvedTheme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
              aria-label={resolvedTheme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            >
              {resolvedTheme === "dark" ? (
                <Sun size={18} className="text-amber-400 transition-transform duration-200 group-hover:rotate-45" />
              ) : (
                <Moon size={18} className="text-[#475467] transition-transform duration-200 group-hover:-rotate-12" />
              )}
            </button>

            {isAuthenticated ? (
              <UserAvatarDropdown />
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-semibold text-[#101828] dark:text-[#F8FAFC] hover:text-[#00966F] dark:hover:text-[#34D399] bg-white dark:bg-[#101F1A] hover:bg-slate-50 dark:hover:bg-[#172C23] border border-[#E5E7EB] dark:border-[rgba(148,163,184,0.20)] rounded-full transition-all shadow-xs active:scale-98"
                >
                  Đăng nhập
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-bold bg-[#00966F] hover:bg-[#007F5F] dark:bg-[#10B981] dark:hover:bg-[#34D399] active:bg-[#006e52] text-white rounded-full transition-all shadow-md shadow-[#00966F]/20 hover:scale-102 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Bắt đầu ngay</span>
                  <span className="text-base font-bold leading-none">+</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;



