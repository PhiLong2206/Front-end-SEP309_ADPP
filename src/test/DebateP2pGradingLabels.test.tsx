import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act, configure } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DebateRoom from "../pages/debater/DebatePractice/DebateRoom";
import DebateResult from "../pages/debater/DebatePractice/DebateResult";
import { getSpeakerRelation } from "../utils/debateSpeaker";

window.HTMLElement.prototype.scrollIntoView = vi.fn();

// These tests render the whole room with real timers; the first render is slow when the full suite runs.
configure({ asyncUtilTimeout: 4000 });

const ME = 1;
const MY_NAME = "Nguyen Van A";

const SIGNED_IN_USER = { userId: 1, id: 1, fullName: "Nguyen Van A", role: "Debater" };
let mockAuthUser: typeof SIGNED_IN_USER | null = SIGNED_IN_USER;

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    user: mockAuthUser,
    isAuthenticated: true,
  }),
}));

const mockGetSessionDetails = vi.fn();
const mockGetTranscript = vi.fn();
const mockEvaluateDebateRound = vi.fn();
const mockEvaluateDebateSession = vi.fn();
const mockEvaluateSpeechArgument = vi.fn();

vi.mock("../api", () => ({
  aiApi: {
    createOpponentSession: vi.fn(),
    getOpponentCasePlan: vi.fn(),
    getOpponentSession: vi.fn(),
    generateOpponentTurn: vi.fn(),
    evaluateSpeechArgument: (...args: unknown[]) => mockEvaluateSpeechArgument(...args),
    evaluateDebateRound: (...args: unknown[]) => mockEvaluateDebateRound(...args),
    evaluateDebateSession: (...args: unknown[]) => mockEvaluateDebateSession(...args),
  },
  debateApi: {
    getSessionDetails: (...args: unknown[]) => mockGetSessionDetails(...args),
    getTranscript: (...args: unknown[]) => mockGetTranscript(...args),
    getPendingSwapRequests: vi.fn().mockResolvedValue({ success: true, data: [] }),
    submitArgument: vi.fn(),
    startDebateSession: vi.fn(),
  },
}));

interface Participant {
  userId: number | null;
  side: number;
  speakerName: string;
  isAI?: boolean;
}

interface Argument {
  argumentId: number;
  turnOrder: number;
  stage: number;
  side: number;
  speakerName: string;
  isAI: boolean;
  content: string;
  submittedAt: string;
  userId?: number;
}

const PRO = 1;
const CON = 2;
const COMPLETED = 3;
const IN_PROGRESS = 2;
const OPPONENT = "Tran Thi B";
const TEAMMATE = "Le Van C";
const OPPONENT_2 = "Pham Thi D";

let nextArgumentId = 1;
const arg = (stage: number, side: number, speakerName: string, content: string, userId?: number): Argument => ({
  argumentId: nextArgumentId++,
  turnOrder: stage,
  stage,
  side,
  speakerName,
  isAI: false,
  content,
  submittedAt: "2026-11-03T10:00:00Z",
  ...(userId === undefined ? {} : { userId }),
});

const oneVsOne: Participant[] = [
  { userId: ME, side: PRO, speakerName: MY_NAME },
  { userId: 2, side: CON, speakerName: OPPONENT },
];

const twoVsTwo: Participant[] = [
  { userId: ME, side: PRO, speakerName: MY_NAME },
  { userId: 3, side: PRO, speakerName: TEAMMATE },
  { userId: 2, side: CON, speakerName: OPPONENT },
  { userId: 4, side: CON, speakerName: OPPONENT_2 },
];

/** Full 1v1 transcript: both players speak once in each of the 3 rounds. */
const fullOneVsOne = (mySide = PRO): Argument[] =>
  [1, 2, 3].flatMap((stage) => [
    arg(stage, mySide, MY_NAME, `Tôi vòng ${stage}`),
    arg(stage, mySide === PRO ? CON : PRO, OPPONENT, `Đối thủ vòng ${stage}`),
  ]);

