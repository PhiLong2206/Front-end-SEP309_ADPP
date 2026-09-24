import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  BarChart2,
  Globe,
  Users,
  Layers,
  Trophy,
  Star,
  Play,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { ROLES } from "../../../utils/constants";
import GoogleLoginButton from "../../../components/auth/GoogleLoginButton";
import authApi from "../../../api/authApi";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { login, googleLogin, isAuthenticated, role } = useAuth();

  // Auth Card State
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("nguyenphilong226@gmail.com");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="bg-[#070b14] text-slate-100 min-h-[calc(100vh-80px)] relative overflow-hidden flex flex-col justify-between">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-32 right-1/4 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[700px] h-[400px] bg-purple-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Section */}
      <section className="max-w-[1400px] mx-auto px-6 sm:px-12 py-8 sm:py-12 w-full relative z-10 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* ================= LEFT HERO COLUMN (col-span-7) ================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Sparkle Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/40 backdrop-blur-md shadow-lg shadow-blue-500/10">
              <Sparkles size={14} className="text-cyan-400" />
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                Nền tảng tranh biện AI thế hệ mới • Chuẩn Quốc tế
              </span>
            </div>

            {/* 2. Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.12] text-white">
              Lập luận sắc bén. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-400">
                Tranh biện đỉnh cao.
              </span>
            </h1>

            {/* 3. Description Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
              Nâng tầm tư duy phản biện với trợ lý AI đối kháng thông minh, mô phỏng luật tranh biện WSDC & BP, cùng hệ thống phân tích logic và chấm điểm Rubric đa tiêu chí theo thời gian thực.
            </p>

            {/* 4. Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                to={isAuthenticated ? "/learner/dashboard" : "/learner/topics"}
                className="px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-full shadow-xl shadow-blue-600/30 transition-all duration-300 hover:scale-102 inline-flex items-center gap-2 group"
              >
                <span>Bắt đầu luyện tập ngay</span>
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#demo-video"
                className="px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 hover:text-white rounded-full border border-slate-700/80 shadow-md backdrop-blur-md transition-all inline-flex items-center gap-2"
              >
                <Play size={15} className="text-slate-300 fill-slate-300" />
                <span>Xem video giới thiệu</span>
              </a>
            </div>

            {/* 5. Three Key Feature Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
              {/* Feature 1: AI Đối kháng */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0 shadow-inner">
                  <Brain size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base leading-snug">
                    AI đối kháng thông minh
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-snug">
                    Phản biện đa chiều, logic chặt chẽ
                  </p>
                </div>
              </div>

              {/* Feature 2: Rubric */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-cyan-600/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 shadow-inner">
                  <BarChart2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base leading-snug">
                    Chấm điểm Rubric tự động
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-snug">
                    Đánh giá khách quan theo chuẩn quốc tế
                  </p>
                </div>
              </div>

              {/* Feature 3: Đa dạng chủ đề */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center shrink-0 shadow-inner">
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm sm:text-base leading-snug">
                    Đa dạng chủ đề thực tế
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-snug">
                    Từ giáo dục, công nghệ đến các vấn đề xã hội
                  </p>
                </div>
              </div>
            </div>

            {/* 6. Four Metrics Stats Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-lg grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              <div className="flex items-center gap-3">
                <div className="text-blue-400">
                  <Users size={22} />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-white leading-tight">50K+</div>
                  <div className="text-[11px] text-slate-400 leading-tight">Người dùng đã tham gia</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-cyan-400">
                  <Layers size={22} />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-white leading-tight">1,000+</div>
                  <div className="text-[11px] text-slate-400 leading-tight">Chủ đề tranh biện đa lĩnh vực</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-amber-400">
                  <Trophy size={22} />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-white leading-tight">3</div>
                  <div className="text-[11px] text-slate-400 leading-tight">Chế độ tranh biện (WSDC, BP, Tự do)</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-rose-400">
                  <Star size={22} />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-white leading-tight">95%</div>
                  <div className="text-[11px] text-slate-400 leading-tight">Người dùng hài lòng về trải nghiệm</div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT AUTH CARD (col-span-5) ================= */}
          <div className="lg:col-span-5 relative w-full">
            {/* Ambient Backlight behind the Auth Card */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/30 via-indigo-600/20 to-purple-600/30 rounded-3xl blur-2xl -z-10" />

            <div className="bg-[#0e1626]/90 backdrop-blur-2xl rounded-3xl border border-slate-700/70 p-7 sm:p-9 shadow-2xl shadow-blue-950/80 text-white relative z-10 w-full max-w-lg mx-auto">


              {/* Card Header with Logo */}
              <div className="flex flex-col items-center text-center space-y-2 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-600/40 mb-1">
                  A
                </div>
                <div className="flex items-center gap-1.5 justify-center">
                  <span className="font-extrabold text-base tracking-tight text-white">ADPP</span>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                    AI DEBATE PLATFORM
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white pt-1">
                  {authMode === "login" ? "Chào mừng trở lại!" : "Tạo tài khoản mới"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto">
                  {authMode === "login"
                    ? "Đăng nhập để tiếp tục hành trình rèn luyện kỹ năng tranh biện cùng AI."
                    : "Khám phá đấu trường tranh biện học thuật hàng đầu."}
                </p>
              </div>

              {/* Segmented Tab Pill Selector */}
              <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    authMode === "login"
                      ? "bg-slate-800 text-white shadow-md border border-slate-700"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <LogIn size={15} />
                  <span>Đăng nhập</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setError("");
                    setSuccessMsg("");
                  }}
                  className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    authMode === "register"
                      ? "bg-slate-800 text-white shadow-md border border-slate-700"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <UserPlus size={15} />
                  <span>Tạo tài khoản</span>
                </button>
              </div>

              {/* Alert Messages */}
              {error && (
                <div className="p-3.5 mb-4 text-xs sm:text-sm rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-medium animate-fade-in flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 mb-4 text-xs sm:text-sm rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium animate-fade-in flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Google Button */}
              <div className="mb-4">
                <GoogleLoginButton
                  onSuccess={handleGoogleSuccess}
                  onError={(msg) => setError(msg)}
                  disabled={loading}
                  text="Tiếp tục với Google"
                />
              </div>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
                  <span className="bg-[#0e1626] px-3 text-slate-400 font-bold tracking-wider">
                    HOẶC {authMode === "login" ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"} BẰNG EMAIL
                  </span>
                </div>
              </div>

              {/* TAB 1: LOGIN FORM */}
              {authMode === "login" ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                      Địa chỉ Email <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nguyenphilong226@gmail.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                      Mật khẩu <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock size={16} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                        title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400 select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Ghi nhớ đăng nhập</span>
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-600/30 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <LogIn size={18} />
                        <span>Đăng nhập hệ thống</span>
                      </>
                    )}
                  </button>

                  <div className="text-center text-xs sm:text-sm text-slate-400 pt-2 font-medium">
                    Chưa có tài khoản?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthMode("register")}
                      className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
                    >
                      Đăng ký ngay
                    </button>
                  </div>
                </form>
              ) : (
                /* TAB 2: REGISTER FORM */
                <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                      Họ và tên <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      required
                      className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                      Địa chỉ Email <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Mail size={16} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                        Mật khẩu (≥ 8 ký tự) <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5">
                        Xác nhận mật khẩu <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl text-sm sm:text-base font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-600/30 transition-all duration-200 active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus size={18} />
                        <span>Tạo tài khoản & Nhận OTP</span>
                      </>
                    )}
                  </button>

                  <div className="text-center text-xs sm:text-sm text-slate-400 pt-2 font-medium">
                    Đã có tài khoản?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline"
                    >
                      Đăng nhập ngay
                    </button>
                  </div>
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


