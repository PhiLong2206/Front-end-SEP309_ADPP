import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ScoreBreakdown from "../../../components/debate/ScoreBreakdown";
import { CheckCircle2, AlertCircle, RotateCcw, ArrowRight, FileText } from "lucide-react";

export interface DebateResultData {
  sessionId: string;
  topicTitle: string;
  overallScore: number;
  ratingText: string;
  scores: {
    logic: number;
    evidence: number;
    relevance: number;
    structure: number;
    persuasiveness: number;
  };
  strengths: string[];
  improvements: string[];
  progressTrend?: string;
  stageBreakdown?: Record<string, number>;
  criteriaList?: Array<{ name: string; score: number; reasoning: string }>;
}

const DebateResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result: DebateResultData | null = (location.state as { result?: DebateResultData })?.result || null;

  if (!result) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-16 text-center">
        <FileText size={40} className="mx-auto text-slate-300" />
        <h2 className="text-lg font-black text-slate-900 dark:text-[#F8FAFC]">Không tìm thấy kết quả đánh giá</h2>
        <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">
          Phiên tranh biện này chưa có dữ liệu chấm điểm từ AI hoặc phiên chưa kết thúc.
        </p>
        <Link
          to="/learner/debate"
          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-[#008A64] hover:bg-[#007457] text-white text-xs font-bold rounded-2xl shadow-xs transition-colors"
        >
          <span>Luyện tập phiên mới</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* 3 Main Columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* LEFT COLUMN: Kết quả tranh biện & Circular Score (~30%) */}
        <div className="md:col-span-4 bg-white dark:bg-[#10231C] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              Kết quả tranh biện
            </h2>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] line-clamp-2">
              Chủ đề: <span className="font-semibold text-[#008A64] dark:text-[#34D399]">&ldquo;{result.topicTitle}&rdquo;</span>
            </p>
          </div>

          {/* Circular Score Badge Center */}
          <div className="my-6 flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-[#008A64] flex flex-col items-center justify-center bg-[#ECFDF5]/50 dark:bg-[rgba(16,185,129,0.1)] shadow-sm shadow-[#008A64]/10">
              <span className="text-4xl font-black text-slate-900 dark:text-[#F8FAFC] font-mono leading-none">
                {result.overallScore}
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-[#94A3B8] mt-1">/ 100</span>
            </div>
            <span className="mt-4 px-3.5 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#008A64] dark:bg-[rgba(16,185,129,0.15)] dark:text-[#34D399] border border-[#008A64]/30">
              {result.ratingText}
            </span>
          </div>

          {/* Stage breakdown if available */}
          {result.stageBreakdown && Object.keys(result.stageBreakdown).length > 0 && (
            <div className="p-3 bg-slate-50 dark:bg-[#091713] rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs space-y-2 mb-3">
              <p className="font-bold text-slate-700 dark:text-slate-300">Điểm theo giai đoạn:</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {Object.entries(result.stageBreakdown).map(([stage, sc]) => (
                  <div key={stage} className="p-1.5 bg-white dark:bg-[#123326] rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="capitalize text-slate-500 dark:text-slate-400 block text-[10px]">
                      {stage === "opening" ? "Mở đầu" : stage === "rebuttal" ? "Phản biện" : "Kết luận"}
                    </span>
                    <span className="font-bold text-[#008A64] dark:text-[#34D399] text-xs">
                      {sc}/10
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-500 dark:text-[#94A3B8] text-center">
            Đánh giá tự động bởi AI Evaluator Service • Tiêu chuẩn Rubric 5 tiêu chí
          </div>
        </div>

        {/* CENTER COLUMN: Điểm theo tiêu chí (~35%) */}
        <div className="md:col-span-4 bg-white dark:bg-[#10231C] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">
            Điểm theo tiêu chí
          </h2>
          <div className="pt-2">
            <ScoreBreakdown scores={result.scores} />
          </div>

          {result.criteriaList && result.criteriaList.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <p className="font-bold text-slate-700 dark:text-slate-300">Giải trình tiêu chí:</p>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {result.criteriaList.map((c, i) => (
                  <div key={i} className="p-2 bg-slate-50 dark:bg-[#091713] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-0.5">
                    <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                      <span>{c.name}</span>
                      <span className="text-[#008A64] dark:text-[#34D399]">{c.score}/5</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">{c.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Nhận xét chi tiết (~35%) */}
        <div className="md:col-span-4 bg-white dark:bg-[#10231C] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-[#F8FAFC] tracking-tight">
              Nhận xét chi tiết
            </h2>

            {/* Tiến trình & Xu hướng */}
            {result.progressTrend && (
              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 text-xs space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-[#008A64]" />
                  Tổng quan chất lượng
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{result.progressTrend}</p>
              </div>
            )}

            {/* Điểm mạnh */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 size={14} className="text-[#008A64]" />
                Điểm mạnh
              </span>
              <ul className="space-y-1.5 pl-1">
                {result.strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-1.5">
                    <span className="text-[#008A64] font-bold mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cần cải thiện */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertCircle size={14} className="text-amber-500" />
                Cần cải thiện
              </span>
              <ul className="space-y-1.5 pl-1">
                {result.improvements.map((imp, idx) => (
                  <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold mt-0.5">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTIONS BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          to={`/learner/debate/${result.sessionId}`}
          className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <FileText size={15} />
          <span>Xem lại toàn bộ transcript</span>
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => navigate("/learner/debate")}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-all inline-flex items-center justify-center gap-1.5 shadow-xs"
          >
            <RotateCcw size={14} />
            <span>Luyện lại chủ đề này</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/learner/topics")}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-[#008A64] hover:bg-[#007457] text-white text-xs sm:text-sm font-bold rounded-xl transition-all inline-flex items-center justify-center gap-1.5 shadow-sm shadow-[#008A64]/20 hover:scale-102"
          >
            <span>Chọn chủ đề mới</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebateResult;