/** Full 2v2 transcript. `myRounds` are the rounds I speak in; my teammate takes my slot in the others. */
const fullTwoVsTwo = (myRounds = [1, 2, 3]): Argument[] =>
  [1, 2, 3].flatMap((stage) => [
    myRounds.includes(stage)
      ? arg(stage, PRO, MY_NAME, `Tôi vòng ${stage}`)
      : arg(stage, PRO, TEAMMATE, `Đồng đội thay tôi vòng ${stage}`),
    arg(stage, CON, OPPONENT, `Đối thủ 1 vòng ${stage}`),
    arg(stage, PRO, TEAMMATE, `Đồng đội vòng ${stage}`),
    arg(stage, CON, OPPONENT_2, `Đối thủ 2 vòng ${stage}`),
  ]);

let currentTranscript: Argument[] = [];
let currentSession: Record<string, unknown> = {};

const seedSession = (
  debateType: number | string,
  participants: Participant[],
  args: Argument[],
  overrides: Record<string, unknown> = {}
) => {
  currentSession = {
    sessionId: 123,
    title: "Phòng tranh biện",
    topic: "Mạng xã hội có hại hơn lợi?",
    status: COMPLETED,
    debateType,
    currentStage: 3,
    currentTurnSide: 1,
    currentTurn: null,
    createdByUserId: ME,
    participants: participants.map((p) => ({ isAI: false, ...p })),
    ...overrides,
  };
  currentTranscript = args;
};

