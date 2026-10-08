import axiosClient from "./axiosClient";
import {
  ApiResponse,
  DebateSession,
  DebateTurn,
  CreateDebateSessionDto,
  SubmitTurnDto,
  ArgumentScore,
  CreateAiPracticeSessionRequest,
  CreateP2pSessionRequest,
  JoinSessionRequest,
  SubmitArgumentRequest,
  DebateSessionResponse,
  DebateTranscriptResponse,
  DebateHistoryItemDto,
  CreateChallengeRequest,
  ChallengeResponse,
} from "../types";

const debateApi = {
  // ── Debate Practice & P2P Endpoints (SystemService) ────────
  /**
   * POST /api/Debate/ai-practice [Authorized]
   * Starts a new AI debate practice session.
   */
  createAiPracticeSession: (
    data: CreateAiPracticeSessionRequest
  ): Promise<ApiResponse<DebateSessionResponse>> =>
    axiosClient.post("/debate/ai-practice", data),

  /**
   * POST /api/Debate/p2p [Authorized]
   * Initiates a peer-to-peer debate match.
   */
  createP2pSession: (
    data: CreateP2pSessionRequest
  ): Promise<ApiResponse<DebateSessionResponse>> =>
    axiosClient.post("/debate/p2p", data),

  /**
   * POST /api/Debate/{sessionId}/join [Authorized]
   * Joins an existing P2P debate session.
   */
  joinP2pSession: (
    sessionId: number | string,
    data: JoinSessionRequest = {}
  ): Promise<ApiResponse<DebateSessionResponse>> =>
    axiosClient.post(`/debate/${sessionId}/join`, data),

  /**
   * GET /api/Debate/{sessionId} [Authorized]
   * Retrieves debate session details, participants and turns.
   */
  getSessionDetails: (
    sessionId: number | string
  ): Promise<ApiResponse<DebateSessionResponse>> =>
    axiosClient.get(`/debate/${sessionId}`),

  // Alias for getSessionDetails
  getSessionById: (
    id: number | string
  ): Promise<ApiResponse<DebateSessionResponse>> =>
    axiosClient.get(`/debate/${id}`),

  /**
   * POST /api/Debate/{sessionId}/arguments [Authorized]
   * Submits an argument for the current user's turn.
   */
  submitArgument: (
    sessionId: number | string,
    data: SubmitArgumentRequest
  ): Promise<ApiResponse<DebateSessionResponse>> =>
    axiosClient.post(`/debate/${sessionId}/arguments`, data),

  /**
   * GET /api/Debate/{sessionId}/transcript [Authorized]
   * Retrieves the full transcript of arguments for a debate session.
   */
  getTranscript: (
    sessionId: number | string
  ): Promise<ApiResponse<DebateTranscriptResponse>> =>
    axiosClient.get(`/debate/${sessionId}/transcript`),

  /**
   * GET /api/Debate/my-history [Authorized]
   * Retrieves the current user's debate history.
   */
  getUserHistory: (): Promise<ApiResponse<DebateHistoryItemDto[]>> =>
    axiosClient.get("/debate/my-history"),

  getMyHistory: (): Promise<ApiResponse<DebateHistoryItemDto[]>> =>
    axiosClient.get("/debate/my-history"),

  // ── 1v1 Debate Challenges (SystemService) ───────────────────
  /**
   * POST /api/debate/challenges [Authorized]
   * Sends a 1v1 challenge to another user.
   */
  createChallenge: (
    data: CreateChallengeRequest
  ): Promise<ApiResponse<ChallengeResponse>> =>
    axiosClient.post("/debate/challenges", data),

  /**
   * GET /api/debate/challenges/received [Authorized]
   * Retrieves incoming debate challenges received by the current user.
   */
  getReceivedChallenges: (): Promise<ApiResponse<ChallengeResponse[]>> =>
    axiosClient.get("/debate/challenges/received"),

  /**
   * GET /api/debate/challenges/sent [Authorized]
   * Retrieves outgoing debate challenges sent by the current user.
   */
  getSentChallenges: (): Promise<ApiResponse<ChallengeResponse[]>> =>
    axiosClient.get("/debate/challenges/sent"),

  /**
   * GET /api/debate/challenges/{challengeId} [Authorized]
   * Retrieves details of a specific debate challenge.
   */
  getChallengeById: (
    challengeId: number | string
  ): Promise<ApiResponse<ChallengeResponse>> =>
    axiosClient.get(`/debate/challenges/${challengeId}`),

  /**
   * POST /api/debate/challenges/{challengeId}/accept [Authorized]
   * Accepts an incoming debate challenge, creating a debate session.
   */
  acceptChallenge: (
    challengeId: number | string
  ): Promise<ApiResponse<ChallengeResponse>> =>
    axiosClient.post(`/debate/challenges/${challengeId}/accept`),

  /**
   * POST /api/debate/challenges/{challengeId}/reject [Authorized]
   * Rejects an incoming debate challenge.
   */
  rejectChallenge: (
    challengeId: number | string
  ): Promise<ApiResponse<ChallengeResponse>> =>
    axiosClient.post(`/debate/challenges/${challengeId}/reject`),

  /**
   * POST /api/debate/challenges/{challengeId}/cancel [Authorized]
   * Cancels a pending challenge created by the current user.
   */
  cancelChallenge: (
    challengeId: number | string
  ): Promise<ApiResponse<ChallengeResponse>> =>
    axiosClient.post(`/debate/challenges/${challengeId}/cancel`),

  // ── Backward Compatibility Helpers ──────────────────────────
  createSession: (data: CreateDebateSessionDto): Promise<ApiResponse<DebateSession>> =>
    axiosClient.post("/debate/ai-practice", data),

  endSession: (id: string): Promise<ApiResponse<DebateSession>> =>
    axiosClient.post(`/debate/${id}/end`),

  submitTurn: (sessionId: string, turnData: SubmitTurnDto): Promise<ApiResponse<DebateTurn>> =>
    axiosClient.post(`/debate/${sessionId}/arguments`, { content: turnData.content }),

  getSessionFeedback: (sessionId: string): Promise<ApiResponse<{ score: ArgumentScore; summary: string }>> =>
    axiosClient.get(`/debate/${sessionId}/feedback`),

  getProgressStats: (): Promise<ApiResponse<{ totalDebates: number; averageScore: number; scoreTrends: unknown[] }>> =>
    axiosClient.get("/debate/progress"),
};

export default debateApi;

