export type DebateStage = "Opening" | "Rebuttal" | "Closing";
export type DebateSide = "Affirmative" | "Negative"; // For / Against
export type DebateMode = "AI_Opponent" | "Two_Learners";
export type AIDifficulty = "Easy" | "Medium" | "Hard";

export enum SystemDebateSide {
  PRO = 1,
  CON = 2,
  Affirmative = 1,
  Negative = 2,
}

export enum BackendDebateType {
  AiPractice = 1,
  P2pMatch = 2,
  Direct1v1 = 3,
}

export enum BackendDebateStage {
  Opening = 1,
  Rebuttal = 2,
  Closing = 3,
}

export enum BackendSessionStatus {
  Waiting = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
}

export enum BackendTurnStatus {
  Pending = 1,
  Active = 2,
  Completed = 3,
  Skipped = 4,
}

export enum BackendChallengeStatus {
  Pending = 1,
  Accepted = 2,
  Rejected = 3,
  Cancelled = 4,
  Expired = 5,
}

export interface ArgumentScore {
  logic: number; // 0-10
  evidence: number; // 0-10
  relevance: number; // 0-10
  structure: number; // 0-10
  persuasiveness: number; // 0-10
  overallScore: number; // 0-10
  explanation: string;
}

export interface DebateTurn {
  id: string;
  sessionId: string;
  speakerRole: "Learner" | "AI" | "OpponentLearner";
  speakerId?: string;
  stage: DebateStage;
  roundNumber: number;
  content: string;
  audioUrl?: string;
  durationSeconds?: number;
  score?: ArgumentScore;
  rebuttalSuggestions?: string[];
  createdAt: string;
}

export interface DebateSession {
  id: string;
  topicId: string;
  topicTitle: string;
  motion: string;
  learnerId: string;
  learnerName: string;
  mode: DebateMode;
  userSide: DebateSide;
  aiDifficulty: AIDifficulty;
  currentStage: DebateStage;
  currentRound: number;
  isCompleted: boolean;
  finalScore?: number;
  finalFeedback?: string;
  turns: DebateTurn[];
  startedAt: string;
  completedAt?: string;
}

export interface CreateDebateSessionDto {
  topicId: string;
  mode: DebateMode;
  userSide: DebateSide;
  aiDifficulty: AIDifficulty;
}

export interface SubmitTurnDto {
  stage: DebateStage;
  roundNumber: number;
  content: string;
  durationSeconds?: number;
}

// ── Backend DTOs ──────────────────────────────────────────
export interface CreateAiPracticeSessionRequest {
  title: string;
  topic: string;
  userSide: SystemDebateSide | number;
  isAI?: boolean;
  difficulty?: string;
  turnTimeLimitSeconds?: number;
}

export interface CreateP2pSessionRequest {
  title: string;
  topic: string;
  userSide: SystemDebateSide | number;
  isAI?: boolean;
  turnTimeLimitSeconds?: number;
}

export interface JoinSessionRequest {
  preferredSide?: SystemDebateSide | number;
}

export interface SubmitArgumentRequest {
  content: string;
}

export interface ParticipantDto {
  participantId: number;
  userId?: number;
  speakerName: string;
  isAI: boolean;
  side: SystemDebateSide | number;
  joinedAt: string;
}

export interface TurnDto {
  turnId: number;
  stage: BackendDebateStage | number;
  side: SystemDebateSide | number;
  turnOrder: number;
  timeLimitSeconds: number;
  status: BackendTurnStatus | number;
  startedAt?: string;
}

export interface DebateSessionResponse {
  sessionId: number;
  title: string;
  topic: string;
  debateType: BackendDebateType | number;
  difficulty?: string;
  currentStage: BackendDebateStage | number;
  currentTurnSide: SystemDebateSide | number;
  status: BackendSessionStatus | number;
  createdByUserId: number;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  participants: ParticipantDto[];
  currentTurn?: TurnDto;
}

export interface ArgumentDetailDto {
  argumentId: number;
  turnOrder: number;
  stage: BackendDebateStage | number;
  side: SystemDebateSide | number;
  speakerName: string;
  isAI: boolean;
  content: string;
  submittedAt: string;
}

export interface DebateTranscriptResponse {
  sessionId: number;
  title: string;
  topic: string;
  status: BackendSessionStatus | number;
  arguments: ArgumentDetailDto[];
}

export interface DebateHistoryItemDto {
  sessionId: number;
  title: string;
  topic: string;
  debateType: BackendDebateType | number;
  status: BackendSessionStatus | number;
  userSide: SystemDebateSide | number;
  createdAt: string;
  endedAt?: string;
}

// ── Debate Challenge DTOs ──────────────────────────────────
export interface CreateChallengeRequest {
  challengedUserId: number;
  topic: string;
  challengerPreferredSide: SystemDebateSide | number;
  turnTimeLimitSeconds?: number;
  expiresAt?: string;
}

export interface ChallengeUserSummaryDto {
  userId: number;
  fullName: string;
  email: string;
}

export interface ChallengeResponse {
  challengeId: number;
  challenger: ChallengeUserSummaryDto;
  challenged: ChallengeUserSummaryDto;
  topic: string;
  challengerPreferredSide: SystemDebateSide | number;
  turnTimeLimitSeconds: number;
  status: BackendChallengeStatus | number;
  debateSessionId?: number;
  createdAt: string;
  respondedAt?: string;
  expiresAt?: string;
}
