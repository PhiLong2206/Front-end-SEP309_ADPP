import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ScoreBreakdown from "../../../components/debate/ScoreBreakdown";
import { MOCK_DEBATE_RESULT } from "../../../mocks/debate";
import { CheckCircle2, AlertCircle, RotateCcw, ArrowRight, FileText } from "lucide-react";

const DebateResult: React.FC = () => {
  const navigate = useNavigate();
  const result = MOCK_DEBATE_RESULT;

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
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Điểm theo tiêu chí
          </h3>

          <ScoreBreakdown scores={result.scores} />
        </div>

        {/* RIGHT COLUMN: Nhận xét (Điểm mạnh & Điểm cần cải thiện) (~35%) */}
        <div className="md:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Nhận xét chi tiết
          </h3>

          {/* Điểm mạnh */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <CheckCircle2 size={15} className="text-[#008A64]" />
              <span>Điểm mạnh</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 pl-4 list-disc leading-relaxed">
              {result.strengths.map((st, i) => (
                <li key={i}>{st}</li>
              ))}
            </ul>
          </div>

          {/* Điểm cần cải thiện */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
              <AlertCircle size={15} className="text-amber-600" />
              <span>Điểm cần cải thiện</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 pl-4 list-disc leading-relaxed">
              {result.improvements.map((imp, i) => (
                <li key={i}>{imp}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/learner/history"
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold rounded-xl transition-all inline-flex items-center gap-2 shadow-xs"
          >
            <FileText size={15} />
            <span>Xem biên bản tranh luận</span>
          </Link>

          <button
            type="button"
            onClick={() => navigate("/learner/topics/topic-social-media")}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold rounded-xl transition-all inline-flex items-center gap-2 shadow-xs"
          >
            <RotateCcw size={15} />
            <span>Luyện tập lại</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate("/learner/dashboard")}
          className="px-6 py-2.5 bg-[#008A64] hover:bg-[#007457] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-[#008A64]/20 transition-all inline-flex items-center gap-2 hover:scale-102"
        >
          <span>Quay về Dashboard</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default DebateResult;
