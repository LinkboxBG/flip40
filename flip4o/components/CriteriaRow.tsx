"use client";

import type { CriterionDefinition, CriterionScoreEntry } from "@/lib/types";
import { sourceLabel } from "@/lib/evaluation";
import { MotionCard } from "./MotionCard";

interface CriteriaRowProps {
  criterion: CriterionDefinition;
  entry: CriterionScoreEntry;
  onManualChange: (value: number) => void;
  onStressTestOpen: () => void;
}

export function CriteriaRow({
  criterion,
  entry,
  onManualChange,
  onStressTestOpen,
}: CriteriaRowProps) {
  const sourceBadge =
    entry.source === "calculated" ? "badge--violet" : "badge--lime";
  const provenance = sourceLabel(entry.source);

  return (
    <MotionCard lift={false} className="criteria-row min-w-0 overflow-hidden">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-ui text-ui-md font-semibold uppercase tracking-tight text-text-primary">
            {criterion.label}
          </p>
          <p className="criterion-desc font-body mt-2 text-body-sm">
            {criterion.description}
          </p>
        </div>
        <span className="badge badge--lime shrink-0 text-base tabular-nums">
          {entry.value}
        </span>
      </div>

      <div className="criteria-control-grid">
        <span
          className={`badge ${sourceBadge} shrink-0 text-[10px] tracking-wider`}
        >
          [{provenance}]
        </span>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={entry.value}
          onChange={(e) => onManualChange(Number(e.target.value))}
          className="criteria-slider min-w-0 max-w-full"
          aria-label={`${criterion.label}: ${entry.value} of 5`}
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={entry.value}
        />
        <button
          type="button"
          onClick={onStressTestOpen}
          className="badge badge--violet badge--interactive shrink-0 text-[10px] tracking-wider"
          aria-label={`Auto-evaluate for ${criterion.label}`}
          title="Auto-evaluate"
        >
          [auto]
        </button>
      </div>

      <div className="criteria-slider-ticks mt-2" aria-hidden>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={entry.value === n ? "tick-dot tick-dot--active" : "tick-dot"}
          />
        ))}
      </div>
    </MotionCard>
  );
}
