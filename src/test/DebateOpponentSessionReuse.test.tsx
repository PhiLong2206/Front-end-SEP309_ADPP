import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DebateRoom from "../pages/debater/DebatePractice/DebateRoom";
import { getOpponentErrorMessage, normalizeMotion } from "../utils/opponentReadiness";

window.HTMLElement.prototype.scrollIntoView = vi.fn();

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    user: { userId: 1, id: 1, fullName: "Debater Test", role: "Debater" },
    isAuthenticated: true,
  }),
}));

const mockCreateOpponentSession = vi.fn();
const mockGetOpponentSession = vi.fn();
const mockGetOpponentCasePlan = vi.fn();
const mockGenerateOpponentTurn = vi.fn();
const mockGetSessionDetails = vi.fn();
const mockGetTranscript = vi.fn();
const mockSubmitAiArgument = vi.fn();

vi.mock("../api", () => ({
  aiApi: {
    createOpponentSession: (...args: unknown[]) => mockCreateOpponentSession(...args),
    getOpponentSession: (...args: unknown[]) => mockGetOpponentSession(...args),
    getOpponentCasePlan: (...args: unknown[]) => mockGetOpponentCasePlan(...args),
    generateOpponentTurn: (...args: unknown[]) => mockGenerateOpponentTurn(...args),
    evaluateSpeechArgument: vi.fn(),
    evaluateDebateRound: vi.fn(),
    evaluateDebateSession: vi.fn(),
  },
  debateApi: {
    getSessionDetails: (...args: unknown[]) => mockGetSessionDetails(...args),
    getTranscript: (...args: unknown[]) => mockGetTranscript(...args),
    getPendingSwapRequests: vi.fn().mockResolvedValue({ success: true, data: [] }),
    startDebateSession: vi.fn().mockResolvedValue({ success: true }),
    submitArgument: vi.fn(),
    submitAiArgument: (...args: unknown[]) => mockSubmitAiArgument(...args),
  },
}));

// "Mạng xã hội có hại hơn lợi?" in the two Unicode forms
const MOTION_NFC = "Mạng xã hội có hại hơn lợi?".normalize("NFC");
const MOTION_NFD = MOTION_NFC.normalize("NFD");

describe("motion normalisation and opponent error messages", () => {
  it("makes NFD, NFC and padded forms of a motion identical", () => {
    expect(MOTION_NFD).not.toBe(MOTION_NFC); // sanity: really different strings
    expect(normalizeMotion(MOTION_NFD)).toBe(MOTION_NFC);
    expect(normalizeMotion(`  ${MOTION_NFD}\n`)).toBe(normalizeMotion(MOTION_NFC));
  });

  it("describes a data conflict as a conflict, not as a connection problem", () => {
    const message = getOpponentErrorMessage({
      status: 409,
      detail: "external_session_id '12' da ton tai voi du lieu khac: motion",
    });
    expect(message).toContain("không khớp");
    expect(message).not.toContain("Không kết nối được");
  });

  it("keeps the connection wording for other failures", () => {
    expect(getOpponentErrorMessage(new Error("opponent down"))).toContain("Không kết nối được Đối thủ AI");
    expect(getOpponentErrorMessage({ status: 504, detail: "x" })).toContain("quá lâu");
  });
});

