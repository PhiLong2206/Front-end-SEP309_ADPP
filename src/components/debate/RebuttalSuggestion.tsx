import React from "react";
import { Lightbulb, Target, Compass, HelpCircle } from "lucide-react";
import { MOCK_REBUTTAL_TIPS } from "../../mocks/debate";

export interface RebuttalSuggestionProps {
  tips?: typeof MOCK_REBUTTAL_TIPS;
}

const RebuttalSuggestion: React.FC<RebuttalSuggestionProps> = ({ tips = MOCK_REBUTTAL_TIPS }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-5 h-full overflow-y-auto">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
          <Lightbulb size={18} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Gợi ý phản biện AI</h3>
          <p className="text-[11px] text-slate-400">Phân tích hỗ trợ chiến thuật lập luận</p>
        </div>
      </div>

      {/* 1. Luận điểm chính của đối phương */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <span>Luận điểm chính của đối phương</span>
        </div>
        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
          {tips.mainPoint}
        </p>
      </div>

      {/* 2. Điểm có thể khai thác */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
          <Target size={13} className="text-rose-500" />
          <span>Điểm có thể khai thác</span>
        </div>
        <ul className="space-y-1.5">
          {tips.vulnerabilities.map((vuln, i) => (
            <li
              key={i}
              className="text-xs text-slate-600 bg-rose-50/40 border border-rose-100 p-2.5 rounded-lg leading-relaxed"
            >
              • {vuln}
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Hướng phản biện */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
          <Compass size={13} className="text-emerald-500" />
          <span>Hướng phản biện</span>
        </div>
        <ul className="space-y-1.5">
          {tips.suggestedDirections.map((dir, i) => (
            <li
              key={i}
              className="text-xs text-slate-600 bg-emerald-50/40 border border-emerald-100 p-2.5 rounded-lg leading-relaxed"
            >
              • {dir}
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Câu hỏi gợi ý */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1.5">
          <HelpCircle size={13} className="text-indigo-500" />
          <span>Câu hỏi gợi ý</span>
        </div>
        <ul className="space-y-1.5">
          {tips.suggestedQuestions.map((q, i) => (
            <li
              key={i}
              className="text-xs text-slate-600 bg-indigo-50/40 border border-indigo-100 p-2.5 rounded-lg italic leading-relaxed"
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
