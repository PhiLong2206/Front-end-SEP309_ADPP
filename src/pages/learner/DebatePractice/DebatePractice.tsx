import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

const DebatePractice: React.FC = () => {
  const navigate = useNavigate();
  const [topicMotion, setTopicMotion] = useState("");
  const [role, setRole] = useState<"PRO" | "CON">("PRO");
  const [difficulty, setDifficulty] = useState<"Dễ" | "Trung bình" | "Khó">("Trung bình");

  const handleStartDebate = () => {
    if (!topicMotion.trim()) return;
    const sessionId = `session-${Date.now()}`;
    navigate(`/learner/debate/${sessionId}?role=${role}&difficulty=${difficulty}&motion=${encodeURIComponent(topicMotion.trim())}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-7">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
          Tranh biện với AI
        </h1>
        <p className="text-sm text-slate-500 dark:text-[#94A3B8] mt-1.5">
          Nhập chủ đề hoặc kiến nghị và thiết lập thông số để bắt đầu phiên luyện tập với AI.
        </p>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-white debate-panel-main rounded-3xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] p-6 sm:p-8 shadow-xs space-y-6 sm:space-y-7">
        {/* 1. Enter Topic */}
        <div className="space-y-2.5">
          <label className="text-[15px] font-bold text-slate-900 dark:text-[#F8FAFC]">
            Chủ đề / Kiến nghị tranh biện <span className="text-rose-500">*</span>
          </label>
          <div>
            <textarea
              rows={3}
              value={topicMotion}
              onChange={(e) => setTopicMotion(e.target.value)}
              placeholder="Ví dụ: Chúng tôi tin rằng trí tuệ nhân tạo nên được quản lý chặt chẽ bởi luật pháp quốc tế..."
              className="w-full p-3.5 bg-slate-50 dark:bg-[#091713] border border-slate-200 dark:border-[rgba(148,163,184,0.20)] focus:border-[#008A64] rounded-2xl text-sm font-medium text-slate-900 dark:text-[#F8FAFC] focus:outline-none shadow-xs transition-colors resize-none"
            />
          </div>
        </div>

        {/* 2. Select Role (PRO / CON) */}
        <div className="space-y-2.5">
          <label className="text-[15px] font-bold text-slate-900 dark:text-[#F8FAFC]">
            Vai trò của bạn
          </label>
          <div className="grid grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => setRole("PRO")}
              className={`py-3.5 px-4 rounded-2xl border text-sm sm:text-[15px] font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs ${
                role === "PRO"
                  ? "bg-[#ECFDF5]/70 dark:bg-[rgba(16,185,129,0.12)] border-[#008A64] dark:border-[rgba(16,185,129,0.40)] text-[#008A64] dark:text-[#34D399] ring-1 ring-[#008A64]"
                  : "bg-slate-50 dark:bg-[#091713] border-slate-200 dark:border-[rgba(148,163,184,0.20)] text-slate-700 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-[#10231C]"
              }`}
            >
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${role === "PRO" ? "border-[#008A64] bg-[#008A64] text-white" : "border-slate-300 dark:border-slate-600"}`}>
                {role === "PRO" && <Check size={11} strokeWidth={3} />}
              </span>
              <span>Ủng hộ (PRO)</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("CON")}
              className={`py-3.5 px-4 rounded-2xl border text-sm sm:text-[15px] font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs ${
                role === "CON"
                  ? "bg-[#ECFDF5]/70 dark:bg-[rgba(16,185,129,0.12)] border-[#008A64] dark:border-[rgba(16,185,129,0.40)] text-[#008A64] dark:text-[#34D399] ring-1 ring-[#008A64]"
                  : "bg-slate-50 dark:bg-[#091713] border-slate-200 dark:border-[rgba(148,163,184,0.20)] text-slate-700 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-[#10231C]"
              }`}
            >
              <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${role === "CON" ? "border-[#008A64] bg-[#008A64] text-white" : "border-slate-300 dark:border-slate-600"}`}>
                {role === "CON" && <Check size={11} strokeWidth={3} />}
              </span>
              <span>Phản đối (CON)</span>
            </button>
          </div>
        </div>

        {/* 3. AI Difficulty */}
        <div className="space-y-2.5">
          <label className="text-[15px] font-bold text-slate-900 dark:text-[#F8FAFC]">
            Cấp độ AI
          </label>
          <div className="grid grid-cols-3 gap-3.5">
            {(["Dễ", "Trung bình", "Khó"] as const).map((level) => {
              const isActive = difficulty === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`py-3 px-3 rounded-2xl border text-sm sm:text-[15px] font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs ${
                    isActive
                      ? "bg-[#ECFDF5]/70 dark:bg-[rgba(16,185,129,0.12)] border-[#008A64] dark:border-[rgba(16,185,129,0.40)] text-[#008A64] dark:text-[#34D399] ring-1 ring-[#008A64]"
                      : "bg-slate-50 dark:bg-[#091713] border-slate-200 dark:border-[rgba(148,163,184,0.20)] text-slate-700 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-[#10231C]"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isActive ? "border-[#008A64] bg-[#008A64]" : "border-slate-300 dark:border-slate-600"}`}>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span>{level}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Start Debate CTA Button */}
        <div className="pt-2">
          <button
            type="button"
            disabled={!topicMotion.trim()}
            onClick={handleStartDebate}
            className="w-full py-3.5 px-6 rounded-2xl text-[15px] sm:text-base font-semibold text-white bg-[#008A64] hover:bg-[#007457] active:bg-[#005e45] shadow-md shadow-[#008A64]/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Bắt đầu tranh biện</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebatePractice;
