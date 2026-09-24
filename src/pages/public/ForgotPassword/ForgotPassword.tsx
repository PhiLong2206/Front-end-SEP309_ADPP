import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import authApi from "../../../api/authApi";
import { ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email.trim()) {
      setError("Vui lòng nhập địa chỉ email của bạn.");
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.forgotPassword(email.trim());

      if (res && res.success) {
        setSuccessMsg(res.message || "Mã OTP đặt lại mật khẩu đã được gửi đến email của bạn.");
        setTimeout(() => {
          navigate("/reset-password", { state: { email: email.trim() } });
        }, 1500);
      } else {
        setError(res?.message || "Không thể gửi mã OTP. Vui lòng kiểm tra lại email.");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || "Không thể kết nối đến máy chủ xác thực.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-8 bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl shadow-indigo-950/40">
          {/* Header icon and title */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <KeyRound size={30} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Quên mật khẩu?
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Nhập email đã đăng ký của bạn để nhận mã xác thực OTP khôi phục mật khẩu.
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Địa chỉ Email đã đăng ký"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-3.5 text-base font-bold shadow-lg shadow-blue-600/25 transition-all duration-200 hover:shadow-blue-600/40"
              loading={loading}
              disabled={loading}
            >
              Gửi mã OTP xác thực
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Quay lại Đăng nhập</span>
            </Link>

            <Link
              to="/reset-password"
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Đã có mã OTP?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

