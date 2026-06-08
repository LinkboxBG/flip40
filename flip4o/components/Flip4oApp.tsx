"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { safeGetLocalStorageItem, safeSetLocalStorageItem } from "@/lib/browser";
import { CRITERIA, HOW_IT_WORKS_SEEN_KEY, IDEAS_CHANGED_EVENT } from "@/lib/constants";
import {
  createDefaultEvaluation,
  evaluationToScores,
  normalizeEvaluation,
  setCriterionEntry,
} from "@/lib/evaluation";
import { analyzeScores } from "@/lib/engine";
import { deleteIdea, loadIdeas, saveIdea } from "@/lib/storage";
import type { StressTestAnswers } from "@/lib/stressTest";
import type {
  AnalysisResult,
  CriteriaEvaluation,
  CriterionKey,
  SavedIdea,
} from "@/lib/types";
import { AppFooter } from "./AppFooter";
import { AppNav } from "./AppNav";
import { AppShell } from "./AppShell";
import { MatrixRainBackground } from "./MatrixRainBackground";
const CriteriaPopup = dynamic(() =>
  import("./CriteriaPopup").then((m) => m.CriteriaPopup),
);
const HowItWorksModal = dynamic(() =>
  import("./HowItWorksModal").then((m) => m.HowItWorksModal),
);
import { CriteriaForm } from "./CriteriaForm";
import { IdeasHistory } from "./IdeasHistory";
import { JumpToVerdict } from "./JumpToVerdict";
import { MarqueeTicker } from "./MarqueeTicker";
import { MotionCard } from "./MotionCard";
import { FlipScoreMicro } from "./FlipScoreMicro";
import { RadarChartPanel } from "./RadarChartPanel";
import { VerdictCard } from "./VerdictCard";

