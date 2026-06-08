export type CriterionKey =
  | "flipPotential"
  | "moat"
  | "marketSize"
  | "execution"
  | "capitalEfficiency";

export type ScoreSource = "manual" | "calculated";

export interface CriterionDefinition {
  key: CriterionKey;
  label: string;
  radarLabel: string;
  description: string;
}

export interface CriterionScoreEntry {
  value: number;
  source: ScoreSource;
}

export type CriteriaEvaluation = Record<CriterionKey, CriterionScoreEntry>;

export type CriteriaScores = Record<CriterionKey, number>;

export interface PenaltyRule {
  id: string;
  label: string;
  penalty: number;
  counterArgument: string;
}

export interface AnalysisResult {
  baseScore: number;
  totalPenalty: number;
  finalScore: number;
  verdict: string;
  verdictTone: "strong" | "conditional" | "weak" | "pass";
  penalties: PenaltyRule[];
  counterArguments: string[];
  developerModeActive: boolean;
}

export interface SavedIdea {
  id: string;
  name: string;
  scores: CriteriaScores;
  evaluation: CriteriaEvaluation;
  result: AnalysisResult;
  timestamp: string;
}

export interface CriterionQuestion {
  id: string;
  question: string;
}
