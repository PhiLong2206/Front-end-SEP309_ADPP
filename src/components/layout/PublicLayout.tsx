import React, { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import Footer from "./Footer";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/constants";
import { LogOut, Moon, LayoutDashboard, ArrowRight } from "lucide-react";

const PublicLayout: React.FC = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const getDashboardPath = () => {
    const userRole = String(role);
    if (userRole === "Administrator" || userRole === "Admin" || userRole === ROLES.ADMIN) return "/admin/dashboard";
    if (userRole === "Educator" || userRole === ROLES.EDUCATOR) return "/educator/dashboard";
    return "/learner/dashboard";
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { label: "Trang chủ", path: "/" },
    { label: "Phương pháp", path: "/#methods" },
    { label: "Chủ đề nổi bật", path: "/#featured-topics" },
    { label: "Kho đề tài", path: "/learner/topics" },
    { label: "Bảng xếp hạng", path: "/#leaderboard" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#070b14] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Exact Reference Top Navigation Bar */}
      <header className="h-20 bg-[#070b14]/90 backdrop-blur-xl border-b border-slate-800/60 px-6 sm:px-12 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between">
          {/* Left Brand Area */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
              A
            </div>
            <div className="flex flex-col">
              <span className="tracking-tight font-extrabold text-lg text-white leading-tight">
                ADPP
              </span>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest leading-none">
                NỀN TẢNG TRANH BIỆN AI
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path && !item.path.includes("#");
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`relative py-1.5 transition-colors hover:text-white ${
                    isActive ? "text-cyan-400 font-semibold" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full shadow-sm shadow-cyan-400/50" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3.5">
            {/* Dark Mode Icon Toggle */}
            <button
              type="button"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-10 h-10 rounded-full bg-slate-900/90 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-inner"
              title="Giao diện tối"
            >
              <Moon size={17} />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <LayoutDashboard size={16} />
                  <span>Bảng điều khiển</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-full transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-semibold text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-full transition-all shadow-sm"
                >
                  Đăng nhập
                </Link>

                <Link
                  to="/register"
                  className="px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-full transition-all shadow-lg shadow-blue-600/30 hover:scale-102 flex items-center gap-1.5"
                >
                  <span>Bắt đầu ngay</span>
                  <ArrowRight size={16} />
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


