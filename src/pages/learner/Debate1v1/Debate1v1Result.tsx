import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Trophy, Target, CheckCircle2, AlertCircle, Gavel, RotateCcw, ArrowRight, FileText, Swords, Clock } from "lucide-react";
import { MOCK_1V1_MATCHES } from "../../../mocks/events";

function ScoreBar({ label, myScore, theirScore }: { label: string; myScore: number; theirScore: number }) {
  const maxPct = 100;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
        <span>{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-black text-[#008A64]">{myScore}</span>
          <span className="text-slate-300">vs</span>
          <span className="font-black text-rose-500">{theirScore}</span>
        </div>
      </div>
      <div className="flex gap-1 h-2">
        {/* My score */}
        <div className="flex-1 bg-slate-100 rounded-l-full overflow-hidden flex justify-end">
          <div
            className="h-full bg-[#008A64] rounded-full"
            style={{ width: `${(myScore / maxPct) * 100}%` }}
          />
        </div>
        {/* Their score */}
        <div className="flex-1 bg-slate-100 rounded-r-full overflow-hidden">
          <div
            className="h-full bg-rose-400 rounded-full"
            style={{ width: `${(theirScore / maxPct) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

const Debate1v1Result: React.FC = () => {
  const navigate = useNavigate();
  const match = MOCK_1V1_MATCHES[0];

  const isWin = match.result === "WIN";
  const isDraw = match.result === "DRAW";

  const scoreLabels: Record<string, string> = {
    logic: "Logic & Lập luận",
    evidence: "Bằng chứng",
    relevance: "Liên quan",
    structure: "Cấu trúc",
    persuasiveness: "Sức thuyết phục",
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-10">
      {/* Result Hero Banner */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border shadow-lg text-white relative overflow-hidden ${
          isWin
            ? "bg-gradient-to-r from-[#008A64] to-emerald-400 border-[#008A64]/50"
            : isDraw
            ? "bg-gradient-to-r from-slate-600 to-slate-500 border-slate-400/50"
            : "bg-gradient-to-r from-rose-600 to-rose-400 border-rose-400/50"
        }`}
      >
        {/* Decorative circle */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5" />

        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          {/* Trophy icon */}
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shrink-0">
            {isWin ? (
              <Trophy size={36} className="text-amber-300 fill-amber-300" />
            ) : isDraw ? (
              <Swords size={36} className="text-slate-300" />
            ) : (
              <AlertCircle size={36} className="text-rose-200" />
            )}
          </div>

          <div className="text-center sm:text-left">
            <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-1">Kết quả trận đấu</p>
            <h1 className="text-4xl font-black">
              {isWin ? "Chiến thắng!" : isDraw ? "Hòa" : "Thất bại"}
            </h1>
            <p className="text-white/80 text-sm mt-1.5 max-w-md line-clamp-2">{match.topic}</p>
          </div>

          <div className="ml-auto text-center shrink-0">
            <p className="text-white/60 text-xs mb-1">Điểm của bạn</p>
            <p className="text-5xl font-black font-mono">{match.playerA.score}</p>
            <p className="text-white/60 text-sm">/ 100</p>
          </div>
        </div>

        {/* Match meta */}
        <div className="relative mt-5 pt-5 border-t border-white/20 flex flex-wrap gap-4 text-xs text-white/70">
          <div className="flex items-center gap-1.5"><Clock size={12} />{match.duration}</div>
          <div className="flex items-center gap-1.5"><FileText size={12} />{match.rules}</div>
          <div className="flex items-center gap-1.5"><Gavel size={12} />AI Judge</div>
          <div className="flex items-center gap-1.5">{match.date}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT: vs. card + score comparison */}
        <div className="lg:col-span-5 space-y-4">
          {/* Players */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">So sánh điểm số</h3>
            <div className="flex items-center justify-between gap-4">
              {/* Me */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-[#008A64] text-white font-black flex items-center justify-center text-sm">
                  {match.playerA.avatar}
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-slate-900">{match.playerA.name}</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#008A64] border border-[#008A64]/30">
                    {match.playerA.role === "PRO" ? "Ủng hộ" : "Phản đối"}
                  </span>
                </div>
                <p className="text-3xl font-black text-slate-900 font-mono">{match.playerA.score}</p>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-xl font-black text-slate-300">vs</span>
                {isWin && <span className="text-[10px] font-bold text-[#008A64]">BẠN THẮNG</span>}
                {match.result === "LOSE" && <span className="text-[10px] font-bold text-rose-500">BẠN THUA</span>}
                {isDraw && <span className="text-[10px] font-bold text-slate-500">HÒA</span>}
              </div>

              {/* Opponent */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-rose-500 text-white font-black flex items-center justify-center text-sm">
                  {match.playerB.avatar}
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-slate-900">{match.playerB.name}</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                    {match.playerB.role === "PRO" ? "Ủng hộ" : "Phản đối"}
                  </span>
                </div>
                <p className="text-3xl font-black text-slate-900 font-mono">{match.playerB.score}</p>
              </div>
            </div>

            {/* Score bars */}
            <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
              {Object.entries(scoreLabels).map(([key, label]) => (
                <ScoreBar
                  key={key}
                  label={label}
                  myScore={match.scores[key as keyof typeof match.scores]}
                  theirScore={match.opponentScores[key as keyof typeof match.opponentScores]}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-5 mt-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-[#008A64]" /><span className="text-slate-600">Bạn</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-400" /><span className="text-slate-600">{match.playerB.name}</span></div>
            </div>
          </div>
        </div>

        {/* RIGHT: AI Judge verdict + strengths/improvements */}
        <div className="lg:col-span-7 space-y-4">
          {/* AI Judge verdict */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-violet-50 border border-violet-200">
                <Gavel size={15} className="text-violet-600" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Phán quyết của AI Judge</h3>
            </div>
            <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
              {match.aiJudgeVerdict}
            </p>
          </div>

          {/* Judge comments */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Nhận xét chi tiết của AI Judge</h3>
            <ul className="space-y-2">
              {match.judgeComments.map((comment, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <Target size={13} className="text-slate-400 mt-0.5 shrink-0" />
                  <span>{comment}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Strengths & improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-2.5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#008A64]" />
                <h3 className="text-xs font-bold text-emerald-700">Điểm mạnh của bạn</h3>
              </div>
              <ul className="space-y-2">
                {match.myStrengths.map((s, i) => (
                  <li key={i} className="text-xs text-slate-700 pl-3 border-l-2 border-[#008A64]/30 leading-relaxed">{s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-2.5">
              <div className="flex items-center gap-1.5">
                <AlertCircle size={14} className="text-amber-500" />
                <h3 className="text-xs font-bold text-amber-700">Cần cải thiện</h3>
              </div>
              <ul className="space-y-2">
                {match.myImprovements.map((s, i) => (
                  <li key={i} className="text-xs text-slate-700 pl-3 border-l-2 border-amber-200 leading-relaxed">{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/learner/history"
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl inline-flex items-center gap-2 shadow-xs transition-all"
          >
            <FileText size={14} />Xem lịch sử trận
          </Link>
          <button
            type="button"
            onClick={() => navigate("/learner/debate-1v1")}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl inline-flex items-center gap-2 shadow-xs transition-all"
          >
            <RotateCcw size={14} />Tái đấu
          </button>
        </div>
        <button
          type="button"
          onClick={() => navigate("/learner/dashboard")}
          className="px-6 py-2.5 bg-[#008A64] hover:bg-[#007457] text-white text-xs font-bold rounded-xl shadow-sm inline-flex items-center gap-2 transition-all"
        >
          Quay về Dashboard <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Debate1v1Result;
