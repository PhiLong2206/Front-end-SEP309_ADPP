import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Mic, Send, Lightbulb, User as UserIcon, Bot } from "lucide-react";
import DebateStepper from "../../../components/debate/DebateStepper";
import RebuttalSuggestion from "../../../components/debate/RebuttalSuggestion";
import AICoachingPanel from "../../../components/debate/AICoachingPanel";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { MOCK_DEBATE_TRANSCRIPT, MockDebateMessage } from "../../../mocks/debate";

const DebateRoom: React.FC = () => {
  const { sessionId = "demo-session" } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const [currentRound, setCurrentRound] = useState(2); // Vòng 2 - Phản biện
  const [messages, setMessages] = useState<MockDebateMessage[]>(MOCK_DEBATE_TRANSCRIPT);
  const [argumentText, setArgumentText] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(135); // 02:15
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Countdown timer simulation (02:15)
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendArgument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!argumentText.trim() || isAiGenerating) return;

    const newLearnerMsg: MockDebateMessage = {
      id: `msg-${Date.now()}`,
      speaker: "Learner",
      speakerName: "Bạn (Phi Long)",
      side: "Ủng hộ",
      stage: currentRound === 1 ? "Mở đầu" : currentRound === 2 ? "Phản biện" : "Kết luận",
      roundNumber: currentRound,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      content: argumentText.trim(),
    };

    setMessages((prev) => [...prev, newLearnerMsg]);
    setArgumentText("");
    setIsAiGenerating(true);

    // Simulate AI opponent response
    setTimeout(() => {
      const aiResponseMsg: MockDebateMessage = {
        id: `msg-${Date.now() + 1}`,
        speaker: "AI",
        speakerName: "Đối thủ AI",
        side: "Phản đối",
        stage: currentRound === 1 ? "Mở đầu" : currentRound === 2 ? "Phản biện" : "Kết luận",
        roundNumber: currentRound,
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        content:
          "Tôi ghi nhận góc nhìn của bạn. Tuy nhiên, việc kìm hãm mạng xã hội sẽ làm mất đi cơ hội tiếp cận thế giới phẳng của giới trẻ. Chúng ta cần hướng tới việc giáo dục kỹ năng số và nâng cao nhận thức người dùng thay vì áp đặt các lệnh cấm đoan.",
      };
      setMessages((prev) => [...prev, aiResponseMsg]);
      setIsAiGenerating(false);

      if (currentRound < 3) {
        setCurrentRound((prev) => prev + 1);
        setSecondsRemaining(120);
      }
    }, 1600);
  };

  return (
    <div className="space-y-4.5 max-w-6xl mx-auto pb-6">
      {/* 1. TOP BAR: Thoát | Topic Title | 02:15 Timer (Spec #1, #3) */}
      <div className="bg-white debate-panel-main px-6 py-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        {/* Left: Thoát button */}
        <button
          type="button"
          onClick={() => setShowExitConfirm(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-[15px] font-semibold text-slate-700 dark:text-[#CBD5E1] bg-slate-100 hover:bg-slate-200 dark:bg-[#10231C] dark:hover:bg-[#123326] rounded-xl transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Thoát</span>
        </button>

        {/* Center: Topic Title (17-18px font-weight: 700) */}
        <div className="text-center font-bold text-[17px] sm:text-[18px] text-slate-900 dark:text-[#F8FAFC] truncate max-w-md">
          Mạng xã hội có gây hại nhiều hơn lợi ích?
        </div>

        {/* Right: Timer & Finish */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#ECFDF5] dark:bg-[rgba(16,185,129,0.12)] border border-[#008A64]/20 dark:border-[rgba(16,185,129,0.30)] rounded-xl font-mono text-[15px] font-bold text-[#008A64] dark:text-[#34D399]">
            <Clock size={15} />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/learner/debate/${sessionId}/result`)}
            className="px-4 py-2 bg-[#008A64] text-white rounded-xl text-[15px] font-semibold hover:bg-[#007457] transition-all shadow-sm shadow-[#008A64]/20"
          >
            Nộp bài
          </button>
        </div>
      </div>

      {/* 2. ROUND PROGRESS STEPPER: Mở đầu | Phản biện | Kết luận */}
      <DebateStepper currentRound={currentRound} />

      {/* 3. MAIN WORKSPACE (3 Columns: Conversation 42%, Diễn biến 24%, AI Assistant 34%) */}
      <div className="debate-room-grid grid grid-cols-1 lg:grid-cols-[42fr_24fr_34fr] gap-4.5 items-start">
        {/* LEFT COLUMN: Transcript / Conversation Stream (~42%) */}
        <div className="bg-white debate-panel-main p-5 rounded-2xl border border-slate-200 shadow-xs h-[540px] xl:h-[580px] overflow-y-auto space-y-4">
          <div className="text-[17px] font-bold text-slate-900 dark:text-[#F8FAFC] pb-3 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
            <span>Nội dung tranh biện</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#10231C] text-slate-600 dark:text-[#94A3B8]">
              {messages.length} lượt tranh luận
            </span>
          </div>

          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 ${
                  msg.speaker === "Learner"
                    ? "debate-msg-user bg-[#ECFDF5]/60 border-[#008A64]/30"
                    : "debate-msg-ai bg-slate-50 border-slate-200/80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={
                      msg.speaker === "Learner"
                        ? "debate-user-author text-[16px] font-semibold text-[#008A64] dark:text-[#34D399]"
                        : "debate-ai-author text-[16px] font-semibold text-slate-900 dark:text-[#F8FAFC]"
                    }
                  >
                    {msg.speakerName} ({msg.side})
                  </span>
                  <span className="debate-meta-time text-[14px] text-slate-400 dark:text-[#94A3B8]">
                    {msg.timestamp}
                  </span>
                </div>
                <p
                  className={
                    msg.speaker === "Learner"
                      ? "debate-user-body text-[16px] leading-[1.7] whitespace-pre-line text-slate-700 dark:text-[#E2E8F0]"
                      : "debate-ai-body text-[16px] leading-[1.7] whitespace-pre-line text-slate-700 dark:text-[#DCE7E3]"
                  }
                >
                  {msg.content}
                </p>
              </div>
            ))}

            {isAiGenerating && (
              <div className="p-4 bg-[#ECFDF5]/30 dark:bg-[rgba(16,185,129,0.08)] rounded-2xl border border-[#008A64]/20 dark:border-[rgba(16,185,129,0.25)] text-[15px] text-slate-700 dark:text-[#DCE7E3] animate-pulse flex items-center gap-2.5">
                <Bot size={16} className="text-[#008A64] dark:text-[#34D399]" />
                <span>Đối thủ AI đang lập luận phản hồi...</span>
              </div>
            )}
          </div>
        </div>

        {/* CENTER COLUMN: Diễn biến (~24%) */}
        <div className="bg-white debate-panel-secondary p-5 rounded-2xl border border-slate-200 shadow-xs h-[540px] xl:h-[580px] overflow-y-auto space-y-4">
          <div className="text-[17px] font-bold text-slate-900 dark:text-[#F8FAFC] pb-3 border-b border-slate-100 dark:border-slate-800/60">
            Diễn biến
          </div>

          {/* Vòng 1 */}
          <div className="p-3.5 bg-slate-50 dark:bg-[#091713] rounded-xl border border-slate-200/80 dark:border-[rgba(148,163,184,0.16)] space-y-2.5">
            <span className="text-[15px] font-semibold text-slate-900 dark:text-[#F8FAFC] block">
              Vòng 1 - Mở đầu
            </span>
            <div className="space-y-1.5 text-[14px]">
              <div className="flex items-center gap-2 text-[#008A64] dark:text-[#34D399] font-semibold">
                <UserIcon size={14} />
                <span>Bạn: Đã hoàn thành (80/100)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-[#CBD5E1]">
                <Bot size={14} />
                <span>Đối thủ AI: Đã hoàn thành</span>
              </div>
            </div>
          </div>

          {/* Vòng 2 */}
          <div className="p-3.5 bg-[#ECFDF5]/70 dark:bg-[#123326] rounded-xl border border-[#008A64]/40 dark:border-[rgba(16,185,129,0.35)] space-y-2.5 debate-surface-elevated">
            <span className="text-[15px] font-semibold text-[#008A64] dark:text-[#34D399] flex items-center justify-between">
              <span>Vòng 2 - Phản biện</span>
              <span className="text-xs px-2 py-0.5 bg-[#008A64] text-white rounded font-bold">
                Đang diễn ra
              </span>
            </span>
            <div className="space-y-1.5 text-[14px]">
              <div className="flex items-center gap-2 text-[#008A64] dark:text-[#34D399] font-semibold">
                <UserIcon size={14} />
                <span>Bạn (đang đến lượt)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-[#94A3B8]">
                <Bot size={14} />
                <span>Đối thủ AI: Chờ lượt</span>
              </div>
            </div>
          </div>

          {/* Vòng 3 */}
          <div className="p-3.5 bg-slate-50/50 dark:bg-[#091713]/60 rounded-xl border border-slate-100 dark:border-[rgba(148,163,184,0.10)] opacity-70 space-y-2">
            <span className="text-[15px] font-semibold text-slate-600 dark:text-[#94A3B8] block">
              Vòng 3 - Kết luận
            </span>
            <div className="text-[14px] text-slate-400 dark:text-[#94A3B8]">
              Chưa bắt đầu
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Gợi ý phản biện + AI Coaching (~34%) */}
        <div className="space-y-4 h-[540px] xl:h-[580px] overflow-y-auto">
          <RebuttalSuggestion />
          <AICoachingPanel costPerUse={2000} />
        </div>
      </div>

      {/* 4. FIXED BOTTOM COMPOSER: Lập luận của bạn | Textarea | 0/2000 | Mic | Gợi ý | Gửi */}
      <div className="bg-white debate-panel-main p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="debate-argument-textarea" className="text-[15px] font-bold text-slate-900 dark:text-[#F8FAFC]">
            Lập luận của bạn
          </label>
          <span className="text-[14px] text-slate-400 dark:text-[#94A3B8]">
            {argumentText.length} / 2000
          </span>
        </div>

        <form onSubmit={handleSendArgument} className="space-y-3">
          <textarea
            id="debate-argument-textarea"
            rows={3}
            value={argumentText}
            onChange={(e) => setArgumentText(e.target.value.slice(0, 2000))}
            placeholder="Nhập nội dung phản biện của bạn..."
            className="w-full p-3.5 text-[15px] sm:text-[16px] leading-[1.65] bg-slate-50 dark:bg-[#091713] border border-slate-200 dark:border-[rgba(148,163,184,0.20)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008A64]/20 focus:border-[#008A64] resize-none text-slate-800 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-[#64748B] transition-all"
          />

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5">
              {/* Microphone */}
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isRecording
                    ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400"
                    : "bg-slate-100 dark:bg-[#10231C] border-slate-200 dark:border-[rgba(148,163,184,0.20)] text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-200 dark:hover:bg-[#123326]"
                }`}
                title="Ghi âm giọng nói"
              >
                <Mic size={17} />
              </button>

              {/* Gợi ý button */}
              <button
                type="button"
                onClick={() => setShowTipsModal(true)}
                className="px-4 py-2 bg-[#ECFDF5] text-[#008A64] dark:bg-[rgba(16,185,129,0.12)] dark:text-[#34D399] border border-[#008A64]/30 dark:border-[rgba(16,185,129,0.30)] rounded-xl text-[15px] font-semibold inline-flex items-center gap-2 hover:bg-emerald-100 dark:hover:bg-[rgba(16,185,129,0.20)] transition-colors"
              >
                <Lightbulb size={16} />
                <span>Gợi ý phản biện</span>
              </button>
            </div>

            {/* Gửi lập luận */}
            <button
              type="submit"
              disabled={!argumentText.trim() || isAiGenerating}
              className="px-6 py-2.5 bg-[#008A64] hover:bg-[#007457] text-white rounded-xl text-[15px] sm:text-[16px] font-semibold inline-flex items-center gap-2 transition-all shadow-sm shadow-[#008A64]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isAiGenerating ? "Đang gửi..." : "Gửi lập luận"}</span>
              <Send size={15} />
            </button>
          </div>
        </form>
      </div>

      {/* Exit Confirm Dialog */}
      <ConfirmDialog
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onConfirm={() => navigate("/learner/dashboard")}
        title="Rời phòng tranh biện?"
        message="Phiên tranh biện sẽ tạm dừng và lưu lại trên hệ thống. Bạn có muốn quay về Dashboard?"
        confirmText="Rời phòng"
        cancelText="Ở lại tiếp tục"
        variant="danger"
      />

      {/* Tips modal for quick mobile/tablet lookup */}
      {showTipsModal && (
        <ConfirmDialog
          isOpen={showTipsModal}
          onClose={() => setShowTipsModal(false)}
          onConfirm={() => setShowTipsModal(false)}
          title="Gợi ý phản biện AI"
          message="Đối phương cho rằng mạng xã hội chỉ là công cụ trung lập. Bạn hãy xoáy sâu vào tính bất cân xứng giữa thuật toán tối ưu tương tác của Big Tech và tâm lý của trẻ vị thành niên."
          confirmText="Đã hiểu"
          cancelText="Đóng"
          variant="primary"
        />
      )}
    </div>
  );
};

export default DebateRoom;
