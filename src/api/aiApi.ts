import axiosClient from "./axiosClient";
import {
  AIOpponentRequest,
  AIOpponentResponse,
  AIEvaluationRequest,
  AIEvaluationResponse,
  AIRebuttalRequest,
  AIRebuttalResponse,
  AIJudgeResult,
  ApiResponse,
  CreateOpponentSessionRequest,
  CreateOpponentSessionResponse,
  CreateTurnRequest,
  TurnResponse,
  CaseFileResponse,
  ArgumentEvaluationPayload,
  ArgumentEvaluationResult,
} from "../types";

const aiApi = {
  // ── Existing Debate Practice AI ──────────────────────────────
  // Generate opponent argument
  generateOpponentArgument: (
    data: AIOpponentRequest
  ): Promise<ApiResponse<AIOpponentResponse>> =>
    axiosClient.post("/ai/debate/opponent-response", data),

  // Argument evaluation & scoring (logic, evidence, relevance, structure, persuasiveness)
  evaluateArgument: (
    data: AIEvaluationRequest
  ): Promise<ApiResponse<AIEvaluationResponse>> =>
    axiosClient.post("/ai/debate/evaluate-argument", data),

  // Rebuttal suggestions
  getRebuttalSuggestions: (
    data: AIRebuttalRequest
  ): Promise<ApiResponse<AIRebuttalResponse>> =>
    axiosClient.post("/ai/debate/rebuttal-suggestions", data),

  // Judge complete session
  judgeSession: (sessionId: string): Promise<ApiResponse<AIJudgeResult>> =>
    axiosClient.post(`/ai/debate/judge/${sessionId}`),

  // In-depth score explanation
  getScoreExplanation: (data: { criteria: string; score: number; argumentText: string }): Promise<ApiResponse<{ explanation: string }>> =>
    axiosClient.post("/ai/debate/score-explanation", data),

  // ── AI Opponent Microservice (/api/opponent/*) ───────────────
  createOpponentSession: (
    data: CreateOpponentSessionRequest
  ): Promise<CreateOpponentSessionResponse> =>
    axiosClient.post("/opponent/sessions", data),

  getOpponentSession: (externalSessionId: string): Promise<object> =>
    axiosClient.get(`/opponent/sessions/${externalSessionId}`),

  getOpponentCasePlan: (externalSessionId: string): Promise<CaseFileResponse> =>
    axiosClient.get(`/opponent/sessions/${externalSessionId}/case-plan`),

  generateOpponentTurn: (
    externalSessionId: string,
    data: CreateTurnRequest
  ): Promise<TurnResponse> =>
    axiosClient.post(`/opponent/sessions/${externalSessionId}/turns`, data),

  // ── AI Evaluator Microservice (/api/evaluate/*) ──────────────
  evaluateSpeechArgument: (
    data: ArgumentEvaluationPayload
  ): Promise<ArgumentEvaluationResult> =>
    axiosClient.post("/evaluate", data),

  evaluateDebateRound: (data: object): Promise<object> =>
    axiosClient.post("/evaluate/round", data),

  evaluateDebateSession: (data: object): Promise<object> =>
    axiosClient.post("/evaluate/session", data),
};

export default aiApi;
