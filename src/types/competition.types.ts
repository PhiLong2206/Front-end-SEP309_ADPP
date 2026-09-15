import { PaginationParams } from "./api.types";

export type CompetitionStatus = "Draft" | "RegistrationOpen" | "Ongoing" | "Finished" | "Cancelled";
export type MatchStatus = "Pending" | "Ongoing" | "Finished";

export interface CompetitionTeam {
  id: string;
  name: string;
  competitionId: string;
  members: Array<{
    userId: string;
    fullName: string;
    email: string;
    roleInTeam: string;
  }>;
  totalScore: number;
  rank?: number;
}

export interface CompetitionMatch {
  id: string;
  competitionId: string;
  roundName: string; // e.g., "Quarter-Final", "Semi-Final", "Final"
  topicId: string;
  topicTitle: string;
  affirmativeTeamId: string;
  affirmativeTeamName: string;
  negativeTeamId: string;
  negativeTeamName: string;
  winnerTeamId?: string;
  status: MatchStatus;
  scheduledAt: string;
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  status: CompetitionStatus;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  organizerId: string;
  organizerName: string;
  maxTeams: number;
  registeredTeamsCount: number;
  entryFee: number;
  prizePool?: string;
  rules?: string;
  createdAt: string;
}

export interface CreateCompetitionDto {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  maxTeams: number;
  entryFee: number;
  prizePool?: string;
  rules?: string;
}

export interface CompetitionFilterParams extends PaginationParams {
  status?: CompetitionStatus;
}
