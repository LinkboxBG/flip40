import { COUNTER_ARGUMENTS_ENABLED, CRITERIA, DEFAULT_SCORES, VERDICT_LABELS } from "./constants";
import type { AnalysisResult, CriteriaScores, PenaltyRule } from "./types";

const SCORE_KEYS = Object.keys(DEFAULT_SCORES) as (keyof CriteriaScores)[];

export function sanitizeScores(
  scores: Partial<CriteriaScores> | null | undefined,
): CriteriaScores {
  const safe: CriteriaScores = { ...DEFAULT_SCORES };

  if (!scores || typeof scores !== "object") {
    return safe;
  }

  for (const key of SCORE_KEYS) {
    const value = scores[key];
    if (typeof value === "number" && !Number.isNaN(value)) {
      safe[key] = Math.min(5, Math.max(1, Math.round(value)));
    }
  }

  return safe;
}

interface PenaltyCheck {
  id: string;
  label: string;
  penalty: number;
  counterArgument: string;
  matches: (scores: CriteriaScores) => boolean;
}

const PENALTY_CHECKS: PenaltyCheck[] = [
  {
    id: "flip-moat-mismatch",
    label: "Flip / Moat Mismatch",
    penalty: 18,
    counterArgument:
      "High flip potential with a weak moat usually signals a commodity play — buyers discount exit value when differentiation is thin.",
    matches: (s) => s.flipPotential >= 4 && s.moat <= 2,
  },
  {
    id: "market-execution-gap",
    label: "Market / Execution Gap",
    penalty: 14,
    counterArgument:
      "A large market with weak execution often burns capital chasing TAM that never converts — scale amplifies operational gaps.",
    matches: (s) => s.marketSize >= 4 && s.execution <= 2,
  },
  {
    id: "capital-flip-illusion",
    label: "Capital / Flip Illusion",
    penalty: 16,
    counterArgument:
      "Capital-heavy flip theses rarely clear diligence — acquirers and lenders price in restructuring cost, not headline upside.",
    matches: (s) => s.flipPotential >= 4 && s.capitalEfficiency <= 2,
  },
  {
    id: "moat-market-paradox",
    label: "Moat / Market Paradox",
    penalty: 12,
    counterArgument:
      "A strong moat in a tiny market caps upside — defensibility without volume limits multiple expansion and buyer interest.",
    matches: (s) => s.moat >= 4 && s.marketSize <= 2,
  },
  {
    id: "execution-capital-stretch",
    label: "Execution / Capital Stretch",
    penalty: 13,
    counterArgument:
      "Low capital efficiency paired with weak execution compounds runway risk — each milestone costs more than the model assumes.",
    matches: (s) => s.execution <= 2 && s.capitalEfficiency <= 2,
  },
  {
    id: "uniform-inflation",
    label: "Score Uniformity Bias",
    penalty: 10,
    counterArgument:
      "Uniformly high scores often reflect optimism bias, not due diligence — real deals show trade-offs across dimensions.",
    matches: (s) => Object.values(s).every((v) => v >= 4),
  },
  {
    id: "flip-execution-blindspot",
    label: "Flip / Execution Blindspot",
    penalty: 15,
    counterArgument:
      "Aggressive flip timelines without execution depth create closing risk — deals stall when integration reality hits.",
    matches: (s) => s.flipPotential >= 5 && s.execution <= 3,
  },
];

function getVerdict(score: number): Pick<AnalysisResult, "verdict" | "verdictTone"> {
  let verdictTone: AnalysisResult["verdictTone"];
  if (score >= 80) verdictTone = "strong";
  else if (score >= 60) verdictTone = "conditional";
  else if (score >= 40) verdictTone = "weak";
  else verdictTone = "pass";

  return { verdict: VERDICT_LABELS[verdictTone], verdictTone };
}

function detectPenalties(scores: CriteriaScores): PenaltyRule[] {
  return PENALTY_CHECKS.filter((check) => check.matches(scores)).map(
    ({ id, label, penalty, counterArgument }) => ({
      id,
      label,
      penalty,
      counterArgument,
    }),
  );
}

export function analyzeScores(scores: CriteriaScores): AnalysisResult {
  const safeScores = sanitizeScores(scores);
  const values = Object.values(safeScores);
  const baseScore = Math.round(
    (values.reduce((sum, v) => sum + v, 0) / values.length) * 20,
  );

  const penalties = detectPenalties(safeScores);
  const totalPenalty = penalties.reduce((sum, p) => sum + p.penalty, 0);
  const finalScore = Math.max(0, Math.min(100, baseScore - totalPenalty));
  const { verdict, verdictTone } = getVerdict(finalScore);

  const counterArguments =
    COUNTER_ARGUMENTS_ENABLED && penalties.length > 0
      ? penalties.map((p) => p.counterArgument)
      : COUNTER_ARGUMENTS_ENABLED
        ? [
            "No structural red flags detected — still validate assumptions against live market comps and seller motivation.",
          ]
        : [];

  return {
    baseScore,
    totalPenalty,
    finalScore,
    verdict,
    verdictTone,
    penalties,
    counterArguments,
    developerModeActive: COUNTER_ARGUMENTS_ENABLED,
  };
}

export function scoresToRadarData(scores: CriteriaScores) {
  const safe = sanitizeScores(scores);
  return CRITERIA.map((criterion) => ({
    criterion: criterion.radarLabel,
    value: safe[criterion.key],
    fullMark: 5,
  }));
}
