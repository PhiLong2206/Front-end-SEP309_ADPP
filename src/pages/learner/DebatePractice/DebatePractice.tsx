import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { MOCK_TOPICS } from "../../../mocks/topics";

const DebatePractice: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTopicId, setSelectedTopicId] = useState(MOCK_TOPICS[1]?.id || "topic-social-media");
  const [role, setRole] = useState<"PRO" | "CON">("PRO");
  const [difficulty, setDifficulty] = useState<"Dễ" | "Trung bình" | "Khó">("Trung bình");

  const currentTopic = MOCK_TOPICS.find((t) => t.id === selectedTopicId) || MOCK_TOPICS[0];

  const handleStartDebate = () => {
    navigate(`/learner/debate/session-${currentTopic.id || "01"}?role=${role}&difficulty=${difficulty}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-7">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
          Tranh biện với AI
        </h1>
        <p className="text-sm text-slate-500 dark:text-[#94A3B8] mt-1.5">
          Lựa chọn chủ đề và thiết lập thông số để bắt đầu phiên tranh biện của bạn.
        </p>
      </div>

      {/* Main Configuration Card */}
      <div className="bg-white debate-panel-main rounded-3xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.18)] p-6 sm:p-8 shadow-xs space-y-6 sm:space-y-7">
        {/* 1. Select Topic */}
        <div className="space-y-2.5">
          <label className="text-[15px] font-bold text-slate-900 dark:text-[#F8FAFC]">
            Chủ đề
          </label>
          <div className="relative">
            <div className="w-full p-3.5 bg-slate-50 dark:bg-[#091713] border border-slate-200 dark:border-[rgba(148,163,184,0.20)] hover:border-slate-300 dark:hover:border-slate-600 rounded-2xl flex items-center justify-between gap-3 shadow-xs transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-emerald-50 dark:bg-[rgba(16,185,129,0.12)] border border-slate-200 dark:border-[rgba(148,163,184,0.20)]">
                  <img
                    src={currentTopic.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"}
                    alt={currentTopic.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full bg-transparent text-sm sm:text-base font-bold text-slate-900 dark:text-[#F8FAFC] focus:outline-none cursor-pointer truncate pr-6"
                >
                  {MOCK_TOPICS.map((t) => (
                    <option key={t.id} value={t.id} className="dark:bg-[#0D1B16] dark:text-[#F8FAFC]">
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
              <ChevronDown size={18} className="text-slate-400 dark:text-[#94A3B8] shrink-0 pointer-events-none" />
            </div>
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
            onClick={handleStartDebate}
            className="w-full py-3.5 px-6 rounded-2xl text-[15px] sm:text-base font-semibold text-white bg-[#008A64] hover:bg-[#007457] active:bg-[#005e45] shadow-md shadow-[#008A64]/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
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
