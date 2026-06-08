"use client";

import { useState } from "react";
import { CRITERIA } from "@/lib/constants";
import type { CriteriaEvaluation, CriterionKey } from "@/lib/types";
import { CriteriaRow } from "./CriteriaRow";

interface CriteriaFormProps {
  ideaName: string;
  evaluation: CriteriaEvaluation;
  onNameChange: (name: string) => void;
  onManualScoreChange: (key: CriterionKey, value: number) => void;
  onStressTestOpen: (key: CriterionKey) => void;
  onAnalyze: () => void;
  onSave: () => void;
  hasResult: boolean;
}

export function CriteriaForm({
  ideaName,
  evaluation,
  onNameChange,
  onManualScoreChange,
  onStressTestOpen,
  onAnalyze,
  onSave,
  hasResult,
}: CriteriaFormProps) {
  const [pulseAnalyze, setPulseAnalyze] = useState(false);

  const handleAnalyze = () => {
    onAnalyze();
    setPulseAnalyze(true);
    setTimeout(() => setPulseAnalyze(false), 400);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-8">
        <p className="section-number text-text-primary">01 — e-business idea evaluation</p>
        <p className="font-body mt-4 text-body-sm text-ds-secondary md:text-body-md">
          Slide for MANUAL input. Click [AUTO] for calculated input.
        </p>
      </div>

      <label className="hero-title-field mb-6 block">
        <span className="sr-only">Idea / Asset Name</span>
        <input
          type="text"
          value={ideaName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Name your asset…"
          className="input-hero"
        />
      </label>

      <div className="criteria-scroll scrollbar-thin flex-1 space-y-5 overflow-y-auto pr-1">
        {CRITERIA.map((criterion) => (
          <CriteriaRow
            key={criterion.key}
            criterion={criterion}
            entry={evaluation[criterion.key]}
            onManualChange={(value) => onManualScoreChange(criterion.key, value)}
            onStressTestOpen={() => onStressTestOpen(criterion.key)}
          />
        ))}
      </div>

      <div className="mt-8 flex w-full gap-3">
        <button
          type="button"
          onClick={handleAnalyze}
          className={`btn-chamfer btn-primary-soft btn-md flex-1 ${pulseAnalyze ? "pulse-glow" : ""}`}
        >
          Evaluate Asset
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!hasResult || !ideaName.trim()}
          className="btn-ghost btn-md px-5"
        >
          Save
        </button>
      </div>
    </div>
  );
}
