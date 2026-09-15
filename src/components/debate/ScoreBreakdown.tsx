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
    { label: "Lập luận (Logic)", score: scores.logic },
    { label: "Dẫn chứng (Evidence)", score: scores.evidence },
    { label: "Tính liên quan (Relevance)", score: scores.relevance },
    { label: "Cấu trúc (Structure)", score: scores.structure },
    { label: "Thuyết phục (Persuasiveness)", score: scores.persuasiveness },
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
            <span className="font-semibold text-slate-700">{item.label}</span>
            <span className="font-bold text-slate-900">{item.score} / 100</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getColorClass(item.score)}`}
              style={{ width: `${Math.min(100, Math.max(0, item.score))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoreBreakdown;
