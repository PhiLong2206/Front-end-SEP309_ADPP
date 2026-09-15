import React from "react";
import { Check } from "lucide-react";

export interface DebateStepperProps {
  currentRound: number; // 1, 2, or 3
  onSelectRound?: (round: number) => void;
}

const DebateStepper: React.FC<DebateStepperProps> = ({ currentRound }) => {
  const steps = [
    { number: 1, label: "Mở đầu", duration: "3 phút" },
    { number: 2, label: "Phản biện", duration: "3 phút" },
    { number: 3, label: "Kết luận", duration: "2 phút" },
  ];

  return (
    <div className="flex items-center justify-between bg-white px-6 py-3.5 rounded-xl border border-slate-200 shadow-xs">
      {steps.map((step, idx) => {
        const isCompleted = step.number < currentRound;
        const isCurrent = step.number === currentRound;

        return (
          <React.Fragment key={step.number}>
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isCompleted
                    ? "bg-emerald-600 text-white"
                    : isCurrent
                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {isCompleted ? <Check size={14} /> : step.number}
              </div>
              <div>
                <div
                  className={`text-xs font-semibold ${
                    isCurrent ? "text-blue-600" : isCompleted ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  Vòng {step.number} - {step.label}
                </div>
                <div className="text-[11px] text-slate-400">{step.duration}</div>
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={`flex-1 mx-4 h-0.5 ${
                  step.number < currentRound ? "bg-emerald-500" : "bg-slate-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default DebateStepper;
