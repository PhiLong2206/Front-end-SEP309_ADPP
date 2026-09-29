import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { checkPasswordRequirements } from "../../utils/passwordValidator";

interface PasswordRequirementsProps {
  password: string;
  className?: string;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
  className = "",
}) => {
  const requirements = checkPasswordRequirements(password);

  return (
    <div className={`pt-1 pb-2 ${className}`}>
      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs">
        {requirements.map((req) => (
          <div
            key={req.id}
            className={`inline-flex items-center gap-1.5 transition-colors duration-200 ${
              req.met ? "text-emerald-700 font-semibold" : "text-slate-400 font-normal"
            }`}
          >
            {req.met ? (
              <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
            ) : (
              <Circle size={13} className="text-slate-300 shrink-0" />
            )}
            <span>{req.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordRequirements;
