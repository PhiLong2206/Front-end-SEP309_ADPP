import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import { useAuth } from "../../../hooks/useAuth";
import { ROLES } from "../../../utils/constants";
import { MOCK_ACCOUNTS } from "../../../mocks/accounts";
import { Eye, EyeOff, Sparkles } from "lucide-react";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("learner@adpp.local");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }

    setLoading(true);

    try {
      const result = await login({ email: email.trim(), password });

      if (result.success && result.user) {
        const userRole = result.user.role;
        if (userRole === ROLES.ADMIN) {
          navigate("/admin/dashboard");
        } else if (userRole === ROLES.EDUCATOR) {
          navigate("/educator/dashboard");
        } else {
          navigate("/learner/dashboard");
        }
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

  const fillTestAccount = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
    setError("");
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="max-w-4xl w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
        {/* LEFT COLUMN: Clean Form Area */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Header branding */}
            <div className="space-y-1 mb-5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Đăng nhập
              </h1>
              <p className="text-xs text-slate-500">
                Chào mừng bạn quay trở lại với ADPP
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-2.5 mb-4 text-xs rounded-md bg-red-50 border border-red-200 text-red-700 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="learner@adpp.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="relative">
                <Input
                  label="Mật khẩu"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 p-1"
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Nhớ đăng nhập</span>
                </label>

                <a href="#forgot" className="font-semibold text-blue-600 hover:underline">
                  Quên mật khẩu?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-2.5 text-xs font-bold shadow-xs mt-2"
                loading={loading}
                disabled={loading}
              >
                Đăng nhập
              </Button>
            </form>

            {/* Dev Mock Accounts Section (Visible only in development) */}
            {import.meta.env.DEV && (
              <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200/90 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-2">
                  <Sparkles size={13} className="text-amber-500" />
                  <span>Tài khoản thử nghiệm</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  {MOCK_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => fillTestAccount(acc.email, acc.password)}
                      className="w-full flex items-center justify-between p-1.5 rounded bg-white hover:bg-blue-50/60 border border-slate-200 transition-colors text-left"
                    >
                      <div>
                        <span className="font-semibold text-slate-800">
                          {acc.role === ROLES.LEARNER
                            ? "Học viên"
                            : acc.role === ROLES.EDUCATOR
                            ? "Nhà giáo dục"
                            : "Quản trị viên"}
                        </span>
                        <span className="text-slate-500 ml-1.5">({acc.email})</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[10px]">123456</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Đăng ký
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Professional Brand Atmosphere Panel */}
        <div className="hidden md:block md:col-span-6 relative bg-slate-900 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1507842229451-7f01be837453?w=800&auto=format&fit=crop&q=80"
            alt="Study Atmosphere"
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity brightness-75 contrast-125"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-blue-950/60 to-slate-950/70 p-8 flex flex-col justify-between text-white" />

          <div className="absolute inset-0 p-8 flex flex-col justify-end text-white space-y-2 z-10">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug drop-shadow-md">
              &ldquo;Lập luận tốt hơn. <br />
              Tư duy xa hơn.&rdquo;
            </h2>
            <p className="text-[11px] text-blue-200 font-medium">
              AI Debate Practice Platform — Đại học FPT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