const renderRoom = () =>
  render(
    <MemoryRouter initialEntries={["/debater/debate/123"]}>
      <Routes>
        <Route path="/debater/debate/:sessionId" element={<DebateRoom />} />
        <Route
          path="/debater/debate/:sessionId/result"
          element={
            <>
              <div data-testid="result-page" />
              <DebateResult />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );

const clickSubmitOnce = async (speech: string) => {
  await screen.findByText(speech);
  const btn = await screen.findByTestId("header-submit-debate-btn");
  await waitFor(() => expect(btn).not.toBeDisabled());
  fireEvent.click(btn);
};

/** Waits until the given speech is on screen, submits, and waits for the result page. */
const submitOnceLoaded = async (speech: string) => {
  await clickSubmitOnce(speech);
  await screen.findByTestId("result-page");
};

const turnsOfStage = (stage: string) =>
  mockEvaluateDebateRound.mock.calls.map((c) => c[0]).find((p) => p.stage === stage)?.turns;

const gradedStages = () => mockEvaluateDebateRound.mock.calls.map((c) => c[0].stage);

describe("Final grading attributes every speech to the right person", () => {
  beforeEach(() => {
    nextArgumentId = 1;
    mockAuthUser = SIGNED_IN_USER;
    sessionStorage.clear();
    localStorage.clear();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    mockGetSessionDetails.mockImplementation(async () => ({ success: true, data: currentSession }));
    mockGetTranscript.mockImplementation(async () => ({
      success: true,
      data: { arguments: currentTranscript },
    }));
    mockEvaluateDebateRound.mockImplementation(async ({ stage }: { stage: string }) => ({
      stage,
      round_score: 7,
      overall_reasoning: "Ổn",
      criteria: [],
      strengths: [],
      weaknesses: [],
      suggestions: [],
    }));
    mockEvaluateDebateSession.mockResolvedValue({
      overall_score: 7,
      stage_breakdown: {},
      progress_trend: "ổn định",
    });
    mockEvaluateSpeechArgument.mockResolvedValue({
      overall_score: 8,
      overall_reasoning: "Tốt",
      criteria: [],
      strengths: [],
      weaknesses: [],
      suggestions: [],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  describe("with the debateType the Backend will return", () => {
    it.each([
      ["P2pMatch (số)", 2],
      ["P2pMatch (chuỗi)", "P2pMatch"],
      ["Direct1v1 (số)", 3],
      ["Direct1v1 (chuỗi)", "Direct1v1"],
    ])("1v1 %s: only my turns are 'learner'", async (_name, debateType) => {
      seedSession(debateType, oneVsOne, fullOneVsOne());
      renderRoom();
      await submitOnceLoaded("Tôi vòng 1");

      expect(gradedStages()).toEqual(["opening", "rebuttal", "closing"]);
      expect(turnsOfStage("opening")).toEqual([
        { speaker: "learner", text: "Tôi vòng 1" },
        { speaker: "opponent", text: "Đối thủ vòng 1" },
      ]);
    });

    it.each([
      ["số", 2],
      ["chuỗi", "P2pMatch"],
    ])("2v2 (%s): I am 'learner', both opposing players are 'opponent', my teammate is left out", async (_name, debateType) => {
      seedSession(debateType, twoVsTwo, fullTwoVsTwo());
      renderRoom();
      await submitOnceLoaded("Tôi vòng 1");

      expect(turnsOfStage("opening")).toEqual([
        { speaker: "learner", text: "Tôi vòng 1" },
        { speaker: "opponent", text: "Đối thủ 1 vòng 1" },
        { speaker: "opponent", text: "Đối thủ 2 vòng 1" },
      ]);
    });

    it.each([
      ["số", 1],
      ["chuỗi", "AiPractice"],
    ])("AI (%s): my turns are 'learner', the AI's are 'opponent', and my side comes from the Backend", async (_name, debateType) => {
      seedSession(debateType, [
        { userId: ME, side: CON, speakerName: MY_NAME },
        { userId: null, side: PRO, speakerName: "AI Opponent", isAI: true },
      ], []);
      const local = (id: string, speaker: string, roundNumber: number, content: string) => ({
        id,
        speaker,
        speakerName: speaker === "AI" ? "Đối thủ AI" : "Bạn",
        side: speaker === "AI" ? "Ủng hộ" : "Phản đối",
        stage: "Mở đầu",
        roundNumber,
        timestamp: "",
        content,
      });
      sessionStorage.setItem(
        "adpp_messages_123",
        JSON.stringify(
          [1, 2, 3].flatMap((r) => [
            local(`ai-${r}`, "AI", r, `AI vòng ${r}`),
            local(`me-${r}`, "Debater", r, `Tôi vòng ${r}`),
          ])
        )
      );
      sessionStorage.setItem("adpp_debate_completed_123", "1");
      sessionStorage.setItem("adpp_current_round_123", "3");
      renderRoom();
      await submitOnceLoaded("Tôi vòng 1");

      expect(turnsOfStage("closing")).toEqual([
        { speaker: "opponent", text: "AI vòng 3" },
        { speaker: "learner", text: "Tôi vòng 3" },
      ]);
      expect(mockEvaluateDebateRound.mock.calls[0][0].side).toBe("con");
      // An AI session's transcript is local: the P2P completeness check does not apply.
      expect(mockGetTranscript).not.toHaveBeenCalled();
    });
  });

  describe("who is who", () => {
    it("1v1: same result from the CON player's seat, and the evaluator is told the real side", async () => {
      seedSession(
        2,
        [
          { userId: 2, side: PRO, speakerName: OPPONENT },
          { userId: ME, side: CON, speakerName: MY_NAME },
        ],
        fullOneVsOne(CON)
      );
      renderRoom();
      await submitOnceLoaded("Tôi vòng 1");

      expect(turnsOfStage("opening")?.[0]).toEqual({ speaker: "learner", text: "Tôi vòng 1" });
      expect(mockEvaluateDebateRound.mock.calls[0][0].side).toBe("con");
      expect(mockEvaluateDebateSession.mock.calls[0][0].side).toBe("con");
    });

    it("1v1: an opponent with my exact full name is still the opponent", async () => {
      seedSession(
        3,
        [
          { userId: ME, side: PRO, speakerName: MY_NAME },
          { userId: 2, side: CON, speakerName: MY_NAME },
        ],
        [1, 2, 3].flatMap((stage) => [
          arg(stage, PRO, MY_NAME, `Tôi vòng ${stage}`),
          arg(stage, CON, MY_NAME, `Đối thủ trùng tên vòng ${stage}`),
        ])
      );
      renderRoom();
      await submitOnceLoaded("Tôi vòng 1");

      expect(turnsOfStage("opening")).toEqual([
        { speaker: "learner", text: "Tôi vòng 1" },
        { speaker: "opponent", text: "Đối thủ trùng tên vòng 1" },
      ]);
    });

    it("transcript userId wins: a teammate with my exact name is told apart once the Backend sends it", async () => {
      const sameName: Participant[] = [
        { userId: ME, side: PRO, speakerName: MY_NAME },
        { userId: 3, side: PRO, speakerName: MY_NAME },
        { userId: 2, side: CON, speakerName: OPPONENT },
        { userId: 4, side: CON, speakerName: OPPONENT_2 },
      ];
      seedSession(
        2,
        sameName,
        [1, 2, 3].flatMap((stage) => [
          arg(stage, PRO, MY_NAME, `Tôi vòng ${stage}`, ME),
          arg(stage, CON, OPPONENT, `Đối thủ 1 vòng ${stage}`, 2),
          arg(stage, PRO, MY_NAME, `Đồng đội trùng tên vòng ${stage}`, 3),
          arg(stage, CON, OPPONENT_2, `Đối thủ 2 vòng ${stage}`, 4),
        ])
      );
      renderRoom();
      await submitOnceLoaded("Tôi vòng 1");

      expect(turnsOfStage("opening")).toEqual([
        { speaker: "learner", text: "Tôi vòng 1" },
        { speaker: "opponent", text: "Đối thủ 1 vòng 1" },
        { speaker: "opponent", text: "Đối thủ 2 vòng 1" },
      ]);
    });

    it("getSpeakerRelation: userId is authoritative over a misleading side and name", () => {
      const speech = { side: PRO, speakerName: MY_NAME };

      expect(getSpeakerRelation({ ...speech, speakerUserId: ME }, twoVsTwo, ME)).toBe("self");
      expect(getSpeakerRelation({ ...speech, speakerUserId: 3 }, twoVsTwo, ME)).toBe("teammate");
      expect(getSpeakerRelation({ ...speech, speakerUserId: 2 }, twoVsTwo, ME)).toBe("opponent");
      expect(getSpeakerRelation({ ...speech, speakerUserId: 99 }, twoVsTwo, ME)).toBe("unknown");
    });

    it("getSpeakerRelation: without userId it falls back to side + name, and a null userId counts as absent", () => {
      expect(getSpeakerRelation({ side: "PRO", speakerName: MY_NAME }, twoVsTwo, ME)).toBe("self");
      expect(getSpeakerRelation({ side: PRO, speakerName: TEAMMATE, speakerUserId: null }, twoVsTwo, ME)).toBe(
        "teammate"
      );
      expect(getSpeakerRelation({ side: "Phản đối", speakerName: OPPONENT }, twoVsTwo, ME)).toBe("opponent");
    });
  });

  describe("a stage I did not speak in", () => {
    it("is not graded, is reported to the session evaluator, and shows 'Không phát biểu'", async () => {
      seedSession(2, twoVsTwo, fullTwoVsTwo([1, 3]));
      renderRoom();
      await submitOnceLoaded("Tôi vòng 1");

      expect(gradedStages()).toEqual(["opening", "closing"]);
      const sessionPayload = mockEvaluateDebateSession.mock.calls[0][0];
      expect(sessionPayload.skipped_stages).toEqual(["rebuttal"]);
      expect(sessionPayload.rounds.map((r: { stage: string }) => r.stage)).toEqual(["opening", "closing"]);
      expect(screen.getAllByText("Không phát biểu")).toHaveLength(1);
      expect(screen.getByText("Phản biện")).toBeInTheDocument();
    });

    it("sends no skipped_stages when I spoke in every stage", async () => {
      seedSession(2, oneVsOne, fullOneVsOne());
      renderRoom();
      await submitOnceLoaded("Tôi vòng 1");

      expect(mockEvaluateDebateSession.mock.calls[0][0]).not.toHaveProperty("skipped_stages");
      expect(screen.queryByText("Không phát biểu")).not.toBeInTheDocument();
    });

    it("if I never spoke, nothing is graded and all three stages show 'Không phát biểu'", async () => {
      seedSession(2, twoVsTwo, fullTwoVsTwo([]));
      renderRoom();
      await submitOnceLoaded("Đối thủ 1 vòng 1");

      expect(mockEvaluateDebateRound).not.toHaveBeenCalled();
      expect(mockEvaluateDebateSession).not.toHaveBeenCalled();
      expect(screen.getAllByText("Không phát biểu")).toHaveLength(3);
    });
  });

  describe("error handling", () => {
    const ambiguous: Participant[] = [
      { userId: ME, side: PRO, speakerName: MY_NAME },
      { userId: 3, side: PRO, speakerName: MY_NAME },
      { userId: 2, side: CON, speakerName: OPPONENT },
      { userId: 4, side: CON, speakerName: OPPONENT_2 },
    ];
    const ambiguousTranscript = () =>
      [1, 2, 3].flatMap((stage) => [
        arg(stage, PRO, MY_NAME, `Trùng tên A vòng ${stage}`),
        arg(stage, CON, OPPONENT, `Đối thủ 1 vòng ${stage}`),
        arg(stage, PRO, MY_NAME, `Trùng tên B vòng ${stage}`),
        arg(stage, CON, OPPONENT_2, `Đối thủ 2 vòng ${stage}`),
      ]);

    it("data error (speaker cannot be identified): clear message, no retry button, submit stays disabled", async () => {
      seedSession(2, ambiguous, ambiguousTranscript());
      renderRoom();
      await clickSubmitOnce("Trùng tên A vòng 1");

      expect(await screen.findByText(/không xác định được người nói/i)).toBeInTheDocument();
      expect(screen.queryByTestId("retry-finish-evaluation-btn")).not.toBeInTheDocument();
      expect(screen.getByTestId("header-submit-debate-btn")).toBeDisabled();
      expect(screen.getByTestId("submit-and-view-result-btn")).toBeDisabled();
      expect(screen.queryByTestId("result-page")).not.toBeInTheDocument();
      expect(mockEvaluateDebateRound).not.toHaveBeenCalled();
    });

    it("temporary error (account not loaded yet): offers a retry instead of blocking, which works once it loads", async () => {
      seedSession(2, oneVsOne, fullOneVsOne());
      mockAuthUser = null;
      const view = renderRoom();
      await clickSubmitOnce("Tôi vòng 1");

      const retry = await screen.findByTestId("retry-finish-evaluation-btn");
      expect(screen.queryByText(/Thử lại sẽ không khắc phục được/)).not.toBeInTheDocument();
      expect(mockEvaluateDebateRound).not.toHaveBeenCalled();

      mockAuthUser = SIGNED_IN_USER;
      view.rerender(
        <MemoryRouter initialEntries={["/debater/debate/123"]}>
          <Routes>
            <Route path="/debater/debate/:sessionId" element={<DebateRoom />} />
            <Route path="/debater/debate/:sessionId/result" element={<div data-testid="result-page" />} />
          </Routes>
        </MemoryRouter>
      );
      fireEvent.click(retry);
      await screen.findByTestId("result-page");

      expect(turnsOfStage("opening")?.[0]).toEqual({ speaker: "learner", text: "Tôi vòng 1" });
    });

    it("temporary error (session not loaded yet): offers a retry, which works once the session is back", async () => {
      seedSession(2, oneVsOne, fullOneVsOne());
      const local = (id: string, speaker: string, content: string) => ({
        id,
        speaker,
        speakerName: speaker,
        side: speaker === "AI" ? "Phản đối" : "Ủng hộ",
        stage: "Kết luận",
        roundNumber: 3,
        timestamp: "",
        content,
      });
      sessionStorage.setItem(
        "adpp_messages_123",
        JSON.stringify([local("a", "Debater", "Tôi đã lưu"), local("b", "AI", "Lưu của đối thủ")])
      );
      sessionStorage.setItem("adpp_debate_completed_123", "1");
      sessionStorage.setItem("adpp_current_round_123", "3");
      mockGetSessionDetails.mockRejectedValueOnce(new Error("mạng lỗi"));

      renderRoom();
      await clickSubmitOnce("Tôi đã lưu");

      const retry = await screen.findByTestId("retry-finish-evaluation-btn");
      expect(mockEvaluateDebateRound).not.toHaveBeenCalled();

      // The session arrives (this makes the room a P2P one, so the transcript replaces the stored speeches)
      await screen.findByText("Tôi vòng 1");
      fireEvent.click(retry);
      await screen.findByTestId("result-page");

      expect(turnsOfStage("opening")?.[1]).toEqual({ speaker: "opponent", text: "Đối thủ vòng 1" });
    });
  });

  describe("missing final turn", () => {
    const withoutLastTurn = () => fullOneVsOne().slice(0, 5);

    it("waits and re-reads: grades only after the last turn has arrived", async () => {
      seedSession(2, oneVsOne, withoutLastTurn());
      renderRoom();
      await clickSubmitOnce("Tôi vòng 1");

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
      });
      expect(mockEvaluateDebateRound).not.toHaveBeenCalled();

      currentTranscript = fullOneVsOne();
      await screen.findByTestId("result-page", undefined, { timeout: 4000 });

      expect(turnsOfStage("closing")).toEqual([
        { speaker: "learner", text: "Tôi vòng 3" },
        { speaker: "opponent", text: "Đối thủ vòng 3" },
      ]);
    });

    it("does not grade if the turn never arrives: offers a retry instead", async () => {
      seedSession(2, oneVsOne, withoutLastTurn());
      renderRoom();
      await clickSubmitOnce("Tôi vòng 1");

      const retry = await screen.findByTestId("retry-finish-evaluation-btn", undefined, { timeout: 4000 });
      expect(screen.getAllByText(/chưa đủ lượt/).length).toBeGreaterThan(0);
      expect(mockEvaluateDebateRound).not.toHaveBeenCalled();

      currentTranscript = fullOneVsOne();
      fireEvent.click(retry);
      await screen.findByTestId("result-page");
      expect(gradedStages()).toEqual(["opening", "rebuttal", "closing"]);
    });

    it("does not grade while the Backend still reports a current turn", async () => {
      seedSession(2, oneVsOne, fullOneVsOne(), { currentTurn: { turnId: 3 } });
      renderRoom();
      await clickSubmitOnce("Tôi vòng 1");

      await screen.findByTestId("retry-finish-evaluation-btn", undefined, { timeout: 4000 });
      expect(mockEvaluateDebateRound).not.toHaveBeenCalled();
    });
  });

  describe("reusing round results on retry", () => {
    it("reuses a round whose turns did not change", async () => {
      seedSession(2, oneVsOne, fullOneVsOne());
      mockEvaluateDebateSession.mockRejectedValueOnce(new Error("lỗi tổng hợp"));
      renderRoom();
      await clickSubmitOnce("Tôi vòng 1");

      fireEvent.click(await screen.findByTestId("retry-finish-evaluation-btn"));
      await screen.findByTestId("result-page");

      expect(mockEvaluateDebateRound).toHaveBeenCalledTimes(3);
      expect(mockEvaluateDebateSession).toHaveBeenCalledTimes(2);
    });

    it("re-grades only the round whose turns changed, and redoes the session summary", async () => {
      seedSession(2, oneVsOne, fullOneVsOne());
      mockEvaluateDebateSession.mockRejectedValueOnce(new Error("lỗi tổng hợp"));
      renderRoom();
      await clickSubmitOnce("Tôi vòng 1");
      const retry = await screen.findByTestId("retry-finish-evaluation-btn");
      expect(mockEvaluateDebateRound).toHaveBeenCalledTimes(3);

      currentTranscript = currentTranscript.map((a) =>
        a.content === "Đối thủ vòng 2" ? { ...a, content: "Đối thủ vòng 2 đã sửa" } : a
      );
      mockEvaluateDebateRound.mockClear();
      fireEvent.click(retry);
      await screen.findByTestId("result-page");

      expect(gradedStages()).toEqual(["rebuttal"]);
      expect(turnsOfStage("rebuttal")?.[1].text).toBe("Đối thủ vòng 2 đã sửa");
      expect(mockEvaluateDebateSession).toHaveBeenCalledTimes(2);
    });

    it("does not reuse the session summary when a retry happens after a round changed", async () => {
      seedSession(2, oneVsOne, fullOneVsOne());
      // The summary succeeds, but the result cannot be built: the next attempt starts from the caches.
      mockEvaluateDebateSession.mockResolvedValueOnce({ stage_breakdown: {}, progress_trend: "" });
      mockEvaluateDebateRound.mockImplementationOnce(async () => ({
        stage: "opening",
        round_score: null,
        criteria: [],
        strengths: [],
        weaknesses: [],
        suggestions: [],
      }));
      mockEvaluateDebateRound.mockImplementationOnce(async () => ({
        stage: "rebuttal",
        round_score: null,
        criteria: [],
        strengths: [],
        weaknesses: [],
        suggestions: [],
      }));
      mockEvaluateDebateRound.mockImplementationOnce(async () => ({
        stage: "closing",
        round_score: null,
        criteria: [],
        strengths: [],
        weaknesses: [],
        suggestions: [],
      }));
      renderRoom();
      await clickSubmitOnce("Tôi vòng 1");
      const retry = await screen.findByTestId("retry-finish-evaluation-btn");

      currentTranscript = currentTranscript.map((a) =>
        a.content === "Tôi vòng 3" ? { ...a, content: "Tôi vòng 3 đã sửa" } : a
      );
      fireEvent.click(retry);
      await screen.findByTestId("result-page");

      expect(mockEvaluateDebateSession).toHaveBeenCalledTimes(2);
    });
  });

  describe("the AI analysis button in the sidebar", () => {
    const requestAnalysis = async () => {
      fireEvent.click(await screen.findByLabelText("Gợi ý phản biện (AI Hints)"));
      fireEvent.click(await screen.findByText("AI Coaching"));
      fireEvent.click(await screen.findByText(/Yêu cầu phân tích AI/));
    };

    it("1v1: analyses my latest speech against the opponent's, even when the opponent spoke last", async () => {
      seedSession(2, oneVsOne, fullOneVsOne().slice(0, 4), { status: IN_PROGRESS, currentTurn: { turnId: 3 } });
      renderRoom();
      await screen.findByText("Đối thủ vòng 2");
      await requestAnalysis();

      await waitFor(() => expect(mockEvaluateSpeechArgument).toHaveBeenCalledTimes(1));
      expect(mockEvaluateSpeechArgument.mock.calls[0][0]).toMatchObject({
        side: "pro",
        stage: "rebuttal",
        argument_text: "Tôi vòng 2",
        opponent_argument_text: "Đối thủ vòng 2",
      });
    });

    it("2v2: a later speech by my teammate is neither mine nor the opponent's", async () => {
      seedSession(2, twoVsTwo, fullTwoVsTwo().slice(0, 3), { status: IN_PROGRESS, currentTurn: { turnId: 1 } });
      renderRoom();
      await screen.findByText("Đồng đội vòng 1");
      await requestAnalysis();

      await waitFor(() => expect(mockEvaluateSpeechArgument).toHaveBeenCalledTimes(1));
      expect(mockEvaluateSpeechArgument.mock.calls[0][0]).toMatchObject({
        argument_text: "Tôi vòng 1",
        opponent_argument_text: "Đối thủ 1 vòng 1",
      });
    });

    it("does nothing when only the opponent has spoken", async () => {
      seedSession(2, oneVsOne, [arg(1, CON, OPPONENT, "Đối thủ nói trước")], {
        status: IN_PROGRESS,
        currentTurn: { turnId: 1 },
      });
      renderRoom();
      await screen.findByText("Đối thủ nói trước");
      await requestAnalysis();

      expect(mockEvaluateSpeechArgument).not.toHaveBeenCalled();
    });

    it("AI session: analyses my latest speech against the AI's", async () => {
      seedSession(1, [
        { userId: ME, side: PRO, speakerName: MY_NAME },
        { userId: null, side: CON, speakerName: "AI Opponent", isAI: true },
      ], [], { status: IN_PROGRESS, currentTurn: { turnId: 2 } });
      sessionStorage.setItem(
        "adpp_messages_123",
        JSON.stringify([
          { id: "m", speaker: "Debater", speakerName: "Bạn", side: "Ủng hộ", stage: "Mở đầu", roundNumber: 1, timestamp: "", content: "Tôi vòng 1" },
          { id: "a", speaker: "AI", speakerName: "AI", side: "Phản đối", stage: "Mở đầu", roundNumber: 1, timestamp: "", content: "AI vòng 1" },
        ])
      );
      renderRoom();
      await screen.findByText("AI vòng 1");
      await requestAnalysis();

      await waitFor(() => expect(mockEvaluateSpeechArgument).toHaveBeenCalledTimes(1));
      expect(mockEvaluateSpeechArgument.mock.calls[0][0]).toMatchObject({
        argument_text: "Tôi vòng 1",
        opponent_argument_text: "AI vòng 1",
      });
    });
  });
});
