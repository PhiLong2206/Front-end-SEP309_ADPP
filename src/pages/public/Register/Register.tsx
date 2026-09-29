import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleLoginButton from "../../../components/auth/GoogleLoginButton";
import AuthLayout from "../../../components/auth/AuthLayout";
import PasswordInput from "../../../components/auth/PasswordInput";
import PasswordStrength from "../../../components/auth/PasswordStrength";
import PasswordRequirements from "../../../components/auth/PasswordRequirements";
import ConfirmPasswordInput from "../../../components/auth/ConfirmPasswordInput";
import authApi from "../../../api/authApi";
import { useAuth } from "../../../hooks/useAuth";
import { ROLES } from "../../../utils/constants";
import {
  Mail,
  User as UserIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password) {
      setError("Vui lòng điền đầy đủ các trường thông tin.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (res && res.success) {
        setSuccessMsg(res.message || "Mã OTP đã được gửi về email của bạn.");
        setCountdown(60);
        setStep("otp");
      } else {
        setError(res?.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || "Không thể kết nối đến máy chủ xác thực.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!otpCode.trim()) {
      setError("Vui lòng nhập mã OTP 6 chữ số.");
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.verifyRegisterOtp({
        email: formData.email.trim(),
        otpCode: otpCode.trim(),
      });

      if (res && res.success) {
        setSuccessMsg("Kích hoạt tài khoản thành công! Đang chuyển đến trang đăng nhập...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(res?.message || "Mã OTP không chính xác hoặc đã hết hạn.");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || "Mã OTP không hợp lệ.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setResending(true);
    try {
      const res = await authApi.sendOtp({
        email: formData.email.trim(),
        type: "Registration",
      });
      if (res && res.success) {
        setSuccessMsg("Mã OTP mới đã được gửi lại vào email của bạn.");
        setCountdown(60);
      } else {
        setError(res?.message || "Không thể gửi lại mã OTP.");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || "Gửi lại OTP thất bại.");
    } finally {
      setResending(false);
    }
  };

  const handleGoogleSuccess = async (idToken: string) => {
    setError("");
    setLoading(true);
    try {
      const result = await googleLogin(idToken);
      if (result.success && result.user) {
        setSuccessMsg("Đăng nhập bằng Google thành công! Đang chuyển hướng...");
        setTimeout(() => {
          handleRoleRedirect(result.user?.role);
        }, 400);
      } else {
        setError(result.message || "Xác thực tài khoản Google thất bại.");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || "Lỗi xác thực Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={step === "form" ? "Tạo tài khoản mới" : "Xác thực Email OTP"}
      subtitle={
        step === "form"
          ? "Gia nhập nền tảng rèn luyện tranh biện AI chuẩn Quốc tế"
          : `Nhập mã xác thực 6 chữ số vừa được gửi đến email: ${formData.email}`
      }
      badge={step === "form" ? "Đăng ký thành viên" : "Bước 2: Xác thực OTP"}
      showVisualSidebar={true}
    >
      {/* Top Step Indicator */}
      <div className="flex items-center justify-center gap-3 mb-6 pb-2">
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            step === "form"
              ? "bg-[#008A64] text-white shadow-xs"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-[11px]">
            1
          </span>
          <span>Thông tin tài khoản</span>
        </div>

        <div className="w-6 h-0.5 bg-slate-200" />

        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
            step === "otp"
              ? "bg-[#008A64] text-white shadow-xs"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-[11px]">
            2
          </span>
          <span>Xác thực OTP</span>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="p-3.5 mb-4 text-xs sm:text-sm rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium animate-fade-in flex items-start gap-2.5">
          <AlertCircle size={17} className="text-rose-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 mb-4 text-xs sm:text-sm rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium animate-fade-in flex items-center gap-2.5">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {step === "form" ? (
        <div className="space-y-4">
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-fullname" className="text-xs sm:text-sm font-semibold text-slate-800">
                Họ và tên <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon size={16} />
                </div>
                <input
                  id="reg-fullname"
                  name="fullName"
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  autoFocus
                  disabled={loading}
                  className="w-full py-2.5 sm:py-3 pl-10 pr-4 text-sm sm:text-base bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 transition-all duration-200 outline-none focus:border-[#008A64] focus:ring-2 focus:ring-[#008A64]/15 disabled:bg-slate-50"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="reg-email" className="text-xs sm:text-sm font-semibold text-slate-800">
                Địa chỉ Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full py-2.5 sm:py-3 pl-10 pr-4 text-sm sm:text-base bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 transition-all duration-200 outline-none focus:border-[#008A64] focus:ring-2 focus:ring-[#008A64]/15 disabled:bg-slate-50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <PasswordInput
                id="reg-password"
                name="password"
                label="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                required
                disabled={loading}
              />

              {/* Password Strength Realtime Meter */}
              <PasswordStrength password={formData.password} />

              {/* Password Requirements Compact Checklist */}
              <PasswordRequirements password={formData.password} />
            </div>

            {/* Confirm Password Field */}
            <ConfirmPasswordInput
              id="reg-confirm-password"
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              originalPassword={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-3.5 px-4 rounded-xl text-sm sm:text-base font-bold text-white bg-[#008A64] hover:bg-[#007457] active:bg-[#005e45] transition-all duration-200 shadow-md shadow-[#008A64]/25 flex items-center justify-center gap-2 mt-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang khởi tạo tài khoản...</span>
                </>
              ) : (
                <span>TIẾP TỤC & NHẬN MÃ OTP</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                hoặc đăng ký nhanh với
              </span>
            </div>
          </div>

          {/* Google Button */}
          <div className="mb-2">
            <GoogleLoginButton
              onSuccess={handleGoogleSuccess}
              onError={(msg) => setError(msg)}
              disabled={loading}
              text="Đăng ký với Google"
            />
          </div>
        </div>
      ) : (
        /* STEP 2: OTP VERIFICATION */
        <form onSubmit={handleVerifyOtpSubmit} className="space-y-4 animate-fade-in">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="reg-otp" className="text-xs sm:text-sm font-semibold text-slate-800">
                Mã xác thực OTP (6 chữ số)
              </label>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0 || resending}
                className={`text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  countdown > 0 || resending
                    ? "text-slate-400 cursor-not-allowed"
                    : "text-[#008A64] hover:text-[#007457] hover:underline"
                }`}
              >
                <RefreshCw size={13} className={resending ? "animate-spin" : ""} />
                <span>{countdown > 0 ? `Gửi lại sau (${countdown}s)` : "Gửi lại mã OTP"}</span>
              </button>
            </div>

            <input
              id="reg-otp"
              type="text"
              placeholder="123456"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
              autoFocus
              className="w-full py-3 px-4 text-center tracking-[0.3em] font-mono text-xl sm:text-2xl bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-300 focus:border-[#008A64] focus:ring-2 focus:ring-[#008A64]/15 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl text-sm sm:text-base font-bold text-white bg-[#008A64] hover:bg-[#007457] active:bg-[#005e45] transition-all duration-200 shadow-md shadow-[#008A64]/25 flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Xác thực & Hoàn tất đăng ký</span>
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setStep("form")}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Chỉnh sửa lại thông tin đăng ký</span>
            </button>
          </div>
        </form>
      )}

      {/* Login link */}
      <div className="text-center text-xs sm:text-sm text-slate-600 pt-4 border-t border-slate-100 mt-5 font-medium">
        Đã có tài khoản?{" "}
        <Link
          to="/login"
          className="text-[#008A64] hover:text-[#007457] font-bold hover:underline ml-1"
        >
          Đăng nhập ngay
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;
