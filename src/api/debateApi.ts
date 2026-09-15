import axiosClient from "./axiosClient";
import {
  DebateSession,
  DebateTurn,
  CreateDebateSessionDto,
  SubmitTurnDto,
  ArgumentScore,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from "../types";

const debateApi = {
  // Debate Sessions
  createSession: (data: CreateDebateSessionDto): Promise<ApiResponse<DebateSession>> =>
    axiosClient.post("/debates/sessions", data),

  getSessionById: (id: string): Promise<ApiResponse<DebateSession>> =>
    axiosClient.get(`/debates/sessions/${id}`),

  getUserHistory: (params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<DebateSession>>> =>
    axiosClient.get("/debates/history", { params }),

  endSession: (id: string): Promise<ApiResponse<DebateSession>> =>
    axiosClient.post(`/debates/sessions/${id}/end`),

  // Turns and transcript
  submitTurn: (sessionId: string, turnData: SubmitTurnDto): Promise<ApiResponse<DebateTurn>> =>
    axiosClient.post(`/debates/sessions/${sessionId}/turns`, turnData),

  getTranscript: (sessionId: string): Promise<ApiResponse<DebateTurn[]>> =>
    axiosClient.get(`/debates/sessions/${sessionId}/transcript`),

  // Feedback and progress
  getSessionFeedback: (sessionId: string): Promise<ApiResponse<{ score: ArgumentScore; summary: string }>> =>
    axiosClient.get(`/debates/sessions/${sessionId}/feedback`),

  getProgressStats: (): Promise<ApiResponse<{ totalDebates: number; averageScore: number; scoreTrends: unknown[] }>> =>
    axiosClient.get("/debates/progress"),
};

export default debateApi;
