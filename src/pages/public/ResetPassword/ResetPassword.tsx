import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import authApi from "../../../api/authApi";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, LockKeyhole, RefreshCw } from "lucide-react";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const passedEmail = (location.state as { email?: string })?.email;
    if (passedEmail) {
      setEmail(passedEmail);
    }
  }, [location.state]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email.trim()) {
      setError("Vui lòng nhập địa chỉ email.");
      return;
    }

    if (!otpCode.trim()) {
      setError("Vui lòng nhập mã OTP xác thực.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có tối thiểu 8 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.resetPassword({
        email: email.trim(),
        otpCode: otpCode.trim(),
        newPassword,
      });

      if (res && res.success) {
        setSuccessMsg(
          res.message || "Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập..."
        );
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(res?.message || "Mã OTP không chính xác hoặc đã hết hạn.");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || "Không thể đặt lại mật khẩu. Vui lòng kiểm tra lại mã OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email.trim()) {
      setError("Vui lòng nhập email trước khi yêu cầu gửi lại OTP.");
      return;
    }

    setError("");
    setResending(true);

    try {
      const res = await authApi.forgotPassword(email.trim());
      if (res && res.success) {
        setSuccessMsg("Mã OTP mới đã được gửi đến email của bạn.");
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

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-8 bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl shadow-indigo-950/40">
          {/* Header icon and title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
              <LockKeyhole size={30} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Đặt lại mật khẩu
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Nhập mã OTP 6 số từ email và mật khẩu mới để thiết lập lại quyền truy cập.
            </p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="p-4 mb-6 text-sm rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium animate-fade-in flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 mb-6 text-sm rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium animate-fade-in flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleResetSubmit} className="space-y-4">
            <Input
              label="Địa chỉ Email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-800">Mã xác thực OTP (6 chữ số)</label>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || resending}
                  className={`text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    countdown > 0 || resending
                      ? "text-slate-400 cursor-not-allowed"
                      : "text-blue-600 hover:text-blue-700 hover:underline"
                  }`}
                >
                  <RefreshCw size={14} className={resending ? "animate-spin" : ""} />
                  <span>{countdown > 0 ? `Gửi lại sau (${countdown}s)` : "Gửi lại mã OTP"}</span>
                </button>
              </div>
              <Input
                name="otpCode"
                placeholder="Ví dụ: 123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Input
                label="Mật khẩu mới (Tối thiểu 8 ký tự)"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-9.5 text-slate-400 hover:text-slate-600 p-1 transition-colors"
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Input
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-3.5 text-base font-bold shadow-lg shadow-blue-600/25 mt-3"
              loading={loading}
              disabled={loading}
            >
              Lưu mật khẩu mới & Đăng nhập
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-600">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Quay lại Đăng nhập</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

