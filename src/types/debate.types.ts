export type DebateStage = "Opening" | "Rebuttal" | "Closing";
export type DebateSide = "Affirmative" | "Negative"; // For / Against
export type DebateMode = "AI_Opponent" | "Two_Learners";
export type AIDifficulty = "Easy" | "Medium" | "Hard";

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
