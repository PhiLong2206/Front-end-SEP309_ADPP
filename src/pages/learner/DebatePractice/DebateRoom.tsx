import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Mic, Send, Lightbulb, User as UserIcon, Bot } from "lucide-react";
import DebateStepper from "../../../components/debate/DebateStepper";
import RebuttalSuggestion from "../../../components/debate/RebuttalSuggestion";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import Button from "../../../components/common/Button";
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
    <div className="space-y-4 max-w-6xl mx-auto pb-6">
      {/* 1. TOP BAR: Thoát | Topic Title | 02:15 Timer */}
      <div className="bg-white px-5 py-3 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-4">
        {/* Left: Thoát button */}
        <button
          type="button"
          onClick={() => setShowExitConfirm(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Thoát</span>
        </button>

        {/* Center: Topic Title */}
        <div className="text-center font-bold text-xs sm:text-sm text-slate-900 truncate max-w-md">
          Mạng xã hội có gây hại nhiều hơn lợi ích?
        </div>

        {/* Right: Timer & Finish */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-md font-mono text-xs font-bold text-blue-600">
            <Clock size={13} />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/learner/debate/${sessionId}/result`)}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700 transition-colors shadow-2xs"
          >
            Nộp bài
          </button>
        </div>
      </div>

      {/* 2. ROUND PROGRESS STEPPER: Mở đầu | Phản biện | Kết luận */}
      <DebateStepper currentRound={currentRound} />

      {/* 3. MAIN WORKSPACE (3 Columns: LEFT transcript, CENTER Diễn biến, RIGHT Gợi ý) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT COLUMN: Transcript / Conversation Stream (~45%) */}
        <div className="lg:col-span-5 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs h-[480px] overflow-y-auto space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
            Nội dung tranh biện
          </div>

          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg border text-xs space-y-1.5 ${
                  msg.speaker === "Learner"
                    ? "bg-blue-50/50 border-blue-200/70"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-[11px]">
                  <span className={msg.speaker === "Learner" ? "text-blue-700" : "text-slate-800"}>
                    {msg.speakerName} ({msg.side})
                  </span>
                  <span className="text-slate-400">{msg.timestamp}</span>
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {msg.content}
                </p>
              </div>
            ))}

            {isAiGenerating && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 animate-pulse flex items-center gap-2">
                <Bot size={14} className="text-blue-600" />
                <span>Đối thủ AI đang lập luận phản hồi...</span>
              </div>
            )}
          </div>
        </div>

        {/* CENTER COLUMN: Diễn biến (~35%) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs h-[480px] overflow-y-auto space-y-3.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
            Diễn biến
          </div>

          {/* Vòng 1 */}
          <div className="p-2.5 bg-slate-50/70 rounded-lg border border-slate-200/70 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">Vòng 1 - Mở đầu</span>
            <div className="space-y-1 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <UserIcon size={12} />
                <span>Bạn: Đã hoàn thành (80/100)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Bot size={12} />
                <span>Đối thủ AI: Đã hoàn thành</span>
              </div>
            </div>
          </div>

          {/* Vòng 2 */}
          <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200 space-y-2">
            <span className="text-xs font-bold text-blue-900 block flex items-center justify-between">
              <span>Vòng 2 - Phản biện</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-blue-600 text-white rounded">Đang diễn ra</span>
            </span>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center gap-1.5 text-blue-700 font-bold">
                <UserIcon size={12} />
                <span>Bạn (đang đến lượt)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Bot size={12} />
                <span>Đối thủ AI: Chờ lượt</span>
              </div>
            </div>
          </div>

          {/* Vòng 3 */}
          <div className="p-2.5 bg-slate-50/50 rounded-lg border border-slate-100 opacity-60 space-y-2">
            <span className="text-xs font-bold text-slate-600 block">Vòng 3 - Kết luận</span>
            <div className="text-[11px] text-slate-400">
              Chưa bắt đầu
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Gợi ý phản biện (~40%) */}
        <div className="lg:col-span-4 h-[480px]">
          <RebuttalSuggestion />
        </div>
      </div>

      {/* 4. FIXED BOTTOM COMPOSER: Lập luận của bạn | Textarea | 0/2000 | Mic | Gợi ý | Gửi */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <label htmlFor="debate-argument-textarea" className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Lập luận của bạn
          </label>
          <span className="text-xs text-slate-400">
            {argumentText.length} / 2000
          </span>
        </div>

        <form onSubmit={handleSendArgument} className="space-y-2.5">
          <textarea
            id="debate-argument-textarea"
            rows={3}
            value={argumentText}
            onChange={(e) => setArgumentText(e.target.value.slice(0, 2000))}
            placeholder="Nhập nội dung phản biện của bạn..."
            className="w-full p-3 text-xs bg-slate-50/50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none text-slate-800 placeholder:text-slate-400"
          />

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              {/* Microphone */}
              <button
                type="button"
                onClick={() => setIsRecording(!isRecording)}
                className={`p-2 rounded-lg border transition-colors ${
                  isRecording ? "bg-red-50 border-red-200 text-red-600" : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
                title="Ghi âm giọng nói"
              >
                <Mic size={15} />
              </button>

              {/* Gợi ý button */}
              <button
                type="button"
                onClick={() => setShowTipsModal(true)}
                className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
              >
                <Lightbulb size={13} />
                <span>Gợi ý phản biện</span>
              </button>
            </div>

            {/* Gửi lập luận */}
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!argumentText.trim() || isAiGenerating}
              loading={isAiGenerating}
              className="px-5 font-bold inline-flex items-center gap-1.5"
            >
              <span>Gửi lập luận</span>
              <Send size={13} />
            </Button>
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
