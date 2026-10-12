import React, { useRef, useEffect } from "react";
import { Bot, Users, Trophy, Lightbulb, BookOpen } from "lucide-react";
import DebateMessageItem, { DebateMessageData } from "./DebateMessageItem";
import { DebateRoomMode } from "../../types";

export interface DebateChatProps {
  messages: DebateMessageData[];
  mode: DebateRoomMode;
  learnerSide: "pro" | "con";
  currentRound: number;
  isAiGenerating?: boolean;
  aiSide?: "pro" | "con";
  statusText?: string;
  onOpenSidebarTab?: (tab: "coach" | "evaluator" | "caseplan" | "members" | "judge") => void;
}

const DebateChat: React.FC<DebateChatProps> = ({
  messages,
  mode,
  learnerSide,
  currentRound,
  isAiGenerating = false,
  aiSide = "con",
  statusText,
  onOpenSidebarTab,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiGenerating]);

  // Group messages by round
  const round1Messages = messages.filter((m) => m.roundNumber === 1);
  const round2Messages = messages.filter((m) => m.roundNumber === 2);
  const round3Messages = messages.filter((m) => m.roundNumber === 3);

  const renderEmptyState = () => {
    switch (mode) {
      case "ai":
        return (
          <div className="max-w-2xl mx-auto my-auto text-center py-10 px-6 bg-white dark:bg-[#12231C] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] dark:bg-[rgba(16,185,129,0.12)] text-[#008A64] dark:text-[#34D399] flex items-center justify-center mx-auto shadow-xs">
              <Bot size={28} />
            </div>
            <div className="space-y-1">
              <h2 className="text-[18px] font-bold text-slate-900 dark:text-[#F8FAFC]">
                Phòng tranh biện AI đã kết nối {statusText ? `(${statusText})` : ""}
              </h2>
              <p className="text-[14px] text-slate-600 dark:text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
                Bạn đang ở vị trí{" "}
                <span className="font-bold text-[#008A64] dark:text-[#34D399]">
                  {learnerSide === "pro" ? "Ủng hộ (PRO)" : "Phản đối (CON)"}
                </span>{" "}
                · Vòng 1 (Mở đầu). Hãy nêu rõ định nghĩa và những luận cứ trọng tâm đầu tiên của bạn ở khung nhập bên dưới.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onOpenSidebarTab?.("coach")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-[rgba(16,185,129,0.10)] text-[#008A64] dark:text-[#34D399] border border-[#008A64]/20 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <Lightbulb size={13} />
                <span>Xem gợi ý phản biện</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenSidebarTab?.("caseplan")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-[#091713] text-slate-700 dark:text-[#CBD5E1] border border-slate-200 dark:border-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <BookOpen size={13} />
                <span>Xem Case Plan</span>
              </button>
            </div>
          </div>
        );

      case "1v1":
        return (
          <div className="max-w-2xl mx-auto my-auto text-center py-10 px-6 bg-white dark:bg-[#12231C] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto shadow-xs">
              <Users size={28} />
            </div>
            <div className="space-y-1">
              <h2 className="text-[18px] font-bold text-slate-900 dark:text-[#F8FAFC]">
                Trận đấu đối kháng 1 vs 1
              </h2>
              <p className="text-[14px] text-slate-600 dark:text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
                Trận tranh biện trực tiếp giữa hai bên PRO và CON. Người ở lượt phát biểu đầu tiên sẽ bắt đầu tại Vòng 1: Mở đầu.
              </p>
            </div>
          </div>
        );

      case "2v2":
        return (
          <div className="max-w-2xl mx-auto my-auto text-center py-10 px-6 bg-white dark:bg-[#12231C] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-xs">
              <Users size={28} />
            </div>
            <div className="space-y-1">
              <h2 className="text-[18px] font-bold text-slate-900 dark:text-[#F8FAFC]">
                Trận đấu đồng đội 2 vs 2
              </h2>
              <p className="text-[14px] text-slate-600 dark:text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
                Cuộc so tài giữa Team PRO (2 người) và Team CON (2 người). Các thành viên phát biểu luân phiên theo lượt thực tế của hệ thống.
              </p>
            </div>
          </div>
        );

      case "competition":
        return (
          <div className="max-w-2xl mx-auto my-auto text-center py-10 px-6 bg-white dark:bg-[#12231C] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
              <Trophy size={28} />
            </div>
            <div className="space-y-1">
              <h2 className="text-[18px] font-bold text-slate-900 dark:text-[#F8FAFC]">
                Trận đấu thuộc Giải đấu chính thức
              </h2>
              <p className="text-[14px] text-slate-600 dark:text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
                Trận đấu được giám sát bởi Hội đồng Giám khảo. Điểm số và phán quyết sẽ được cập nhật sau khi các vòng tranh biện kết thúc.
              </p>
            </div>
          </div>
        );
    }
  };

  const renderRoundSection = (roundNum: number, roundMsgs: DebateMessageData[], label: string) => {
    if (roundMsgs.length === 0 && currentRound < roundNum) return null;

    return (
      <div key={roundNum} className="space-y-4">
        {/* Round Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-[#10231C] text-slate-600 dark:text-[#94A3B8] border border-slate-200 dark:border-slate-800">
            Vòng {roundNum}: {label} {currentRound === roundNum && "(Đang diễn ra)"}
          </span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Messages in this round */}
        {roundMsgs.map((msg) => (
          <DebateMessageItem key={msg.id} message={msg} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5 scroll-smooth">
      {messages.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="max-w-3xl mx-auto space-y-4 w-full">
          {renderRoundSection(1, round1Messages, "Mở đầu")}
          {renderRoundSection(2, round2Messages, "Phản biện")}
          {renderRoundSection(3, round3Messages, "Kết luận")}

          {/* AI Thinking / Generating state */}
          {isAiGenerating && (
            <div className="flex items-start gap-3 mr-auto max-w-[90%] sm:max-w-[85%] animate-fade-in pt-2">
              <div className="w-9 h-9 rounded-xl bg-[#008A64] text-white flex items-center justify-center shrink-0 shadow-xs ring-4 ring-[#ECFDF5] dark:ring-emerald-950/60 mt-1">
                <Bot size={18} />
              </div>
              <div className="bg-white dark:bg-[#12231C] border border-[#008A64]/30 dark:border-emerald-800/40 rounded-2xl rounded-tl-sm p-4 sm:p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-[#008A64] dark:text-[#34D399]">
                    Đối thủ AI ({aiSide === "pro" ? "Ủng hộ" : "Phản đối"})
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-[rgba(16,185,129,0.15)] text-[#008A64] dark:text-[#34D399] font-medium animate-pulse">
                    Đang phân tích...
                  </span>
                </div>
                <div className="flex items-center gap-2 py-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#008A64] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#008A64] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#008A64] animate-bounce" />
                  <span className="text-[14px] text-slate-500 dark:text-[#94A3B8] ml-2 font-medium">
                    AI Opponent đang chuẩn bị luận điểm phản biện...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} className="h-2" />
        </div>
      )}
    </div>
  );
};

export default DebateChat;