export function Flip4oApp() {
  const [ideaName, setIdeaName] = useState("");
  const [evaluation, setEvaluation] = useState<CriteriaEvaluation>(
    createDefaultEvaluation,
  );
  const [stressAnswers, setStressAnswers] = useState<StressTestAnswers>({});
  const [stressTestKey, setStressTestKey] = useState<CriterionKey | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const savedIdeas = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      window.addEventListener(IDEAS_CHANGED_EVENT, onStoreChange);
      return () => window.removeEventListener(IDEAS_CHANGED_EVENT, onStoreChange);
    },
    loadIdeas,
    () => [] as SavedIdea[],
  );

  const howItWorksInitiallyOpen = useSyncExternalStore(
    () => () => {},
    () => safeGetLocalStorageItem(HOW_IT_WORKS_SEEN_KEY) === null,
    () => false,
  );
  const [howItWorksDismissed, setHowItWorksDismissed] = useState(false);
  const howItWorksOpen = howItWorksInitiallyOpen && !howItWorksDismissed;
  const howItWorksAudioUnlockRef = useRef<(() => void) | null>(null);
  const criteriaAudioUnlockRef = useRef<(() => void) | null>(null);

  const scores = useMemo(() => evaluationToScores(evaluation), [evaluation]);

  const activeStressCriterion =
    stressTestKey !== null
      ? CRITERIA.find((item) => item.key === stressTestKey) ?? null
      : null;

  const handleCloseHowItWorks = useCallback(() => {
    setHowItWorksDismissed(true);
    safeSetLocalStorageItem(HOW_IT_WORKS_SEEN_KEY, "true");
  }, []);

  const handleOpenHowItWorks = useCallback(() => {
    howItWorksAudioUnlockRef.current?.();
    setHowItWorksDismissed(false);
  }, []);

  const handleStressTestOpen = useCallback((key: CriterionKey) => {
    criteriaAudioUnlockRef.current?.();
    setStressTestKey(key);
  }, []);

  const handleManualScoreChange = useCallback(
    (key: CriterionKey, value: number) => {
      setEvaluation((prev) =>
        setCriterionEntry(prev, key, { value, source: "manual" }),
      );
    },
    [],
  );

  const handleCalculatedScoreChange = useCallback(
    (key: CriterionKey, value: number) => {
      setEvaluation((prev) =>
        setCriterionEntry(prev, key, { value, source: "calculated" }),
      );
    },
    [],
  );

  const handleStressAnswersChange = useCallback(
    (key: CriterionKey, answers: number[]) => {
      setStressAnswers((prev) => ({ ...prev, [key]: answers }));
    },
    [],
  );

  const handleAnalyze = useCallback(() => {
    setResult(analyzeScores(scores));
  }, [scores]);

  const handleSave = useCallback(() => {
    if (!result || !ideaName.trim()) return;

    const idea: SavedIdea = {
      id: crypto.randomUUID(),
      name: ideaName.trim(),
      scores: { ...scores },
      evaluation: { ...evaluation },
      result,
      timestamp: new Date().toISOString(),
    };

    saveIdea(idea);
  }, [ideaName, scores, evaluation, result]);

  const handleLoad = useCallback((idea: SavedIdea) => {
    if (!idea?.scores || !idea?.result) return;
    setIdeaName(idea.name ?? "");
    setEvaluation(normalizeEvaluation(idea.evaluation, idea.scores));
    setResult(idea.result);
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteIdea(id);
  }, []);

  return (
    <>
      <MatrixRainBackground />
      <AppShell
        header={
          <>
            <AppNav onHelpClick={handleOpenHowItWorks} />
            <MarqueeTicker />
          </>
        }
        footer={<AppFooter />}
      >
        <h1 className="sr-only">FLIP40.COM — Strategic Asset Evaluation Engine</h1>
        <div className="app-grid">
          <aside className="app-col-input min-w-0">
            <CriteriaForm
              ideaName={ideaName}
              evaluation={evaluation}
              onNameChange={setIdeaName}
              onManualScoreChange={handleManualScoreChange}
              onStressTestOpen={handleStressTestOpen}
              onAnalyze={handleAnalyze}
              onSave={handleSave}
              hasResult={result !== null}
            />
            <IdeasHistory
              ideas={savedIdeas}
              onLoad={handleLoad}
              onDelete={handleDelete}
            />
          </aside>

          <section className="app-col-dashboard noise-overlay scanlines relative min-w-0">
            <div className="dashboard-sticky relative z-[1] w-full">
              <div className="section-stack">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="section-number text-text-primary">02 — Visual Dashboard</p>
                    <h2 className="font-display mt-2 text-display-sm uppercase tracking-tight text-text-primary">
                      Analytics
                    </h2>
                  </div>
                  {result && (
                    <div className="font-body flex items-center gap-3 text-ui-sm text-ds-secondary">
                      <span>
                        Base{" "}
                        <span className="font-mono text-text-primary tabular-nums">
                          {result.baseScore}
                        </span>
                      </span>
                      <span className="text-ds-muted">·</span>
                      <span>
                        Penalty{" "}
                        <span className="font-mono text-error tabular-nums">
                          −{result.totalPenalty}
                        </span>
                      </span>
                      <span className="badge badge--lime text-ui-md">
                        {result.finalScore}
                      </span>
                    </div>
                  )}
                </div>

                <div className="divider-accent !my-0" />

                <MotionCard
                  id="radar-chart-export"
                  className="card--export relative min-h-[360px]"
                >
                  <p className="stat-label mb-4">Criteria Radar</p>
                  <RadarChartPanel scores={scores} size="large" />
                  <FlipScoreMicro score={result?.finalScore ?? 0} />
                </MotionCard>

                <VerdictCard
                  result={result}
                  ideaName={ideaName}
                  scores={scores}
                  evaluation={evaluation}
                />
              </div>
            </div>
          </section>
        </div>
      </AppShell>

      <CriteriaPopup
        open={stressTestKey !== null}
        criterion={activeStressCriterion}
        answers={
          stressTestKey !== null ? (stressAnswers[stressTestKey] ?? []) : []
        }
        onAnswersChange={(answers) => {
          if (stressTestKey === null) return;
          handleStressAnswersChange(stressTestKey, answers);
        }}
        onCalculate={(score) => {
          if (stressTestKey === null) return;
          handleCalculatedScoreChange(stressTestKey, score);
        }}
        onClose={() => setStressTestKey(null)}
        onAudioReady={(unlock) => {
          criteriaAudioUnlockRef.current = unlock;
        }}
      />

      <HowItWorksModal
        open={howItWorksOpen}
        onClose={handleCloseHowItWorks}
        onAudioReady={(unlock) => {
          howItWorksAudioUnlockRef.current = unlock;
        }}
      />

      <JumpToVerdict />
    </>
  );
}
