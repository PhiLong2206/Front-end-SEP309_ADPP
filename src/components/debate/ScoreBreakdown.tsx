import React from "react";

export interface ScoreItem {
  label: string;
  score: number; // 0 - 100
  weight?: string;
}

export interface ScoreBreakdownProps {
  scores: {
    logic: number;
    evidence: number;
    relevance: number;
    structure: number;
    persuasiveness: number;
  };
}

const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ scores }) => {
  const items: ScoreItem[] = [
    { label: "Lập luận", score: scores.logic },
    { label: "Dẫn chứng", score: scores.evidence },
    { label: "Tính liên quan", score: scores.relevance },
    { label: "Cấu trúc", score: scores.structure },
    { label: "Tính thuyết phục", score: scores.persuasiveness },
  ];

  const getColorClass = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 70) return "bg-blue-600";
    if (score >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">{item.label}</span>
            <span className="font-bold text-white font-mono">{item.score} / 100</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 shadow-sm ${getColorClass(item.score)}`}
              style={{ width: `${Math.min(100, Math.max(0, item.score))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoreBreakdown;
