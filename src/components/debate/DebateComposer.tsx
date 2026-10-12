import React, { useRef, useEffect } from "react";
import { Mic, Send, Lightbulb, Info, Lock, Eye, Gavel } from "lucide-react";
import { DebateRoleInRoom } from "../../types";

export interface DebateComposerProps {
  argumentText: string;
  isAiGenerating?: boolean;
  isSubmitting?: boolean;
  isRecording?: boolean;
  canSpeak: boolean;
  cannotSpeakReason?: string;
  userRoleInRoom?: DebateRoleInRoom;
  activeSpeakerName?: string;
  onArgumentChange: (text: string) => void;
  onSend: () => void;
  onToggleRecording: () => void;
  onOpenTipsModal: () => void;
  onOpenCoachTab: () => void;
}

const DebateComposer: React.FC<DebateComposerProps> = ({
  argumentText,
  isAiGenerating = false,
  isSubmitting = false,
  isRecording = false,
  canSpeak = true,
  cannotSpeakReason,
  userRoleInRoom = "Debater",
  activeSpeakerName,
  onArgumentChange,
  onSend,
  onToggleRecording,
  onOpenTipsModal,
  onOpenCoachTab,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea dynamically
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      const nextHeight = Math.min(Math.max(el.scrollHeight, 48), 180);
      el.style.height = `${nextHeight}px`;
    }
  }, [argumentText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSpeak && argumentText.trim() && !isAiGenerating && !isSubmitting) {
        onSend();
      }
    }
  };

  const isLocked = !canSpeak || isAiGenerating || isSubmitting;

  return (
    <div className="p-3 sm:p-4 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent dark:from-[#07110E] dark:via-[#07110E]/95 border-t border-slate-200/80 dark:border-[rgba(148,163,184,0.16)] shrink-0 z-10">
      <div className="max-w-3xl mx-auto w-full space-y-2">
        {/* Status / Permission Notice when locked */}
        {!canSpeak && (
          <div className="px-4 py-2 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-amber-800 dark:text-amber-300 text-xs flex items-center justify-between gap-2 animate-fade-in">
            <div className="flex items-center gap-2">
              {userRoleInRoom === "Judge" ? (
                <Gavel size={14} className="text-amber-600 shrink-0" />
              ) : userRoleInRoom === "Spectator" ? (
                <Eye size={14} className="text-slate-500 shrink-0" />
              ) : (
                <Lock size={14} className="text-amber-600 shrink-0" />
              )}
              <span className="font-medium">
                {cannotSpeakReason ||
                  (userRoleInRoom === "Judge"
                    ? "Bạn đang theo dõi với tư cách Giám khảo. Chấm điểm tại sidebar bên phải."
                    : userRoleInRoom === "Spectator"
                    ? "Bạn đang theo dõi với tư cách Khán giả (Read-only)."
                    : `Đang chờ lượt phát biểu của ${activeSpeakerName || "đối thủ"}...`)}
              </span>
            </div>
            {userRoleInRoom === "Debater" && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-900/60 font-semibold shrink-0">
                Chưa đến lượt
              </span>
            )}
          </div>
        )}

        {/* Input Card */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (canSpeak && argumentText.trim() && !isAiGenerating && !isSubmitting) {
              onSend();
            }
          }}
          className={`bg-white dark:bg-[#12231C] rounded-2xl sm:rounded-3xl border shadow-md transition-all p-3 sm:p-3.5 space-y-2 ${
            isLocked
              ? "border-slate-200 dark:border-slate-800/80 opacity-85"
              : "border-slate-200 dark:border-[rgba(148,163,184,0.20)] hover:border-slate-300 dark:hover:border-slate-700 focus-within:border-[#008A64] focus-within:ring-2 focus-within:ring-[#008A64]/15"
          }`}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={argumentText}
            onChange={(e) => onArgumentChange(e.target.value.slice(0, 2000))}
            onKeyDown={handleKeyDown}
            placeholder={
              !canSpeak
                ? userRoleInRoom === "Judge"
                  ? "Chế độ Giám khảo (Sử dụng tab Đánh giá ở sidebar)"
                  : userRoleInRoom === "Spectator"
                  ? "Chế độ Khán giả (Theo dõi trận đấu)"
                  : "Chờ đến lượt của bạn để nhập lập luận..."
                : "Nhập lập luận hoặc phản biện của bạn... (Enter để gửi, Shift+Enter xuống dòng)"
            }
            disabled={isLocked}
            rows={1}
            className="w-full text-[15px] sm:text-[16px] leading-[1.6] bg-transparent outline-none resize-none text-slate-800 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-[#64748B] max-h-[180px] min-h-[48px] px-1 disabled:cursor-not-allowed"
          />

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
            {/* Left controls */}
            <div className="flex items-center gap-2">
              {/* Mic button */}
              <button
                type="button"
                onClick={onToggleRecording}
                disabled={isLocked}
                className={`p-2 rounded-xl transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${
                  isRecording
                    ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 animate-pulse border border-red-200 dark:border-red-800"
                    : "text-slate-600 dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-[#172C23]"
                }`}
                title={isRecording ? "Dừng ghi âm" : "Ghi âm giọng nói (Tiếng Việt)"}
              >
                <Mic size={16} />
                {isRecording && <span>Đang ghi...</span>}
              </button>

              {/* Coaching suggestion button */}
              <button
                type="button"
                onClick={onOpenCoachTab}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg text-[#008A64] dark:text-[#34D399] bg-[#ECFDF5] dark:bg-[rgba(16,185,129,0.12)] hover:bg-emerald-100 dark:hover:bg-[rgba(16,185,129,0.22)] border border-[#008A64]/20 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Lightbulb size={13} />
                <span>Gợi ý</span>
              </button>

              {/* Tips button */}
              <button
                type="button"
                onClick={onOpenTipsModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-lg cursor-pointer"
                title="Mẹo tranh biện WSDC"
              >
                <Info size={15} />
              </button>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              <span
                className={`text-xs ${
                  argumentText.length > 1800
                    ? "text-red-500 font-bold"
                    : "text-slate-400 dark:text-[#94A3B8]"
                }`}
              >
                {argumentText.length}/2000
              </span>

              <button
                type="submit"
                disabled={isLocked || !argumentText.trim()}
                className="p-2 sm:px-3 sm:py-2 bg-[#008A64] hover:bg-[#007457] text-white rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isAiGenerating || isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="hidden sm:inline">Đang gửi</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Gửi</span>
                    <Send size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DebateComposer;
