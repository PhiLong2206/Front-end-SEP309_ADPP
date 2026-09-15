export const ROLES = {
  LEARNER: "Learner",
  EDUCATOR: "Educator",
  ADMIN: "Administrator",
} as const;

export type SystemRole = (typeof ROLES)[keyof typeof ROLES];

export const STORAGE_KEYS = {
  TOKEN: "adpp_token",
  USER: "adpp_user",
  REFRESH_TOKEN: "adpp_refresh_token",
} as const;

export const DEBATE_STAGES = {
  OPENING: "Opening",
  REBUTTAL: "Rebuttal",
  CLOSING: "Closing",
} as const;

export const AI_DIFFICULTY = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
} as const;
