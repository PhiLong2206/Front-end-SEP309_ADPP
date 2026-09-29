export type CompetitionLifecycleStatus =
  | "Draft"
  | "OpenRegistration"
  | "RegistrationClosed"
  | "Ongoing"
  | "Completed"
  | "Cancelled";

export type CompetitionType = "INDIVIDUAL" | "TEAM";

export type RegistrationStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";
export type TeamStatus = "Active" | "Withdrawn";
export type TeamRequestType = "Invitation" | "JoinRequest";
export type TeamRequestStatus = "Pending" | "Accepted" | "Rejected" | "Cancelled";

export interface CompetitionListItem {
  competitionId: number;
  title: string;
  competitionType: CompetitionType;
  registrationStart: string;
  registrationEnd: string;
  startDate: string;
  status: CompetitionLifecycleStatus | string;
  isPublic: boolean;
}

export interface CompetitionDetail {
  competitionId: number;
  title: string;
  description?: string | null;
  createdBy: number;
  createdByName?: string;
  competitionType: CompetitionType;
  formatId?: number | null;
  formatName?: string | null;
  maxParticipants?: number | null;
  registrationStart: string;
  registrationEnd: string;
  startDate: string;
  endDate?: string | null;
  status: CompetitionLifecycleStatus | string;
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateCompetitionDto {
  title: string;
  description?: string;
  competitionType: CompetitionType;
  formatId?: number | null;
  maxParticipants?: number | null;
  registrationStart: string;
  registrationEnd: string;
  startDate: string;
  endDate?: string | null;
  isPublic?: boolean;
}

export interface PatchCompetitionDto {
  title?: string;
  description?: string;
  formatId?: number | null;
  maxParticipants?: number | null;
  registrationStart?: string;
  registrationEnd?: string;
  startDate?: string;
  endDate?: string | null;
  isPublic?: boolean;
}

export interface CompetitionQueryFilter {
  status?: string;
  competitionType?: string;
  isPublic?: boolean;
  keyword?: string;
}

export interface CompetitionRegistration {
  registrationId: number;
  competitionId: number;
  userId: number;
  userName: string;
  userEmail: string;
  status: RegistrationStatus | string;
  note?: string | null;
  registeredAt: string;
  reviewedBy?: number | null;
  reviewedByName?: string | null;
  reviewedAt?: string | null;
}

export interface CompetitionTeam {
  teamId: number;
  competitionId: number;
  teamName: string;
  captainUserId: number;
  status: TeamStatus | string;
  createdAt: string;
}

export interface CompetitionTeamMember {
  teamMemberId: number;
  userId: number;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  joinedAt: string;
}

export interface CompetitionTeamDetail extends CompetitionTeam {
  captainName: string;
  members: CompetitionTeamMember[];
}

export interface CompetitionTeamRequest {
  requestId: number;
  teamId: number;
  teamName: string;
  userId: number;
  userName: string;
  createdByUserId: number;
  createdByName: string;
  requestType: TeamRequestType | string;
  status: TeamRequestStatus | string;
  note?: string | null;
  createdAt: string;
  respondedAt?: string | null;
  respondedByUserId?: number | null;
  respondedByName?: string | null;
}

export interface CompetitionJudge {
  competitionJudgeId: number;
  competitionId: number;
  userId: number;
  fullName: string;
  email: string;
  assignedAt: string;
}

// Backward compatibility alias
export type Competition = CompetitionDetail;
