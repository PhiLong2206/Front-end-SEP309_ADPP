import React from "react";
import { calculatePasswordStrength } from "../../utils/passwordValidator";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password, className = "" }) => {
  if (!password) return null;

  const { score, label, colorClass } = calculatePasswordStrength(password);

  const getSegmentColor = (segmentIndex: number) => {
    if (segmentIndex > score) return "bg-slate-200";

    switch (score) {
      case 1:
        return "bg-rose-500";
      case 2:
        return "bg-amber-500";
      case 3:
        return "bg-orange-500";
      case 4:
        return "bg-emerald-500";
      case 5:
        return "bg-emerald-600";
      default:
        return "bg-slate-200";
    }
  };

  return (
    <div className={`space-y-1.5 mb-3 animate-fade-in ${className}`}>
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-600">Độ mạnh mật khẩu</span>
        <span className={`${colorClass} font-bold transition-colors duration-200`}>
          {label}
        </span>
      </div>

      {/* Segmented Strength Bar */}
      <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full bg-slate-100 p-0.5 rounded-full">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className={`h-full rounded-full transition-all duration-300 ${getSegmentColor(index)}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PasswordStrength;
