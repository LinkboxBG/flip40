import type { CriterionKey } from "./types";

export function calculateStressScore(answers: number[]): number {
  if (answers.length === 0) return 3;

  const valid = answers.filter(
    (value) => typeof value === "number" && !Number.isNaN(value),
  );

  if (valid.length === 0) return 3;

  const average = valid.reduce((sum, value) => sum + value, 0) / valid.length;
  return Math.min(5, Math.max(1, Math.round(average)));
}

export function isStressTestComplete(
  answers: number[] | undefined,
  requiredCount: number,
): boolean {
  if (!answers || answers.length < requiredCount) return false;
  return answers
    .slice(0, requiredCount)
    .every((value) => value >= 1 && value <= 5);
}

export type StressTestAnswers = Partial<Record<CriterionKey, number[]>>;
