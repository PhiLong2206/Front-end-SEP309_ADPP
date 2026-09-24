import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import GoogleLoginButton from "../../../components/auth/GoogleLoginButton";
import authApi from "../../../api/authApi";
import { CheckCircle2, Eye, EyeOff, RefreshCw, ShieldCheck, UserPlus } from "lucide-react";


const Register: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-8 bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl shadow-indigo-950/40">
          {/* Top Progress Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                step === "form"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>Thông tin tài khoản</span>
            </div>

            <div className="w-8 h-0.5 bg-slate-200" />

            <div
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                step === "otp"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>Xác thực OTP</span>
            </div>
          </div>

          <div className="text-center mb-7">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {step === "form" ? "Tạo tài khoản mới" : "Xác thực Email OTP"}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-md mx-auto">
              {step === "form"
                ? "Gia nhập nền tảng luyện tập tranh biện học thuật AI Debate Platform"
                : `Hệ thống đã gửi mã OTP 6 chữ số đến hộp thư: ${formData.email}`}
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

          {step === "form" ? (
            <div className="space-y-4">
              {/* Google Sign-in Button */}
              <div>
                <GoogleLoginButton
                  onSuccess={async (idToken) => {
                    setError("");
                    setLoading(true);
                    try {
                      const res = await authApi.googleLogin({ idToken });
                      if (res && res.success && res.data?.accessToken) {
                        setSuccessMsg("Đăng nhập bằng Google thành công! Đang chuyển hướng...");
                        setTimeout(() => {
                          navigate("/login");
                        }, 1200);
                      } else {
                        setError(res?.message || "Đăng nhập bằng Google thất bại.");
                      }
                    } catch (err: unknown) {
                      const errorObj = err as { message?: string };
                      setError(errorObj?.message || "Lỗi xác thực Google.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  onError={(msg) => setError(msg)}
                  disabled={loading}
                  text="Đăng ký nhanh với Google"
                />
              </div>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 font-bold tracking-wider">
                    Hoặc đăng ký tài khoản mới
                  </span>
                </div>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <Input
                  label="Họ và tên"
                  name="fullName"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  autoFocus
                />

                <Input
                  label="Địa chỉ Email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      label="Mật khẩu (≥ 8 ký tự)"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
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
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs sm:text-sm text-blue-700 leading-relaxed font-medium">
                  ℹ️ Sau khi đăng ký, bạn sẽ nhận được một mã OTP xác thực email để kích hoạt tài khoản.
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full py-3.5 text-base font-bold shadow-lg shadow-blue-600/25 mt-3"
                  loading={loading}
                  disabled={loading}
                >
                  <UserPlus size={18} className="mr-2" />
                  <span>Tiếp tục & Nhận mã OTP</span>
                </Button>
              </form>
            </div>
          ) : (

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-5 animate-fade-in">
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
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full py-3.5 text-base font-bold shadow-lg shadow-blue-600/25 mt-3"
                loading={loading}
                disabled={loading}
              >
                <ShieldCheck size={18} className="mr-2" />
                <span>Xác thực & Kích hoạt tài khoản</span>
              </Button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="text-sm font-medium text-slate-500 hover:text-slate-700 underline"
                >
                  ← Chỉnh sửa lại thông tin đăng ký
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-600 font-medium">
            Đã có tài khoản?{" "}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;



