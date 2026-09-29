import { useState, forwardRef, InputHTMLAttributes } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  helperText?: string;
  showIcon?: boolean;
  required?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label = "Mật khẩu",
      id,
      name = "password",
      placeholder = "••••••••••••",
      value,
      onChange,
      error,
      helperText,
      showIcon = true,
      required = false,
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || name;

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className={`flex flex-col gap-1.5 mb-3.5 ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-[#F8FAFC] flex items-center justify-between"
          >
            <span>
              {label} {required && <span className="text-rose-500">*</span>}
            </span>
          </label>
        )}

        <div className="relative">
          {showIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={16} />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={`w-full py-2.5 sm:py-3 pr-11 text-sm sm:text-base bg-white dark:bg-[#12231C] border rounded-xl text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-200 outline-none disabled:bg-slate-50 dark:disabled:bg-[#091511] disabled:text-slate-400 disabled:cursor-not-allowed ${
              showIcon ? "pl-10" : "pl-4"
            } ${
              error
                ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15"
                : "border-slate-200 hover:border-slate-300 dark:border-[rgba(148,163,184,0.20)] dark:hover:border-[rgba(148,163,184,0.30)] focus:border-[#008A64] dark:focus:border-[#10B981] focus:ring-2 focus:ring-[#008A64]/15 dark:focus:ring-[#10B981]/20"
            }`}
            {...props}
          />

          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer focus:outline-none focus:text-[#008A64] dark:focus:text-[#10B981]"
            tabIndex={0}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && <span className="text-xs text-rose-500 font-medium animate-fade-in">{error}</span>}
        {!error && helperText && <span className="text-xs text-slate-500">{helperText}</span>}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
