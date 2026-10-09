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

// ── AI Microservices Integration (ai-opponent-service & ai-evaluator-service) ──

export type OpponentSide = "pro" | "con" | "AFFIRMATIVE" | "NEGATIVE";
export type BackendDebateSide = "pro" | "con";
export type OpponentDifficulty = "easy" | "medium" | "hard" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type BackendDifficulty = "easy" | "medium" | "hard";
export type DebateRoundType = "opening" | "rebuttal" | "closing";

export type TurnMode = "opening_first" | "opening_reply" | "rebuttal" | "closing";
export type SessionStatus = "created" | "planning" | "ready" | "failed";

export interface AIHealthResponse {
  status: string;
  llm_provider: string;
}

export interface CreateOpponentSessionRequest {
  external_session_id: string;
  motion: string;
  learner_side: BackendDebateSide;
  ai_side: BackendDebateSide;
  difficulty?: BackendDifficulty;
  language?: "vi";
}

export interface CreateOpponentSessionResponse {
  opponent_session_id: string;
  status: SessionStatus | string;
}

export interface SessionResponse {
  id: string;
  external_session_id: string;
  motion: string;
  ai_side: BackendDebateSide;
  learner_side: BackendDebateSide;
  difficulty: BackendDifficulty;
  language: string;
  status: SessionStatus;
  created_at: string;
  updated_at: string;
  case_file?: CaseFileResponse | null;
}

export interface LearnerSpeechInput {
  turn_index: number;
  round_type: DebateRoundType;
  text: string;
}

export interface CreateTurnRequest {
  turn_index: number;
  new_learner_speeches?: LearnerSpeechInput[];
}

export interface TurnResponse {
  turn_index: number;
  round_type: DebateRoundType | string;
  mode: TurnMode | string;
  speech_text: string;
}

export interface CasePlanDefinition {
  term: string;
  meaning: string;
}

export interface CasePlanArgument {
  id: string;
  title: string;
  claim: string;
  reasoning: string;
  example: string;
  impact: string;
}

export interface CasePlanAnticipated {
  id: string;
  learner_claim: string;
  planned_response: string;
}

export interface CaseFileContent {
  motion_reading: string;
  definitions: CasePlanDefinition[];
  arguments: CasePlanArgument[];
  anticipated_opponent_arguments: CasePlanAnticipated[];
  weighing: string;
}

export interface CaseFileResponse {
  id: string;
  session_id: string;
  content: CaseFileContent;
  prompt_version: string;
  llm_provider: string;
  llm_model: string;
  temperature: number;
  created_at: string;
}

export interface ArgumentEvaluationPayload {
  motion: string;
  side: BackendDebateSide;
  stage?: DebateRoundType;
  argument_text: string;
  opponent_argument_text?: string | null;
}

export type TurnSpeaker = "learner" | "opponent";

export interface ArgumentTurn {
  speaker: TurnSpeaker;
  text: string;
}

export interface RubricCriterionScore {
  name: string;
  score: number;
  reasoning: string;
}

export type CriterionScore = RubricCriterionScore;

export interface ArgumentEvaluationResult {
  overall_score: number;
  overall_reasoning: string;
  criteria: RubricCriterionScore[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  raw_model_output?: string | null;
}

export interface RoundEvaluationRequest {
  motion: string;
  side: BackendDebateSide;
  stage: DebateRoundType;
  turns: ArgumentTurn[];
}

export interface RoundEvaluationResult {
  stage: DebateRoundType;
  round_score: number;
  criteria: RubricCriterionScore[];
  consistency_note: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  raw_model_output?: string | null;
}

export interface SessionEvaluationRequest {
  motion: string;
  side: BackendDebateSide;
  rounds: RoundEvaluationResult[];
}

export interface SessionEvaluationResult {
  overall_score: number;
  stage_breakdown: Record<string, number>;
  progress_trend: string;
  overall_strengths?: string[];
  overall_weaknesses?: string[];
  overall_suggestions?: string[];
  raw_model_output?: string | null;
}


