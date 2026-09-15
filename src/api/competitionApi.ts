import axiosClient from "./axiosClient";
import {
  Competition,
  CompetitionTeam,
  CompetitionMatch,
  CreateCompetitionDto,
  CompetitionFilterParams,
  ApiResponse,
  PaginatedResponse,
} from "../types";

const competitionApi = {
  // Public & Learner
  getAllCompetitions: (
    params?: CompetitionFilterParams
  ): Promise<ApiResponse<PaginatedResponse<Competition>>> =>
    axiosClient.get("/competitions", { params }),

  getCompetitionById: (id: string): Promise<ApiResponse<Competition>> =>
    axiosClient.get(`/competitions/${id}`),

  registerTeam: (
    competitionId: string,
    data: { teamName: string; memberEmails: string[] }
  ): Promise<ApiResponse<CompetitionTeam>> =>
    axiosClient.post(`/competitions/${competitionId}/register`, data),

  getLeaderboard: (competitionId: string): Promise<ApiResponse<CompetitionTeam[]>> =>
    axiosClient.get(`/competitions/${competitionId}/leaderboard`),

  getBrackets: (competitionId: string): Promise<ApiResponse<CompetitionMatch[]>> =>
    axiosClient.get(`/competitions/${competitionId}/brackets`),

  // Educator & Admin Management
  createCompetition: (data: CreateCompetitionDto): Promise<ApiResponse<Competition>> =>
    axiosClient.post("/competitions", data),

  updateCompetition: (
    id: string,
    data: Partial<CreateCompetitionDto>
  ): Promise<ApiResponse<Competition>> => axiosClient.put(`/competitions/${id}`, data),

  deleteCompetition: (id: string): Promise<ApiResponse<void>> =>
    axiosClient.delete(`/competitions/${id}`),

  manageRounds: (
    competitionId: string,
    data: { matchId: string; winnerTeamId: string }
  ): Promise<ApiResponse<void>> =>
    axiosClient.post(`/competitions/${competitionId}/rounds`, data),
};

export default competitionApi;
