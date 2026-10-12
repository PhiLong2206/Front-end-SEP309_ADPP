import React from "react";
import {
  ArrowLeft,
  Clock,
  Shield,
  Flame,
  Users,
  Trophy,
  Bot,
  PanelRightClose,
  PanelRightOpen,
  Eye,
  Gavel,
} from "lucide-react";
import Badge from "../common/Badge";
import { DebateRoomMode, DebateRoleInRoom } from "../../types";

export interface DebateHeaderProps {
  motionText: string;
  mode: DebateRoomMode;
  userRoleInRoom?: DebateRoleInRoom;
  learnerSide: "pro" | "con";
  difficultyText?: string;
  currentRound: number;
  secondsRemaining: number;
  isSidebarOpen: boolean;
  hasNewEvaluation?: boolean;
  competitionTitle?: string;
  matchTitle?: string;
  onExit: () => void;
  onSubmitDebate: () => void;
  onToggleSidebar: () => void;
}

const DebateHeader: React.FC<DebateHeaderProps> = ({
  motionText,
  mode,
  userRoleInRoom = "Debater",
  learnerSide,
  difficultyText = "Trung bình",
  currentRound,
  secondsRemaining,
  isSidebarOpen,
  hasNewEvaluation = false,
  competitionTitle,
  matchTitle,
  onExit,
  onSubmitDebate,
  onToggleSidebar,
}) => {
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getModeBadge = () => {
    switch (mode) {
      case "ai":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-[#008A64] dark:text-[#34D399] border border-emerald-200 dark:border-emerald-800/40">
            <Bot size={12} />
            <span>AI Practice</span>
          </span>
        );
      case "1v1":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
            <Users size={12} />
            <span>Đối kháng 1 vs 1</span>
          </span>
        );
      case "2v2":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
            <Users size={12} />
            <span>Đồng đội 2 vs 2</span>
          </span>
        );
      case "competition":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
            <Trophy size={12} />
            <span>Giải đấu (Competition)</span>
          </span>
        );
    }
  };

  return (
    <header className="bg-white dark:bg-[#12231C] border-b border-slate-200 dark:border-[rgba(148,163,184,0.18)] px-4 sm:px-6 py-3 rounded-t-2xl shadow-xs z-10 shrink-0">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Exit button + Motion Title + Badges */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onExit}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[14px] font-semibold text-slate-700 dark:text-[#CBD5E1] bg-slate-100 hover:bg-slate-200 dark:bg-[#091713] dark:hover:bg-[#172C23] rounded-xl transition-colors cursor-pointer shrink-0"
            title="Rời khỏi phòng tranh biện"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Thoát</span>
          </button>

          <div className="min-w-0">
            {/* Competition title if in competition mode */}
            {mode === "competition" && (competitionTitle || matchTitle) && (
              <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-bold mb-0.5">
                <Trophy size={12} />
                <span>{competitionTitle || "Giải đấu tranh biện"}</span>
                {matchTitle && (
                  <>
                    <span>•</span>
                    <span className="text-slate-600 dark:text-slate-400">{matchTitle}</span>
                  </>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              <h1
                className="font-bold text-[16px] sm:text-[17px] text-slate-900 dark:text-[#F8FAFC] truncate"
                title={motionText}
              >
                {motionText}
              </h1>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
              {getModeBadge()}

              {/* User Side Badge (if Debater) */}
              {userRoleInRoom === "Debater" ? (
                <Badge
                  variant={learnerSide === "pro" ? "primary" : "warning"}
                  size="sm"
                  className="font-semibold tracking-normal"
                >
                  {learnerSide === "pro" ? (
                    <span className="flex items-center gap-1">
                      <Shield size={11} /> Ủng hộ (PRO)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Flame size={11} /> Phản đối (CON)
                    </span>
                  )}
                </Badge>
              ) : userRoleInRoom === "Judge" ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  <Gavel size={11} /> Ban Giám Khảo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Eye size={11} /> Khán Giả (Spectator)
                </span>
              )}

              {/* Difficulty (if AI practice) */}
              {mode === "ai" && difficultyText && (
                <>
                  <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                  <span className="text-slate-500 dark:text-[#94A3B8] font-medium hidden sm:inline">
                    Độ khó: <span className="font-semibold text-slate-700 dark:text-[#CBD5E1]">{difficultyText}</span>
                  </span>
                </>
              )}

              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold hidden md:inline">
                Vòng {currentRound}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Timer, Action & Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Countdown timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ECFDF5] dark:bg-[rgba(16,185,129,0.12)] border border-[#008A64]/20 dark:border-[rgba(16,185,129,0.30)] rounded-xl font-mono text-[14px] sm:text-[15px] font-bold text-[#008A64] dark:text-[#34D399]">
            <Clock size={14} className="text-[#008A64] dark:text-[#34D399]" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          {/* Submit / Finish button (only for debater/judge) */}
          <button
            type="button"
            onClick={onSubmitDebate}
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-[#008A64] text-white rounded-xl text-[14px] sm:text-[15px] font-semibold hover:bg-[#007457] transition-all shadow-xs cursor-pointer"
          >
            {userRoleInRoom === "Judge" ? "Chấm điểm" : "Nộp bài"}
          </button>

          {/* Toggle sidebar button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className={`p-2 rounded-xl border transition-all cursor-pointer relative ${
              isSidebarOpen
                ? "bg-[#ECFDF5] text-[#008A64] border-[#008A64]/30 dark:bg-[rgba(16,185,129,0.15)] dark:text-[#34D399] dark:border-[rgba(16,185,129,0.35)]"
                : "bg-slate-100 dark:bg-[#091713] text-slate-700 dark:text-[#CBD5E1] border-slate-200 dark:border-slate-800 hover:bg-slate-200"
            }`}
            title={isSidebarOpen ? "Đóng thanh công cụ" : "Mở thanh công cụ & thông tin"}
          >
            {isSidebarOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
            {hasNewEvaluation && !isSidebarOpen && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#07110E]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default DebateHeader;
