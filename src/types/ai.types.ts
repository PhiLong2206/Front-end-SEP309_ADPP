import { DebateStage, DebateSide, AIDifficulty, ArgumentScore } from "./debate.types";

export interface AIOpponentRequest {
  topicMotion: string;
  stage: DebateStage;
  roundNumber: number;
  aiSide: DebateSide;
  difficulty: AIDifficulty;
  previousTranscript: Array<{
    speaker: string;
    text: string;
  }>;
}

export interface AIOpponentResponse {
  argument: string;
  speechAudioUrl?: string;
  thinkingProcess?: string;
}

export interface AIEvaluationRequest {
  topicMotion: string;
  stage: DebateStage;
  side: DebateSide;
  argumentText: string;
  contextTranscript?: string[];
}

export interface AIEvaluationResponse {
  score: ArgumentScore;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface AIRebuttalRequest {
  topicMotion: string;
  opponentArgument: string;
  userSide: DebateSide;
  stage: DebateStage;
}

export interface AIRebuttalResponse {
  suggestedPoints: string[];
  counterArguments: string[];
  fallaciesIdentified?: string[];
}

export interface AIJudgeResult {
  winner: "Affirmative" | "Negative" | "Tie";
  affirmativeScore: number;
  negativeScore: number;
  detailedAnalysis: string;
  feedbackForAffirmative: string;
  feedbackForNegative: string;
}
