import React from "react";
import { Lightbulb, Target, Compass, HelpCircle } from "lucide-react";
import { MOCK_REBUTTAL_TIPS } from "../../mocks/debate";

export interface RebuttalSuggestionProps {
  tips?: typeof MOCK_REBUTTAL_TIPS;
}

const RebuttalSuggestion: React.FC<RebuttalSuggestionProps> = ({ tips = MOCK_REBUTTAL_TIPS }) => {
  return (
    <div className="bg-white debate-panel-secondary rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4.5">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800/60">
        <div className="p-2 rounded-xl bg-[#ECFDF5] dark:bg-[rgba(16,185,129,0.12)] text-[#008A64] dark:text-[#34D399]">
          <Lightbulb size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-[#F8FAFC] text-[17px]">Gợi ý phản biện AI</h3>
          <p className="text-[14px] text-slate-500 dark:text-[#94A3B8]">Phân tích hỗ trợ chiến thuật lập luận</p>
        </div>
      </div>

      {/* 1. Luận điểm chính của đối phương */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[15px] font-semibold text-slate-900 dark:text-[#F8FAFC]">
          <span className="w-2 h-2 rounded-full bg-[#008A64] dark:bg-[#34D399]" />
          <span>Luận điểm chính của đối phương</span>
        </div>
        <p className="text-[15px] leading-[1.65] text-slate-700 bg-slate-50 dark:bg-[#091713] debate-card-neutral debate-card-neutral-text p-3.5 rounded-xl border border-slate-200/70 dark:border-[rgba(148,163,184,0.16)]">
          {tips.mainPoint}
        </p>
      </div>

      {/* 2. Điểm có thể khai thác */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[15px] font-semibold text-rose-600 dark:text-[#FB7185] debate-card-vuln-title">
          <Target size={15} className="text-rose-500 dark:text-[#FB7185]" />
          <span>Điểm có thể khai thác</span>
        </div>
        <ul className="space-y-2">
          {tips.vulnerabilities.map((vuln, i) => (
            <li
              key={i}
              className="text-[15px] leading-[1.65] text-slate-700 bg-rose-50/70 dark:bg-[rgba(239,68,68,0.08)] debate-card-vuln debate-card-vuln-text border border-rose-200/80 dark:border-[rgba(239,68,68,0.30)] p-3.5 rounded-xl"
            >
              • {vuln}
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Hướng phản biện */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[15px] font-semibold text-[#008A64] dark:text-[#34D399]">
          <Compass size={15} className="text-[#008A64] dark:text-[#34D399]" />
          <span>Hướng phản biện</span>
        </div>
        <ul className="space-y-2">
          {tips.suggestedDirections.map((dir, i) => (
            <li
              key={i}
              className="text-[15px] leading-[1.65] text-slate-700 bg-[#ECFDF5]/60 dark:bg-[rgba(16,185,129,0.08)] debate-card-dir debate-card-dir-text border border-[#008A64]/20 dark:border-[rgba(16,185,129,0.25)] p-3.5 rounded-xl"
            >
              • {dir}
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Câu hỏi gợi ý */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[15px] font-semibold text-sky-600 dark:text-[#38BDF8]">
          <HelpCircle size={15} className="text-sky-600 dark:text-[#38BDF8]" />
          <span>Câu hỏi gợi ý</span>
        </div>
        <ul className="space-y-2">
          {tips.suggestedQuestions.map((q, i) => (
            <li
              key={i}
              className="text-[15px] leading-[1.65] text-slate-700 bg-slate-50 dark:bg-[#091713] debate-card-neutral debate-card-neutral-text border border-slate-200/70 dark:border-[rgba(148,163,184,0.16)] p-3.5 rounded-xl italic"
            >
              &ldquo;{q}&rdquo;
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RebuttalSuggestion;
