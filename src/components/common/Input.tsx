import React, { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const inputId = id || name;

  return (
    <div className={`flex flex-col gap-1.5 mb-4 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs sm:text-sm font-semibold text-slate-300 tracking-wide">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full px-4 py-2.5 text-sm sm:text-base bg-slate-900/90 border rounded-xl text-white placeholder:text-slate-500 transition-all duration-150 focus:outline-none focus:ring-2 disabled:bg-slate-950 disabled:text-slate-500 disabled:cursor-not-allowed ${
          error
            ? "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20"
            : "border-slate-700/80 focus:border-blue-500 focus:ring-blue-500/30 hover:border-slate-600"
        }`}
        {...props}
      />
      {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
      {!error && helperText && <span className="text-xs text-slate-400">{helperText}</span>}
    </div>
  );
};

export default Input;

