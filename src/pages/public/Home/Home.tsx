import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  BarChart2,
  Globe,
  Play,
  Mail,
  LogIn,
  UserPlus,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { ROLES } from "../../../utils/constants";
import GoogleLoginButton from "../../../components/auth/GoogleLoginButton";
import PasswordInput from "../../../components/auth/PasswordInput";
import PasswordStrength from "../../../components/auth/PasswordStrength";
import PasswordRequirements from "../../../components/auth/PasswordRequirements";
import ConfirmPasswordInput from "../../../components/auth/ConfirmPasswordInput";
import authApi from "../../../api/authApi";

import natureBg from "../../../assets/images/nature-bg.jpg";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { login, googleLogin, isAuthenticated, role } = useAuth();

  // Auth Card State
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRoleRedirect = (userRole?: string) => {
    const r = String(userRole || role);
    if (r === "Administrator" || r === "Admin" || r === ROLES.ADMIN) {
      navigate("/admin/dashboard");
    } else if (r === "Educator" || r === ROLES.EDUCATOR) {
      navigate("/educator/dashboard");
    } else {
      navigate("/learner/dashboard");
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const result = await login({ email: email.trim(), password });
      if (result.success && result.user) {
        handleRoleRedirect(result.user.role);
      } else {
        setError(result.message || "Email hoặc mật khẩu không chính xác.");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!fullName.trim() || !email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ thông tin đăng ký.");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });

      if (res && res.success) {
        setSuccessMsg("Mã OTP đã được gửi đến email của bạn. Đang chuyển đến trang xác thực...");
        setTimeout(() => {
          navigate("/verify-otp", { state: { email: email.trim(), type: "Registration" } });
        }, 1500);
      } else {
        setError(res?.message || "Đăng ký không thành công.");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || "Lỗi đăng ký tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (idToken: string) => {
    setError("");
    setLoading(true);
    try {
      const result = await googleLogin(idToken);
      if (result.success && result.user) {
        handleRoleRedirect(result.user.role);
      } else {
        setError(result.message || "Xác thực Google thất bại.");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || "Lỗi đăng nhập Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] relative overflow-hidden flex flex-col justify-center bg-[#FAF9F4] dark:bg-[#07110E] text-[#101828] dark:text-[#F8FAFC]">
      {/* Background Nature Image - bright, clear, full sunlight */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url(${natureBg})`,
        }}
      />
      {/* Local light warm gradient behind text on the left (matches HÌNH 1) */}
      <div
        className="absolute inset-0 pointer-events-none dark:hidden"
        style={{
          background:
            "linear-gradient(90deg, rgba(250,249,244,0.88) 0%, rgba(250,249,244,0.60) 35%, rgba(250,249,244,0.15) 60%, rgba(250,249,244,0) 75%)",
        }}
      />
      {/* Extremely subtle overall white veil for maximum readability while keeping sunlight and greenery */}
      <div className="absolute inset-0 bg-white/[0.08] dark:hidden pointer-events-none" />

      {/* Dark Forest Overlay ONLY in Dark Mode */}
      <div
        className="absolute inset-0 hidden dark:block pointer-events-none"
        style={{
          background: "linear-gradient(rgba(4, 15, 11, 0.65), rgba(4, 15, 11, 0.65))",
        }}
      />

      {/* Main Container */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-12 py-10 sm:py-16 w-full relative z-10 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ================= LEFT HERO COLUMN (col-span-7) ================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Sparkle Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 dark:bg-[#12231C]/90 backdrop-blur-md border border-[#D8EADF] dark:border-slate-800 shadow-xs text-[#101828] dark:text-[#F8FAFC]">
              <Sparkles size={14} className="text-[#00966F] dark:text-[#34D399]" />
              <span className="text-xs sm:text-sm font-semibold text-[#475467] dark:text-[#CBD5E1]">
                Nền tảng tranh biện AI thế hệ mới • <span className="text-[#00966F] dark:text-[#34D399] font-bold">Chuẩn Quốc tế</span>
              </span>
            </div>

            {/* 2. Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.12] text-[#101828] dark:text-[#F8FAFC]">
              Lập luận sắc bén. <br />
              <span className="text-[#00966F] dark:text-[#34D399] font-black">
                Tranh biện đỉnh cao.
              </span>
            </h1>

            {/* 3. Description Subtitle */}
            <p className="text-sm sm:text-base text-[#475467] dark:text-[#CBD5E1] leading-relaxed font-normal max-w-xl">
              Nâng tầm tư duy phản biện với trợ lý AI đối kháng thông minh, mô phỏng luật tranh biện WSDC & BP, cùng hệ thống phân tích logic và chấm điểm Rubric đa tiêu chí theo thời gian thực.
            </p>

            {/* 4. Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                to={isAuthenticated ? "/learner/dashboard" : "/learner/topics"}
                className="px-8 py-3.5 text-sm sm:text-base font-bold text-white bg-[#00966F] hover:bg-[#007F5F] active:bg-[#006e52] rounded-full shadow-lg shadow-[#00966F]/25 transition-all duration-300 hover:scale-102 inline-flex items-center gap-2.5 group cursor-pointer"
              >
                <span>Bắt đầu luyện tập ngay</span>
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#demo-video"
                className="px-7 py-3.5 text-sm sm:text-base font-bold text-[#101828] dark:text-[#F8FAFC] bg-white/90 dark:bg-[#101F1A] hover:bg-white dark:hover:bg-[#172C23] rounded-full border border-[#E5E7EB] dark:border-[rgba(148,163,184,0.20)] shadow-xs transition-all inline-flex items-center gap-2.5"
              >
                <div className="w-6 h-6 rounded-full bg-[#101828] dark:bg-[#12231C] flex items-center justify-center text-white">
                  <Play size={10} className="fill-white ml-0.5" />
                </div>
                <span>Xem video giới thiệu</span>
              </a>
            </div>

            {/* 5. Three Key Feature Cards (matching HÌNH 1) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
              {/* Feature 1: AI Đối kháng */}
              <div className="p-4 rounded-2xl bg-[#FFFDF8]/95 dark:bg-[#12231C]/90 backdrop-blur-md border border-[#E5E7EB] dark:border-[rgba(148,163,184,0.18)] shadow-sm flex items-start gap-3 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-full bg-[#00966F] dark:bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Brain size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#101828] dark:text-[#F8FAFC] text-xs sm:text-sm leading-snug">
                    AI đối kháng thông minh
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#667085] dark:text-[#94A3B8] mt-1 leading-snug flex items-center gap-1">
                    <span>Phản biện đa chiều, logic chặt chẽ</span>
                    <ArrowRight size={12} className="inline shrink-0 text-[#00966F] dark:text-[#34D399]" />
                  </p>
                </div>
              </div>

              {/* Feature 2: Rubric */}
              <div className="p-4 rounded-2xl bg-[#FFFDF8]/95 dark:bg-[#12231C]/90 backdrop-blur-md border border-[#E5E7EB] dark:border-[rgba(148,163,184,0.18)] shadow-sm flex items-start gap-3 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-full bg-[#00966F] dark:bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <BarChart2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#101828] dark:text-[#F8FAFC] text-xs sm:text-sm leading-snug">
                    Chấm điểm Rubric tự động
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#667085] dark:text-[#94A3B8] mt-1 leading-snug flex items-center gap-1">
                    <span>Đánh giá khách quan theo chuẩn quốc tế</span>
                    <ArrowRight size={12} className="inline shrink-0 text-[#00966F] dark:text-[#34D399]" />
                  </p>
                </div>
              </div>

              {/* Feature 3: Đa dạng chủ đề */}
              <div className="p-4 rounded-2xl bg-[#FFFDF8]/95 dark:bg-[#12231C]/90 backdrop-blur-md border border-[#E5E7EB] dark:border-[rgba(148,163,184,0.18)] shadow-sm flex items-start gap-3 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-full bg-[#00966F] dark:bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#101828] dark:text-[#F8FAFC] text-xs sm:text-sm leading-snug">
                    Đa dạng chủ đề thực tế
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#667085] dark:text-[#94A3B8] mt-1 leading-snug flex items-center gap-1">
                    <span>Từ giáo dục, công nghệ đến xã hội</span>
                    <ArrowRight size={12} className="inline shrink-0 text-[#00966F] dark:text-[#34D399]" />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT AUTH CARD (col-span-5) ================= */}
          <div className="lg:col-span-5 relative w-full">
            <div className="bg-[#FFFDF8]/97 dark:bg-[#0F1C17]/98 backdrop-blur-md rounded-3xl border border-white/80 dark:border-[rgba(148,163,184,0.20)] p-6 sm:p-8 shadow-xl shadow-slate-900/5 dark:shadow-black/60 text-[#101828] dark:text-[#F8FAFC] relative z-10 w-full max-w-[430px] mx-auto transition-colors duration-200">
              {/* Card Header with Logo */}
              <div className="flex flex-col items-center text-center space-y-1.5 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-[#00966F] dark:bg-[#10B981] flex items-center justify-center font-black text-xl text-white shadow-md shadow-[#00966F]/25 mb-0.5">
                  A
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  <span className="font-black text-xs tracking-tight text-[#101828] dark:text-[#F8FAFC]">ADPP</span>
                  <span className="text-[10px] font-bold text-[#00966F] dark:text-[#34D399] uppercase tracking-wider">
                    • NỀN TẢNG TRANH BIỆN AI
                  </span>
                </div>
                <h2 className="text-2xl font-black tracking-tight text-[#101828] dark:text-[#F8FAFC] pt-0.5">
                  {authMode === "login" ? "Chào mừng trở lại!" : "Tạo tài khoản mới"}
                </h2>
                <p className="text-[11px] sm:text-xs text-[#667085] dark:text-[#94A3B8] max-w-[280px] mx-auto leading-relaxed">
                  {authMode === "login"
                    ? "Đăng nhập để tiếp tục hành trình rèn luyện kỹ năng tranh biện cùng AI."
                    : "Khám phá đấu trường tranh biện học thuật hàng đầu cùng AI."}
                </p>
              </div>

              {/* Segmented Tab Pill Selector */}
              <div className="grid grid-cols-2 p-1 bg-[#F2F4F7] dark:bg-[#101F1A] rounded-full border border-[#E5E7EB] dark:border-[rgba(148,163,184,0.18)] mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className={`py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMode === "login"
                      ? "bg-[#00966F] text-white shadow-xs"
                      : "text-[#667085] dark:text-[#94A3B8] hover:text-[#101828] dark:hover:text-[#F8FAFC]"
                  }`}
                >
                  <LogIn size={14} />
                  <span>Đăng nhập</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className={`py-2 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    authMode === "register"
                      ? "bg-[#00966F] text-white shadow-xs"
                      : "text-[#667085] dark:text-[#94A3B8] hover:text-[#101828] dark:hover:text-[#F8FAFC]"
                  }`}
                >
                  <UserPlus size={14} />
                  <span>Tạo tài khoản</span>
                </button>
              </div>

              {/* Alert Messages */}
              {error && (
                <div className="p-3 mb-3.5 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 font-medium animate-fade-in flex items-start gap-2">
                  <AlertCircle size={15} className="text-rose-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 mb-3.5 text-xs rounded-xl bg-emerald-50 dark:bg-[rgba(16,185,129,0.12)] border border-emerald-200 dark:border-[rgba(16,185,129,0.25)] text-emerald-700 dark:text-[#34D399] font-medium animate-fade-in flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-[#34D399] shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Google Button */}
              <div className="mb-3.5">
                <GoogleLoginButton
                  onSuccess={handleGoogleSuccess}
                  onError={(msg) => setError(msg)}
                  disabled={loading}
                  text="Đăng nhập bằng Google"
                />
              </div>

              {/* Divider */}
              <div className="relative my-3.5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5E7EB] dark:border-[rgba(148,163,184,0.20)]" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-[#FFFDF8] dark:bg-[#0F1C17] px-2.5 text-[#98A2B3] dark:text-[#94A3B8] font-bold tracking-wider">
                    HOẶC {authMode === "login" ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"} BẰNG EMAIL
                  </span>
                </div>
              </div>

              {/* TAB 1: LOGIN FORM */}
              {authMode === "login" ? (
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[#101828] dark:text-[#F8FAFC]">
                      Địa chỉ Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail size={15} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 bg-white dark:bg-[#12231C] border border-[#E5E7EB] hover:border-slate-300 dark:border-[rgba(148,163,184,0.20)] dark:hover:border-[rgba(148,163,184,0.30)] rounded-xl text-xs sm:text-sm text-[#101828] dark:text-[#F8FAFC] placeholder-[#98A2B3] dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00966F]/15 dark:focus:ring-[#10B981]/20 focus:border-[#00966F] dark:focus:border-[#10B981] transition-all"
                      />
                    </div>
                  </div>

                  <PasswordInput
                    label="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    disabled={loading}
                  />

                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[#667085] dark:text-[#94A3B8] select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-[#E5E7EB] text-[#00966F] focus:ring-[#00966F]"
                      />
                      <span>Ghi nhớ đăng nhập</span>
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-[#00966F] dark:text-[#34D399] hover:text-[#007F5F] dark:hover:text-emerald-300 font-semibold hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#00966F] hover:bg-[#007F5F] active:bg-[#006e52] shadow-md shadow-[#00966F]/20 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Đăng nhập</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* TAB 2: REGISTER FORM */
                <form onSubmit={handleRegisterSubmit} className="space-y-3 animate-fade-in">
                  <div>
                    <label className="block text-xs font-semibold text-[#101828] dark:text-[#F8FAFC] mb-1">
                      Họ và tên <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      required
                      className="w-full px-3.5 py-2 bg-white dark:bg-[#12231C] border border-[#E5E7EB] hover:border-slate-300 dark:border-[rgba(148,163,184,0.20)] dark:hover:border-[rgba(148,163,184,0.30)] rounded-xl text-xs sm:text-sm text-[#101828] dark:text-[#F8FAFC] placeholder-[#98A2B3] dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00966F]/15 dark:focus:ring-[#10B981]/20 focus:border-[#00966F] dark:focus:border-[#10B981] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#101828] dark:text-[#F8FAFC] mb-1">
                      Địa chỉ Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail size={15} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                        className="w-full pl-9 pr-3.5 py-2 bg-white dark:bg-[#12231C] border border-[#E5E7EB] hover:border-slate-300 dark:border-[rgba(148,163,184,0.20)] dark:hover:border-[rgba(148,163,184,0.30)] rounded-xl text-xs sm:text-sm text-[#101828] dark:text-[#F8FAFC] placeholder-[#98A2B3] dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#00966F]/15 dark:focus:ring-[#10B981]/20 focus:border-[#00966F] dark:focus:border-[#10B981] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <PasswordInput
                      label="Mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      disabled={loading}
                    />
                    <PasswordStrength password={password} />
                    <PasswordRequirements password={password} />
                  </div>

                  <ConfirmPasswordInput
                    label="Xác nhận mật khẩu"
                    value={confirmPassword}
                    originalPassword={password}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#00966F] hover:bg-[#007F5F] active:bg-[#006e52] shadow-md shadow-[#00966F]/20 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus size={15} />
                        <span>Tạo tài khoản & Nhận OTP</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;



