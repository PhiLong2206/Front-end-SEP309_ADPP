import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DebateRoom from "../pages/debater/DebatePractice/DebateRoom";

// Mock scrollIntoView for jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

// Mock useAuth hook
vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    user: { userId: 1, id: 1, fullName: "Debater Test", role: "Debater" },
    isAuthenticated: true,
  }),
}));

// Mock API calls
const mockCreateOpponentSession = vi.fn();
const mockGetOpponentCasePlan = vi.fn();
const mockGenerateOpponentTurn = vi.fn();
const mockEvaluateSpeechArgument = vi.fn();
const mockEvaluateDebateRound = vi.fn();
const mockEvaluateDebateSession = vi.fn();

vi.mock("../api", () => ({
  aiApi: {
    createOpponentSession: (...args: unknown[]) => mockCreateOpponentSession(...args),
    getOpponentCasePlan: (...args: unknown[]) => mockGetOpponentCasePlan(...args),
    generateOpponentTurn: (...args: unknown[]) => mockGenerateOpponentTurn(...args),
    evaluateSpeechArgument: (...args: unknown[]) => mockEvaluateSpeechArgument(...args),
    evaluateDebateRound: (...args: unknown[]) => mockEvaluateDebateRound(...args),
    evaluateDebateSession: (...args: unknown[]) => mockEvaluateDebateSession(...args),
  },
  debateApi: {
    getSessionDetails: vi.fn(),
    getTranscript: vi.fn(),
    submitArgument: vi.fn(),
  },
}));