describe("DebateRoom (AI practice) and the opponent session when the room is opened again", () => {
  const session = (overrides: Record<string, unknown> = {}) => ({
    sessionId: 12,
    title: "AI practice",
    topic: MOTION_NFC,
    difficulty: "Hard",
    status: 2,
    debateType: 1,
    createdByUserId: 1,
    participants: [
      { userId: 1, side: 2, isAI: false, speakerName: "Debater Test" }, // the learner is CON
      { userId: null, side: 1, isAI: true, speakerName: "AI" },
    ],
    currentTurn: { turnIndex: 1 },
    ...overrides,
  });

  const flush = async () => {
    for (let i = 0; i < 8; i++) {
      await act(async () => {
        await Promise.resolve();
      });
    }
  };

  const renderRoom = async (entry: string) => {
    render(
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route path="/debater/debate/:sessionId" element={<DebateRoom />} />
        </Routes>
      </MemoryRouter>
    );
    await flush();
  };

  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockCreateOpponentSession.mockResolvedValue({ opponent_session_id: "opp-1", status: "ready" });
    mockGetOpponentSession.mockResolvedValue({ status: "ready" });
    mockGetOpponentCasePlan.mockResolvedValue(null);
    mockGetTranscript.mockResolvedValue({ success: true, data: { arguments: [] } });
    mockGenerateOpponentTurn.mockResolvedValue({
      turn_index: 1,
      round_type: "opening",
      mode: "opening",
      speech_text: "Mở đầu của AI.",
    });
    mockSubmitAiArgument.mockResolvedValue({
      success: true,
      data: { turnIndex: 0, alreadyRecorded: false, argument: {}, session: session() },
    });
    mockGetSessionDetails.mockResolvedValue({ success: true, data: session() });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("builds the opponent session from the Backend session (NFC motion, its side and difficulty), not from the URL", async () => {
    // Re-entering from the result page: no query string at all, and a URL motion in another Unicode form
    await renderRoom(`/debater/debate/12?motion=${encodeURIComponent(MOTION_NFD + "  ")}`);

    expect(mockCreateOpponentSession).toHaveBeenCalledTimes(1);
    expect(mockCreateOpponentSession).toHaveBeenCalledWith({
      external_session_id: "12",
      motion: MOTION_NFC,
      learner_side: "con", // from the Backend participant, the URL default would have said "pro"
      ai_side: "pro",
      difficulty: "hard",
      language: "vi",
    });
  });

  it("does not create the opponent session before the Backend session has loaded", async () => {
    mockGetSessionDetails.mockReturnValue(new Promise(() => {})); // never resolves

    await renderRoom("/debater/debate/12");

    expect(mockCreateOpponentSession).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Lập luận của bạn")).toBeDisabled();
  });

  it("reuses the existing opponent session when the service reports other data, without an error banner", async () => {
    mockCreateOpponentSession.mockRejectedValue({
      status: 409,
      detail: "external_session_id '12' da ton tai voi du lieu khac: motion",
    });
    mockGetOpponentSession.mockResolvedValue({ status: "ready" });

    await renderRoom("/debater/debate/12");

    expect(mockCreateOpponentSession).toHaveBeenCalledTimes(1);
    expect(mockGetOpponentSession).toHaveBeenCalledWith("12");
    expect(screen.queryByTestId("debate-feedback-banner")).not.toBeInTheDocument();
    // The reused session works: the AI (PRO) opened the debate and it is now the learner's turn
    expect(mockGenerateOpponentTurn).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Mở đầu của AI.")).toBeInTheDocument();
    expect(screen.getByLabelText("Lập luận của bạn")).not.toBeDisabled();
  });

  it("does not ask the AI for its opening again after a reload in the middle of the debate", async () => {
    sessionStorage.setItem(
      "adpp_messages_12",
      JSON.stringify([
        {
          id: "msg-1",
          speaker: "AI",
          speakerName: "Đối thủ AI",
          side: "Ủng hộ",
          stage: "Mở đầu",
          roundNumber: 1,
          timestamp: "10:00",
          content: "Mở đầu đã có từ trước khi tải lại.",
        },
      ])
    );

    await renderRoom("/debater/debate/12?role=CON");

    expect(mockCreateOpponentSession).toHaveBeenCalledTimes(1); // idempotent: the service returns the same session
    expect(mockGenerateOpponentTurn).not.toHaveBeenCalled();
    expect(mockSubmitAiArgument).not.toHaveBeenCalled();
    expect(screen.getByText("Mở đầu đã có từ trước khi tải lại.")).toBeInTheDocument();
    expect(screen.getByLabelText("Lập luận của bạn")).not.toBeDisabled();
  });

  it("keeps polling the Backend session while the debate is in progress, but stops once it is completed", async () => {
    await renderRoom("/debater/debate/12");
    const afterLoad = mockGetSessionDetails.mock.calls.length;

    await act(async () => {
      await vi.advanceTimersByTimeAsync(9_000);
    });
    expect(mockGetSessionDetails.mock.calls.length).toBeGreaterThan(afterLoad); // in progress: polled

    mockGetSessionDetails.mockResolvedValue({
      success: true,
      data: session({ status: 3, currentTurn: undefined }),
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3_100); // the next poll reports "completed"
    });
    await flush();

    const afterCompleted = mockGetSessionDetails.mock.calls.length;
    await act(async () => {
      await vi.advanceTimersByTimeAsync(30_000);
    });
    expect(mockGetSessionDetails.mock.calls.length).toBe(afterCompleted); // no more polling
  });

  it("never creates an opponent session for a completed debate and shows no error banner", async () => {
    mockGetSessionDetails.mockResolvedValue({
      success: true,
      data: session({ status: 3, currentTurn: undefined }),
    });

    await renderRoom("/debater/debate/12");

    expect(mockCreateOpponentSession).not.toHaveBeenCalled();
    expect(mockGetOpponentSession).not.toHaveBeenCalled();
    expect(mockGenerateOpponentTurn).not.toHaveBeenCalled();
    expect(screen.queryByTestId("debate-feedback-banner")).not.toBeInTheDocument();
  });
});
