"use client";

import { useState } from "react";
import { AlertTriangle, BarChart3, Brain, Download, ShieldAlert } from "lucide-react";
import type { AnalysisResult, CriteriaEvaluation, CriteriaScores } from "@/lib/types";
import { MotionCard } from "./MotionCard";

interface VerdictCardProps {
  result: AnalysisResult | null;
  ideaName: string;
  scores: CriteriaScores;
  evaluation: CriteriaEvaluation;
}

const toneBadge = {
  strong: "badge--lime",
  conditional: "badge--warning",
  weak: "badge--warning",
  pass: "badge--error",
} as const;

const toneText = {
  strong: "text-accent glow-text-lime",
  conditional: "text-warning",
  weak: "text-warning",
  pass: "text-error",
} as const;

export function VerdictCard({ result, ideaName, scores, evaluation }: VerdictCardProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadReport = async () => {
    if (!result) return;

    setIsExporting(true);
    try {
      const { generateReportPdf } = await import("@/lib/generateReportPdf");
      await generateReportPdf({ ideaName, scores, evaluation, result });
    } catch {
      /* PDF export failed silently — user can retry */
    } finally {
      setIsExporting(false);
    }
  };

  if (!result) {
    return (
      <MotionCard
        id="verdict-panel"
        className="flex min-h-[180px] scroll-mt-24 items-center justify-center gap-3"
      >
        <BarChart3 className="h-5 w-5 shrink-0 text-ds-secondary" />
        <p className="font-body text-body-md text-ds-secondary">
          Adjust criteria and run evaluation to see your final verdict.
        </p>
      </MotionCard>
    );
  }

  const badgeClass = toneBadge[result.verdictTone];
  const textClass = toneText[result.verdictTone];

  return (
    <MotionCard
      id="verdict-panel"
      highlight={result.finalScore >= 60}
      className="verdict-panel scroll-mt-24 space-y-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="stat-label">Verdict</p>
          <p
            className={`verdict-headline font-display mt-3 font-black uppercase tracking-tight ${textClass}`}
          >
            {result.verdict}
          </p>
        </div>
        <span className={`badge ${badgeClass} shrink-0 font-mono text-ui-md tabular-nums`}>
          {result.finalScore}/100
        </span>
      </div>

      {result.totalPenalty > 0 && (
        <div className="block-penalty flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-error" />
          <div>
            <p className="font-ui text-ui-md font-bold uppercase text-error">
              Penalty Applied: −{result.totalPenalty} pts
            </p>
            <ul className="mt-2 space-y-1.5">
              {result.penalties.map((p) => (
                <li key={p.id} className="font-body text-body-sm text-ds-secondary">
                  {p.label} (−{p.penalty})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {result.developerModeActive && result.counterArguments.length > 0 && (
        <div className="block-violet">
          <div className="mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4 text-accent-violet" />
            <span className="badge badge--violet">Stress Counter-Arguments</span>
          </div>
          <ul className="space-y-3">
            {result.counterArguments.map((arg, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 font-body text-body-sm leading-relaxed text-ds-secondary"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent-violet" />
                {arg}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-border-subtle pt-4">
        <button
          type="button"
          onClick={handleDownloadReport}
          disabled={isExporting}
          aria-busy={isExporting}
          aria-label={isExporting ? "Generating PDF report" : "Download PDF report"}
          className="btn-subtle btn-sm inline-flex items-center gap-2"
        >
          <Download className="h-3.5 w-3.5 opacity-60" aria-hidden />
          {isExporting ? "Generating…" : "Download Report"}
        </button>
      </div>
    </MotionCard>
  );
}