const renderDebateRoom = (initialEntry = "/debater/debate/test-session?role=PRO&difficulty=Trung%20b%C3%ACnh") => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/debater/debate/:sessionId" element={<DebateRoom />} />
        <Route path="/debater/debate/:sessionId/result" element={<div>Result Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe("DebateRoom Timer Expiration & State Machine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    mockCreateOpponentSession.mockResolvedValue({ opponent_session_id: "opp-1", status: "ready" });
    mockGetOpponentCasePlan.mockResolvedValue(null);
    mockGenerateOpponentTurn.mockResolvedValue({
      turn_index: 2,
      round_type: "opening",
      mode: "opening_reply",
      speech_text: "Phản hồi chính thức từ Đối thủ AI.",
    });
    mockEvaluateSpeechArgument.mockResolvedValue({
      overall_score: 8.0,
      overall_reasoning: "Lập luận tốt",
      criteria: [{ name: "Logic", score: 8, reasoning: "Tốt" }],
      strengths: ["Rõ ràng"],
      weaknesses: [],
      suggestions: [],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("1. handles timeout at 00:00 with no submitted argument (disables input/Send, updates status, no fake AI response)", async () => {
    renderDebateRoom("/debater/debate/session-timeout-1?role=PRO");

    // Initially in Round 1 (02:15), active turn indicator is "Đến lượt bạn phát biểu"
    expect(screen.getByTestId("debate-countdown-timer")).toHaveTextContent("02:15");
    expect(screen.getByTestId("turn-status-indicator")).toHaveTextContent("Đến lượt bạn phát biểu");

    const textarea = screen.getByLabelText("Lập luận của bạn") as HTMLTextAreaElement;
    const sendBtn = screen.getByLabelText("Gửi lập luận") as HTMLButtonElement;
    expect(textarea).not.toBeDisabled();

    // Advance 135 seconds to reach 00:00
    await act(async () => {
      vi.advanceTimersByTime(135_000);
    });

    // Countdown reaches 00:00
    expect(screen.getByTestId("debate-countdown-timer")).toHaveTextContent("00:00");

    // UI no longer displays "Đến lượt bạn phát biểu" — shows "Đã hết thời gian phát biểu"
    expect(screen.getByTestId("turn-status-indicator")).toHaveTextContent("Đã hết thời gian phát biểu");
    expect(screen.queryByText("Đến lượt bạn phát biểu")).not.toBeInTheDocument();

    // Argument input and Send button are disabled
    expect(textarea).toBeDisabled();
    expect(sendBtn).toBeDisabled();

    // Timeout notification and round timeout notice are visible
    expect(screen.getByTestId("debate-feedback-banner")).toHaveTextContent("Đã hết thời gian phát biểu");
    expect(screen.getByTestId("round-1-timeout-notice")).toBeInTheDocument();

    // No fake AI Opponent turn was generated on timeout
    expect(mockGenerateOpponentTurn).not.toHaveBeenCalled();
  });

  it("2. handles timeout in subsequent round after an argument has been submitted in Round 1", async () => {
    renderDebateRoom("/debater/debate/session-timeout-2?role=PRO");

    const textarea = screen.getByLabelText("Lập luận của bạn") as HTMLTextAreaElement;
    const sendBtn = screen.getByLabelText("Gửi lập luận") as HTMLButtonElement;

    // Submit argument in Round 1 (Opening)
    fireEvent.change(textarea, {
      target: { value: "Luận điểm mở đầu của tôi về kiến nghị này rất rõ ràng." },
    });
    expect(sendBtn).not.toBeDisabled();

    await act(async () => {
      fireEvent.click(sendBtn);
    });

    // Transitions to Round 2 (Rebuttal) with fresh 02:00 timer
    expect(screen.getByText(/Vòng 2\/3/)).toBeInTheDocument();
    expect(screen.getByTestId("debate-countdown-timer")).toHaveTextContent("02:00");
    expect(screen.getByTestId("turn-status-indicator")).toHaveTextContent("Đến lượt bạn phát biểu");

    // Advance 120 seconds in Round 2 without submitting a Round 2 argument
    await act(async () => {
      vi.advanceTimersByTime(120_000);
    });

    expect(screen.getByTestId("debate-countdown-timer")).toHaveTextContent("00:00");
    expect(screen.getByTestId("turn-status-indicator")).toHaveTextContent("Đã hết thời gian phát biểu");
    expect(textarea).toBeDisabled();
    expect(sendBtn).toBeDisabled();
    expect(screen.getByTestId("round-2-timeout-notice")).toBeInTheDocument();
    // Round 1 messages are preserved
    expect(screen.getByText("Luận điểm mở đầu của tôi về kiến nghị này rất rõ ràng.")).toBeInTheDocument();
    expect(screen.getByText("Phản hồi chính thức từ Đối thủ AI.")).toBeInTheDocument();
  });

  it("3. transitions cleanly between Opening (Round 1), Rebuttal (Round 2), and Conclusion (Round 3)", async () => {
    renderDebateRoom("/debater/debate/session-transitions?role=PRO");

    // Round 1 (Opening) times out at 00:00
    await act(async () => {
      vi.advanceTimersByTime(135_000);
    });
    expect(screen.getByTestId("round-1-timeout-notice")).toBeInTheDocument();

    // Advance from Opening (Round 1) to Rebuttal (Round 2)
    const advanceToR2Btn = screen.getByTestId("advance-round-after-timeout-btn");
    await act(async () => {
      fireEvent.click(advanceToR2Btn);
    });

    expect(screen.getByText(/Vòng 2\/3/)).toBeInTheDocument();
    expect(screen.getByTestId("debate-countdown-timer")).toHaveTextContent("02:00");
    expect(screen.getByTestId("turn-status-indicator")).toHaveTextContent("Đến lượt bạn phát biểu");

    // Submit argument in Rebuttal (Round 2) -> transitions to Conclusion (Round 3)
    const textarea = screen.getByLabelText("Lập luận của bạn") as HTMLTextAreaElement;
    fireEvent.change(textarea, {
      target: { value: "Phản biện của tôi ở Vòng 2 bác bỏ các giả định của đối phương." },
    });
    await act(async () => {
      fireEvent.click(screen.getByLabelText("Gửi lập luận"));
    });

    expect(screen.getByText(/Vòng 3\/3/)).toBeInTheDocument();
    expect(screen.getByTestId("debate-countdown-timer")).toHaveTextContent("02:00");
    expect(screen.getByTestId("turn-status-indicator")).toHaveTextContent("Đến lượt bạn phát biểu");
  });

  it("4. completes the final round (Conclusion / Round 3) both on timeout at 00:00 and on submission", async () => {
    renderDebateRoom("/debater/debate/session-final-timeout?role=PRO");

    // Round 1 timeout -> advance to Round 2
    await act(async () => {
      vi.advanceTimersByTime(135_000);
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("advance-round-after-timeout-btn"));
    });

    // Round 2 timeout -> advance to Round 3
    await act(async () => {
      vi.advanceTimersByTime(120_000);
    });
    await act(async () => {
      fireEvent.click(screen.getByTestId("advance-round-after-timeout-btn"));
    });

    expect(screen.getByText(/Vòng 3\/3/)).toBeInTheDocument();

    // Let Round 3 (Conclusion) expire at 00:00
    await act(async () => {
      vi.advanceTimersByTime(120_000);
    });

    // Final round completes automatically at 00:00
    expect(screen.getByTestId("debate-countdown-timer")).toHaveTextContent("00:00");
    expect(screen.getByTestId("turn-status-indicator")).toHaveTextContent("Đã hoàn thành 3 vòng");
    expect(screen.getByTestId("debate-completed-banner")).toBeInTheDocument();
    expect(screen.getByLabelText("Lập luận của bạn")).toBeDisabled();
    expect(screen.getByLabelText("Gửi lập luận")).toBeDisabled();
  });

  it("5. does NOT mark Round 3 complete when PRO submits conclusion until AI Opponent (CON) responds", async () => {
    renderDebateRoom("/debater/debate/session-r3-pending?role=PRO");

    const textarea = screen.getByLabelText("Lập luận của bạn") as HTMLTextAreaElement;
    const sendBtn = screen.getByLabelText("Gửi lập luận") as HTMLButtonElement;

    // Round 1: Debater submits -> AI Opponent responds -> advance to Round 2
    mockGenerateOpponentTurn.mockResolvedValueOnce({
      turn_index: 2,
      round_type: "opening",
      mode: "opening_reply",
      speech_text: "Phản hồi Mở đầu của phe CON ở Vòng 1.",
    });
    fireEvent.change(textarea, { target: { value: "Luận điểm Mở đầu của phe PRO ở Vòng 1." } });
    await act(async () => {
      fireEvent.click(sendBtn);
    });
    expect(screen.getByText(/Vòng 2\/3/)).toBeInTheDocument();
    expect(screen.getByText("Phản hồi Mở đầu của phe CON ở Vòng 1.")).toBeInTheDocument();

    // Round 2: Debater submits -> AI Opponent responds -> advance to Round 3
    mockGenerateOpponentTurn.mockResolvedValueOnce({
      turn_index: 4,
      round_type: "rebuttal",
      mode: "rebuttal_reply",
      speech_text: "Phản hồi Phản biện của phe CON ở Vòng 2.",
    });
    fireEvent.change(textarea, { target: { value: "Luận điểm Phản biện của phe PRO ở Vòng 2." } });
    await act(async () => {
      fireEvent.click(sendBtn);
    });
    expect(screen.getByText(/Vòng 3\/3/)).toBeInTheDocument();
    expect(screen.getByText("Phản hồi Phản biện của phe CON ở Vòng 2.")).toBeInTheDocument();

    // Round 3: Hold AI Opponent response in a pending promise
    let resolveRound3AiTurn!: (value: unknown) => void;
    mockGenerateOpponentTurn.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRound3AiTurn = resolve;
        })
    );

    fireEvent.change(textarea, { target: { value: "Luận điểm Kết luận của phe PRO ở Vòng 3." } });
    await act(async () => {
      fireEvent.click(sendBtn);
    });

    // While CON has NOT responded yet:
    // - Debate MUST NOT be marked completed
    // - "Nộp bài & Xem kết quả" MUST NOT be rendered/enabled
    // - Status must show AI is responding
    expect(screen.getByText("Luận điểm Kết luận của phe PRO ở Vòng 3.")).toBeInTheDocument();
    expect(screen.queryByTestId("debate-completed-banner")).not.toBeInTheDocument();
    expect(screen.queryByTestId("submit-and-view-result-btn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("header-submit-debate-btn")).not.toBeInTheDocument();
    expect(screen.getByTestId("turn-status-indicator")).toHaveTextContent("Đối thủ AI đang phản hồi...");
    expect(screen.getByTestId("ai-typing-indicator")).toBeInTheDocument();

    // Now resolve CON's Round 3 response
    await act(async () => {
      resolveRound3AiTurn({
        turn_index: 6,
        round_type: "closing",
        mode: "closing_reply",
        speech_text: "Phản hồi Kết luận cuối cùng của phe CON ở Vòng 3.",
      });
    });

    // Only AFTER CON's Round 3 speech is recorded does the debate complete
    expect(screen.getByText("Phản hồi Kết luận cuối cùng của phe CON ở Vòng 3.")).toBeInTheDocument();
    expect(screen.getByTestId("debate-completed-banner")).toBeInTheDocument();
    expect(screen.getByTestId("submit-and-view-result-btn")).not.toBeDisabled();
    expect(screen.getByTestId("header-submit-debate-btn")).not.toBeDisabled();
    expect(screen.getByTestId("turn-status-indicator")).toHaveTextContent("Đã hoàn thành 3 vòng");
  });

  it("6. shows error/waiting state (not completed) if AI Opponent request fails or times out in Round 3, and completes upon retry", async () => {
    renderDebateRoom("/debater/debate/session-r3-error?role=PRO");

    const textarea = screen.getByLabelText("Lập luận của bạn") as HTMLTextAreaElement;
    const sendBtn = screen.getByLabelText("Gửi lập luận") as HTMLButtonElement;

    // Complete Round 1 & Round 2
    fireEvent.change(textarea, { target: { value: "Lập luận Vòng 1 của PRO." } });
    await act(async () => {
      fireEvent.click(sendBtn);
    });
    fireEvent.change(textarea, { target: { value: "Lập luận Vòng 2 của PRO." } });
    await act(async () => {
      fireEvent.click(sendBtn);
    });
    expect(screen.getByText(/Vòng 3\/3/)).toBeInTheDocument();

    // Round 3 AI Opponent request fails/times out
    mockGenerateOpponentTurn.mockRejectedValueOnce(new Error("Request timeout"));

    fireEvent.change(textarea, { target: { value: "Lập luận Kết luận Vòng 3 của PRO." } });
    await act(async () => {
      fireEvent.click(sendBtn);
    });

    // Must NOT be marked completed — must stay in waiting-for-opponent state with error & retry option
    expect(screen.queryByTestId("debate-completed-banner")).not.toBeInTheDocument();
    expect(screen.queryByTestId("submit-and-view-result-btn")).not.toBeInTheDocument();
    expect(screen.getByTestId("turn-status-indicator")).toHaveTextContent("Đang chờ lượt đối thủ");
    expect(screen.getByTestId("debate-feedback-banner")).toHaveTextContent(
      "Không nhận được phản hồi từ Đối thủ AI"
    );
    expect(screen.getByTestId("retry-ai-turn-btn")).toBeInTheDocument();

    // Retry succeeds -> records AI Opponent's Round 3 speech and completes debate
    mockGenerateOpponentTurn.mockResolvedValueOnce({
      turn_index: 6,
      round_type: "closing",
      mode: "closing_reply",
      speech_text: "Phản hồi Kết luận Vòng 3 của CON sau khi thử lại.",
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("retry-ai-turn-btn"));
    });

    expect(screen.getByText("Phản hồi Kết luận Vòng 3 của CON sau khi thử lại.")).toBeInTheDocument();
    expect(screen.getByTestId("debate-completed-banner")).toBeInTheDocument();
    expect(screen.getByTestId("submit-and-view-result-btn")).not.toBeDisabled();
  });

  it("7. prevents timer reaching 00:00 during a pending AI response from prematurely completing the debate", async () => {
    renderDebateRoom("/debater/debate/session-r3-timer-race?role=PRO");

    const textarea = screen.getByLabelText("Lập luận của bạn") as HTMLTextAreaElement;
    const sendBtn = screen.getByLabelText("Gửi lập luận") as HTMLButtonElement;

    // Complete Round 1 & Round 2
    fireEvent.change(textarea, { target: { value: "Lập luận Vòng 1." } });
    await act(async () => {
      fireEvent.click(sendBtn);
    });
    fireEvent.change(textarea, { target: { value: "Lập luận Vòng 2." } });
    await act(async () => {
      fireEvent.click(sendBtn);
    });
    expect(screen.getByText(/Vòng 3\/3/)).toBeInTheDocument();

    // Advance 118s in Round 3 so only 2s remain on the clock
    await act(async () => {
      vi.advanceTimersByTime(118_000);
    });
    expect(screen.getByTestId("debate-countdown-timer")).toHaveTextContent("00:02");

    // Submit Round 3 argument while AI Opponent takes 15 seconds to respond
    let resolvePendingAi!: (value: unknown) => void;
    mockGenerateOpponentTurn.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolvePendingAi = resolve;
        })
    );

    fireEvent.change(textarea, { target: { value: "Kết luận Vòng 3 sát giờ." } });
    await act(async () => {
      fireEvent.click(sendBtn);
    });

    // Advance 30 seconds past the original deadline while AI is still responding
    await act(async () => {
      vi.advanceTimersByTime(30_000);
    });

    // Must NOT prematurely complete or trigger timeout while AI response is pending
    expect(screen.queryByTestId("debate-completed-banner")).not.toBeInTheDocument();
    expect(screen.queryByTestId("submit-and-view-result-btn")).not.toBeInTheDocument();
    expect(screen.getByTestId("turn-status-indicator")).toHaveTextContent("Đối thủ AI đang phản hồi...");

    // Resolve AI response -> now completes cleanly
    await act(async () => {
      resolvePendingAi({
        turn_index: 6,
        round_type: "closing",
        mode: "closing_reply",
        speech_text: "Kết luận của CON hoàn tất.",
      });
    });

    expect(screen.getByText("Kết luận của CON hoàn tất.")).toBeInTheDocument();
    expect(screen.getByTestId("debate-completed-banner")).toBeInTheDocument();
  });

  it("8. prevents double submission and duplicate AI turns on rapid clicks", async () => {
    renderDebateRoom("/debater/debate/session-no-dup?role=PRO");

    const textarea = screen.getByLabelText("Lập luận của bạn") as HTMLTextAreaElement;
    const sendBtn = screen.getByLabelText("Gửi lập luận") as HTMLButtonElement;

    let resolveAiTurn!: (value: unknown) => void;
    mockGenerateOpponentTurn.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveAiTurn = resolve;
        })
    );

    fireEvent.change(textarea, { target: { value: "Luận điểm duy nhất trong vòng 1." } });

    await act(async () => {
      fireEvent.click(sendBtn);
      fireEvent.click(sendBtn);
      fireEvent.click(sendBtn);
    });

    expect(mockGenerateOpponentTurn).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveAiTurn({
        turn_index: 2,
        round_type: "opening",
        mode: "opening_reply",
        speech_text: "Phản hồi duy nhất từ AI.",
      });
    });

    expect(screen.getAllByText("Luận điểm duy nhất trong vòng 1.")).toHaveLength(1);
    expect(screen.getAllByText("Phản hồi duy nhất từ AI.")).toHaveLength(1);
  });
});
