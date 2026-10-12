import React from "react";
import { Bot, User as UserIcon, Shield, Flame } from "lucide-react";

export interface DebateMessageData {
  id: string;
  speaker: "Learner" | "AI" | "OpponentLearner" | "Teammate";
  speakerName: string;
  side: "Ủng hộ" | "Phản đối";
  teamRole?: string; // e.g. "PRO 1", "PRO 2", "CON 1", "CON 2"
  stage: "Mở đầu" | "Phản biện" | "Kết luận";
  roundNumber: number;
  timestamp: string;
  content: string;
  isCurrentUser?: boolean;
}

export interface DebateMessageItemProps {
  message: DebateMessageData;
}

const DebateMessageItem: React.FC<DebateMessageItemProps> = ({ message }) => {
  const isUser = message.isCurrentUser ?? message.speaker === "Learner";
  const isAI = message.speaker === "AI";
  const isPro = message.side === "Ủng hộ";

  return (
    <div
      className={`flex items-start gap-3 w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Left Avatar for other participants or AI */}
      {!isUser && (
        <div
          className={`w-9 h-9 rounded-xl text-white flex items-center justify-center shrink-0 shadow-xs mt-1 ${
            isAI
              ? "bg-[#008A64]"
              : isPro
              ? "bg-emerald-600"
              : "bg-rose-600"
          }`}
        >
          {isAI ? <Bot size={18} /> : <UserIcon size={17} />}
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`p-4 sm:p-5 rounded-2xl transition-all ${
          isUser
            ? "debate-msg-user bg-[#ECFDF5]/80 dark:bg-[rgba(16,185,129,0.12)] border border-[#008A64]/30 dark:border-[rgba(16,185,129,0.30)] rounded-tr-sm max-w-[85%] sm:max-w-[78%] ml-auto text-slate-800 dark:text-[#F8FAFC]"
            : "debate-msg-ai bg-white dark:bg-[#12231C] border border-slate-200/90 dark:border-[rgba(148,163,184,0.16)] rounded-tl-sm max-w-[90%] sm:max-w-[85%] mr-auto text-slate-800 dark:text-[#DCE7E3]"
        }`}
      >
        {/* Header Metadata */}
        <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Speaker Name */}
            <span
              className={`font-bold ${
                isUser
                  ? "text-[#008A64] dark:text-[#34D399]"
                  : isPro
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-rose-700 dark:text-rose-400"
              }`}
            >
              {message.speakerName}
            </span>

            {/* Side tag */}
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded font-semibold text-[11px] ${
                isPro
                  ? "bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "bg-rose-100/70 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
              }`}
            >
              {isPro ? <Shield size={10} /> : <Flame size={10} />}
              <span>{message.side}</span>
              {message.teamRole && <span className="opacity-80">({message.teamRole})</span>}
            </span>

            {/* Round & Stage */}
            <span className="px-2 py-0.2 rounded-full bg-slate-100 dark:bg-[#091713] text-slate-600 dark:text-[#94A3B8] font-medium text-[11px]">
              Vòng {message.roundNumber} · {message.stage}
            </span>
          </div>

          {/* Timestamp */}
          <span className="text-slate-400 dark:text-[#94A3B8] text-[12px] font-mono shrink-0">
            {message.timestamp}
          </span>
        </div>

        {/* Content */}
        <p
          className={`text-[15px] sm:text-[16px] leading-[1.7] whitespace-pre-line ${
            isUser
              ? "debate-user-body text-slate-800 dark:text-[#E2E8F0]"
              : "debate-ai-body text-slate-800 dark:text-[#DCE7E3]"
          }`}
        >
          {message.content}
        </p>
      </div>

      {/* Right Avatar for Current User */}
      {isUser && (
        <div className="w-9 h-9 rounded-xl bg-slate-800 dark:bg-[#123326] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
          <UserIcon size={17} />
        </div>
      )}
    </div>
  );
};

export default DebateMessageItem;
