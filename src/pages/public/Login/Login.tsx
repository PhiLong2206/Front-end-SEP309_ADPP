import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import GoogleLoginButton from "../../../components/auth/GoogleLoginButton";
import AuthLayout from "../../../components/auth/AuthLayout";
import PasswordInput from "../../../components/auth/PasswordInput";
import { useAuth } from "../../../hooks/useAuth";
import { ROLES } from "../../../utils/constants";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(
    (location.state as { message?: string })?.message || null
  );

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleRoleRedirect = (role?: string) => {
    const userRole = String(role);
    if (userRole === "Administrator" || userRole === "Admin" || userRole === ROLES.ADMIN) {
      navigate("/admin/dashboard");
    } else if (userRole === "Educator" || userRole === ROLES.EDUCATOR) {
      navigate("/educator/dashboard");
    } else {
      navigate("/learner/dashboard");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || isSuccess) return;

    setError("");

    if (!email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }

    setLoading(true);

    try {
      const result = await login({ email: email.trim(), password });

      if (result.success && result.user) {
        setIsSuccess(true);
        setTimeout(() => {
          handleRoleRedirect(result.user?.role);
        }, 400);
      } else {
        setError(result.message || "Email hoặc mật khẩu không chính xác.");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || "Email hoặc mật khẩu không chính xác.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (idToken: string) => {
    if (loading || isSuccess) return;
    setError("");
    setLoading(true);

    try {
      const result = await googleLogin(idToken);
      if (result.success && result.user) {
        setIsSuccess(true);
        setTimeout(() => {
          handleRoleRedirect(result.user?.role);
        }, 400);
      } else {
        setError(result.message || "Xác thực tài khoản Google thất bại.");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || "Lỗi đăng nhập Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Chào mừng trở lại"
      subtitle="Đăng nhập để tiếp tục với AI Debate Platform"
      badge="Đăng nhập tài khoản"
      showVisualSidebar={true}
    >
      {/* Logout Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 mb-4 text-xs sm:text-sm rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 font-medium animate-fade-in flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 size={17} className="text-[#008A64] dark:text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3.5 mb-4 text-xs sm:text-sm rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium animate-fade-in flex items-start gap-2.5">
          <AlertCircle size={17} className="text-rose-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Notification during redirect */}
      {isSuccess && (
        <div className="p-3.5 mb-4 text-xs sm:text-sm rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium animate-fade-in flex items-center gap-2.5">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>Đăng nhập thành công! Đang chuyển hướng...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="login-email" className="text-xs sm:text-sm font-semibold text-slate-800">
            Địa chỉ Email <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail size={16} />
            </div>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              autoFocus
              disabled={loading || isSuccess}
              className="w-full py-2.5 sm:py-3 pl-10 pr-4 text-sm sm:text-base bg-white border border-[#E5E7EB] hover:border-slate-300 rounded-xl text-[#101828] placeholder:text-[#98A2B3] transition-all duration-200 outline-none focus:border-[#00966F] focus:ring-2 focus:ring-[#00966F]/15 disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
        </div>

        {/* Password Field */}
        <PasswordInput
          id="login-password"
          label="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          required
          disabled={loading || isSuccess}
        />

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer text-[#667085] select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading || isSuccess}
              className="w-4 h-4 rounded border-[#E5E7EB] text-[#00966F] focus:ring-[#00966F] cursor-pointer"
            />
            <span>Ghi nhớ đăng nhập</span>
          </label>

          <Link
            to="/forgot-password"
            className="text-[#00966F] hover:text-[#007F5F] font-semibold transition-colors hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || isSuccess}
          className="w-full py-3 sm:py-3.5 px-4 rounded-xl text-sm sm:text-base font-bold text-white bg-[#00966F] hover:bg-[#007F5F] active:bg-[#006e52] transition-all duration-200 shadow-md shadow-[#00966F]/20 flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang đăng nhập...</span>
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 size={18} className="text-white" />
              <span>Thành công</span>
            </>
          ) : (
            <span>Đăng nhập</span>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E7EB]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#FFFDF8] px-3 text-[#98A2B3] font-semibold tracking-wider">
            hoặc
          </span>
        </div>
      </div>

      {/* Google Login Button */}
      <div className="mb-4">
        <GoogleLoginButton
          onSuccess={handleGoogleSuccess}
          onError={(msg) => setError(msg)}
          disabled={loading || isSuccess}
          text="Tiếp tục với Google"
        />
      </div>

      {/* Register link */}
      <div className="text-center text-xs sm:text-sm text-slate-600 pt-3 border-t border-slate-100 font-medium">
        Chưa có tài khoản?{" "}
        <Link
          to="/register"
          className="text-[#008A64] hover:text-[#007457] font-bold hover:underline ml-1"
        >
          Đăng ký ngay
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
