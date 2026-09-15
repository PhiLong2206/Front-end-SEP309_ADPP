import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/constants";
import { LogOut } from "lucide-react";

const PublicLayout: React.FC = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (role === ROLES.ADMIN) return "/admin/dashboard";
    if (role === ROLES.EDUCATOR) return "/educator/dashboard";
    return "/learner/dashboard";
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Compact White Navigation Bar */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          {/* Left Brand Area */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 font-black text-base text-slate-900">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                A
              </div>
              <span className="tracking-tight font-extrabold text-slate-900">ADPP</span>
            </Link>

            <div className="h-4 w-px bg-slate-300 hidden sm:block" />

            <span className="text-xs text-slate-500 font-normal hidden md:inline">
              Nền tảng luyện tập tranh biện AI
            </span>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            <Link to="/" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              Trang chủ
            </Link>
            <a href="#methods" className="hover:text-blue-600 transition-colors">
              Phương pháp
            </a>
            <a href="#featured-topics" className="hover:text-blue-600 transition-colors">
              Chủ đề nổi bật
            </a>
            <a href="#about" className="hover:text-blue-600 transition-colors">
              Về dự án
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-medium text-slate-700 hidden sm:inline max-w-[150px] truncate">
                  {user?.fullName || "Người dùng"}
                </span>

                <Link
                  to={getDashboardPath()}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Bảng điều khiển
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1"
                  title="Đăng xuất"
                >
                  <LogOut size={13} />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Đăng ký
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
