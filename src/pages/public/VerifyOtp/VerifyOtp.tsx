import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import authApi from "../../../api/authApi";
import { ArrowLeft, CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react";

const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("Registration");
  const [countdown, setCountdown] = useState(0);
  const [resending, setResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const state = location.state as { email?: string; type?: string };
    if (state?.email) setEmail(state.email);
    if (state?.type) setType(state.type);
  }, [location.state]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email.trim() || !code.trim()) {
      setError("Vui lòng điền đầy đủ email và mã OTP.");
      return;
    }

    setLoading(true);

    try {
      let res;
      if (type === "Registration") {
        res = await authApi.verifyRegisterOtp({
          email: email.trim(),
          otpCode: code.trim(),
        });
      } else {
        res = await authApi.verifyOtp({
          email: email.trim(),
          code: code.trim(),
          type,
        });
      }

      if (res && res.success) {
        setSuccessMsg(res.message || "Xác thực OTP thành công!");
        setTimeout(() => {
          if (type === "ForgotPassword") {
            navigate("/reset-password", { state: { email: email.trim(), otpCode: code.trim() } });
          } else {
            navigate("/login");
          }
        }, 1500);
      } else {
        setError(res?.message || "Mã OTP không hợp lệ hoặc đã hết hạn.");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj?.message || "Xác thực OTP thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError("Vui lòng nhập email để gửi lại mã.");
      return;
    }

    setError("");
    setResending(true);

    try {
      const res = await authApi.sendOtp({
        email: email.trim(),
        type,
      });

      if (res && res.success) {
        setSuccessMsg("Mã OTP mới đã được gửi thành công.");
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
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl shadow-indigo-950/40">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Xác thực mã OTP
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
              Nhập mã bảo mật 6 chữ số vừa được gửi tới hòm thư của bạn.
            </p>
          </div>

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

          <form onSubmit={handleVerify} className="space-y-4">
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
                <label className="text-sm font-semibold text-slate-800">Mã OTP (6 chữ số)</label>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0 || resending}
                  className={`text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                    countdown > 0 || resending
                      ? "text-slate-400 cursor-not-allowed"
                      : "text-blue-600 hover:text-blue-700 hover:underline"
                  }`}
                >
                  <RefreshCw size={14} className={resending ? "animate-spin" : ""} />
                  <span>{countdown > 0 ? `Gửi lại sau (${countdown}s)` : "Gửi lại OTP"}</span>
                </button>
              </div>
              <Input
                name="code"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
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
              Xác thực ngay
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

export default VerifyOtp;

