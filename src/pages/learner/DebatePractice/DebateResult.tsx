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
}

const DebateResult: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result: DebateResultData | null = (location.state as { result?: DebateResultData })?.result || null;

  if (!result) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-16 text-center">
        <FileText size={40} className="mx-auto text-slate-300" />
        <h2 className="text-lg font-black text-slate-900">Không tìm thấy kết quả đánh giá</h2>
        <p className="text-xs text-slate-500 mt-1">
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
        <div className="md:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Kết quả tranh biện
            </h2>
            <p className="text-xs text-slate-600 line-clamp-2">
              Chủ đề: <span className="font-semibold text-[#008A64]">&ldquo;{result.topicTitle}&rdquo;</span>
            </p>
          </div>

          {/* Circular Score Badge Center */}
          <div className="my-6 flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-[#008A64] flex flex-col items-center justify-center bg-[#ECFDF5]/50 shadow-sm shadow-[#008A64]/10">
              <span className="text-4xl font-black text-slate-900 font-mono leading-none">
                {result.overallScore}
              </span>
              <span className="text-[11px] font-bold text-slate-500 mt-1">/ 100</span>
            </div>
            <span className="mt-4 px-3.5 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#008A64] border border-[#008A64]/30">
              {result.ratingText}
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 text-center">
            Đánh giá tự động bởi Ban giám khảo AI • Tiêu chuẩn Quốc tế
          </div>
        </div>

        {/* CENTER COLUMN: Điểm theo tiêu chí (~35%) */}
        <div className="md:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Điểm theo tiêu chí
          </h2>
          <div className="pt-2">
            <ScoreBreakdown scores={result.scores} />
          </div>
        </div>

        {/* RIGHT COLUMN: Nhận xét chi tiết (~35%) */}
        <div className="md:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Nhận xét chi tiết
            </h2>

            {/* Điểm mạnh */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 size={14} className="text-[#008A64]" />
                Điểm mạnh
              </span>
              <ul className="space-y-1.5 pl-1">
                {result.strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-600 leading-relaxed flex items-start gap-1.5">
                    <span className="text-[#008A64] font-bold mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cần cải thiện */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertCircle size={14} className="text-amber-500" />
                Cần cải thiện
              </span>
              <ul className="space-y-1.5 pl-1">
                {result.improvements.map((imp, idx) => (
                  <li key={idx} className="text-xs text-slate-600 leading-relaxed flex items-start gap-1.5">
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
