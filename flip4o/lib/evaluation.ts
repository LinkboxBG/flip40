import { DEFAULT_SCORES } from "./constants";
import type {
  CriteriaEvaluation,
  CriteriaScores,
  CriterionKey,
  CriterionScoreEntry,
  ScoreSource,
} from "./types";

const SCORE_KEYS = Object.keys(DEFAULT_SCORES) as CriterionKey[];

export function createDefaultEvaluation(): CriteriaEvaluation {
  return SCORE_KEYS.reduce((acc, key) => {
    acc[key] = { value: DEFAULT_SCORES[key], source: "manual" };
    return acc;
  }, {} as CriteriaEvaluation);
}

export function evaluationToScores(evaluation: CriteriaEvaluation): CriteriaScores {
  return SCORE_KEYS.reduce((acc, key) => {
    acc[key] = evaluation[key].value;
    return acc;
  }, {} as CriteriaScores);
}

export function setCriterionEntry(
  evaluation: CriteriaEvaluation,
  key: CriterionKey,
  entry: CriterionScoreEntry,
): CriteriaEvaluation {
  return { ...evaluation, [key]: entry };
}

export function normalizeEvaluation(
  evaluation: Partial<CriteriaEvaluation> | null | undefined,
  fallbackScores?: CriteriaScores,
): CriteriaEvaluation {
  const base = createDefaultEvaluation();

  for (const key of SCORE_KEYS) {
    const entry = evaluation?.[key];
    const fallbackValue = fallbackScores?.[key] ?? DEFAULT_SCORES[key];

    if (entry && typeof entry.value === "number" && !Number.isNaN(entry.value)) {
      base[key] = {
        value: Math.min(5, Math.max(1, Math.round(entry.value))),
        source: entry.source === "calculated" ? "calculated" : "manual",
      };
    } else if (typeof fallbackValue === "number") {
      base[key] = { value: fallbackValue, source: "manual" };
    }
  }

  return base;
}

export function sourceLabel(source: ScoreSource): string {
  return source === "calculated" ? "auto" : "manual";
}
