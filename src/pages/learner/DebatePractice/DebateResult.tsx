import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ScoreBreakdown from "../../../components/debate/ScoreBreakdown";
import Button from "../../../components/common/Button";
import { MOCK_DEBATE_RESULT } from "../../../mocks/debate";
import { CheckCircle2, AlertCircle, RotateCcw, ArrowRight, FileText } from "lucide-react";

const DebateResult: React.FC = () => {
  const navigate = useNavigate();
  const result = MOCK_DEBATE_RESULT;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* 3 Main Columns matching Panel 7 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* LEFT COLUMN: Kết quả tranh biện & Circular Score (~30%) */}
        <div className="md:col-span-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div className="space-y-2">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Kết quả tranh biện
            </h2>
            <p className="text-xs text-slate-500 line-clamp-2">
              Chủ đề: <span className="font-semibold text-slate-800">&ldquo;{result.topicTitle}&rdquo;</span>
            </p>
          </div>

          {/* Circular Score Badge Center */}
          <div className="my-6 flex flex-col items-center justify-center">
            <div className="w-28 h-28 rounded-full border-4 border-blue-600 flex flex-col items-center justify-center bg-blue-50/40 shadow-inner">
              <span className="text-3xl font-black text-slate-900 leading-none">
                {result.overallScore}
              </span>
              <span className="text-[10px] font-bold text-slate-400 mt-0.5">/ 100</span>
            </div>
            <span className="mt-3 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {result.ratingText}
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Đánh giá tự động bởi AI Judge
          </div>
        </div>

        {/* CENTER COLUMN: Điểm theo tiêu chí (~35%) */}
        <div className="md:col-span-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Điểm theo tiêu chí
          </h3>

          <ScoreBreakdown scores={result.scores} />
        </div>

        {/* RIGHT COLUMN: Nhận xét (Điểm mạnh & Điểm cần cải thiện) (~35%) */}
        <div className="md:col-span-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Nhận xét
          </h3>

          {/* Điểm mạnh */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Điểm mạnh</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 pl-4 list-disc leading-relaxed">
              {result.strengths.map((st, i) => (
                <li key={i}>{st}</li>
              ))}
            </ul>
          </div>

          {/* Điểm cần cải thiện */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
              <AlertCircle size={14} className="text-amber-600" />
              <span>Điểm cần cải thiện</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 pl-4 list-disc leading-relaxed">
              {result.improvements.map((imp, i) => (
                <li key={i}>{imp}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Link
            to="/learner/history"
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1"
          >
            <FileText size={13} />
            <span>Xem transcript</span>
          </Link>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/learner/topics/topic-social-media")}
            className="inline-flex items-center gap-1 text-xs font-semibold"
          >
            <RotateCcw size={13} />
            <span>Luyện tập lại</span>
          </Button>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate("/learner/dashboard")}
          className="px-5 font-bold inline-flex items-center gap-1"
        >
          <span>Quay về dashboard</span>
          <ArrowRight size={13} />
        </Button>
      </div>
    </div>
  );
};

export default DebateResult;
