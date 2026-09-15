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
} from "../types";

const aiApi = {
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
};

export default aiApi;
