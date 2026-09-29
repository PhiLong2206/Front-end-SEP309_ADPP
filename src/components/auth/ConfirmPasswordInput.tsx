import { useState, forwardRef, InputHTMLAttributes } from "react";
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle } from "lucide-react";

export interface ConfirmPasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  originalPassword?: string;
  required?: boolean;
}

const ConfirmPasswordInput = forwardRef<HTMLInputElement, ConfirmPasswordInputProps>(
  (
    {
      label = "Xác nhận mật khẩu",
      id,
      name = "confirmPassword",
      placeholder = "••••••••••••",
      value = "",
      originalPassword = "",
      onChange,
      required = true,
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState(false);
    const inputId = id || name;

    const valueStr = String(value);
    const isMatching = valueStr.length > 0 && valueStr === originalPassword;
    const isMismatched = touched && valueStr.length > 0 && valueStr !== originalPassword;

    return (
      <div className={`flex flex-col gap-1.5 mb-3.5 ${className}`}>
        <label
          htmlFor={inputId}
          className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-[#F8FAFC] flex items-center justify-between"
        >
          <span>
            {label} {required && <span className="text-rose-500">*</span>}
          </span>
          {isMatching && (
            <span className="text-xs text-emerald-600 dark:text-[#34D399] font-semibold inline-flex items-center gap-1">
              <CheckCircle2 size={13} />
              <span>Mật khẩu khớp</span>
            </span>
          )}
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Lock size={16} />
          </div>

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              if (!touched) setTouched(true);
              onChange?.(e);
            }}
            onBlur={() => setTouched(true)}
            disabled={disabled}
            required={required}
            className={`w-full py-2.5 sm:py-3 pl-10 pr-11 text-sm sm:text-base bg-white dark:bg-[#12231C] border rounded-xl text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-200 outline-none disabled:bg-slate-50 dark:disabled:bg-[#091511] disabled:text-slate-400 disabled:cursor-not-allowed ${
              isMismatched
                ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                : isMatching
                ? "border-emerald-400 dark:border-emerald-500 focus:border-[#008A64] dark:focus:border-[#10B981] focus:ring-2 focus:ring-emerald-500/15"
                : "border-slate-200 hover:border-slate-300 dark:border-[rgba(148,163,184,0.20)] dark:hover:border-[rgba(148,163,184,0.30)] focus:border-[#008A64] dark:focus:border-[#10B981] focus:ring-2 focus:ring-[#008A64]/15 dark:focus:ring-[#10B981]/20"
            }`}
            {...props}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer focus:outline-none focus:text-[#008A64] dark:focus:text-[#10B981]"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {isMismatched && (
          <span className="text-xs text-rose-500 font-medium inline-flex items-center gap-1 animate-fade-in">
            <AlertCircle size={13} className="shrink-0" />
            <span>Mật khẩu xác nhận không khớp.</span>
          </span>
        )}
      </div>
    );
  }
);

ConfirmPasswordInput.displayName = "ConfirmPasswordInput";

export default ConfirmPasswordInput;
