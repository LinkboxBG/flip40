"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, X } from "lucide-react";
import { CRITERIA_QUESTIONS } from "@/lib/constants";
import {
  calculateStressScore,
  isStressTestComplete,
} from "@/lib/stressTest";
import type { CriterionDefinition } from "@/lib/types";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useModalAmbientAudio } from "@/hooks/useModalAmbientAudio";
import { getCriterionSoundKey } from "@/lib/modalAudio";
import { MatrixDataStream } from "./MatrixDataStream";
import { ModalPortal } from "./ModalPortal";
import { ModalTopControls } from "./ModalTopControls";

interface CriteriaPopupProps {
  open: boolean;
  criterion: CriterionDefinition | null;
  answers: number[];
  onAnswersChange: (answers: number[]) => void;
  onCalculate: (score: number) => void;
  onClose: () => void;
  onAudioReady?: (unlock: () => void) => void;
}

export function CriteriaPopup({
  open,
  criterion,
  answers,
  onAnswersChange,
  onCalculate,
  onClose,
  onAudioReady,
}: CriteriaPopupProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const soundKey = criterion ? getCriterionSoundKey(criterion.key) : null;
  const { unlockAndPlay, isMuted, toggleMute } = useModalAmbientAudio(
    open && criterion !== null,
    soundKey,
  );

  const questions = criterion ? CRITERIA_QUESTIONS[criterion.key] : [];
  const canCalculate = isStressTestComplete(answers, questions.length);

  useBodyScrollLock(open);

  useEffect(() => {
    onAudioReady?.(unlockAndPlay);
  }, [onAudioReady, unlockAndPlay]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  const handleAnswerChange = (index: number, value: number) => {
    const next = [...answers];
    next[index] = value;
    while (next.length < questions.length) {
      next.push(0);
    }
    onAnswersChange(next);
  };

  const handleCalculate = () => {
    if (!canCalculate) return;
    onCalculate(calculateStressScore(answers.slice(0, questions.length)));
    onClose();
  };

  const handlePanelPointerDown = () => {
    unlockAndPlay();
  };

  return (
    <>
      <ModalPortal>
        <AnimatePresence>
          {open && criterion && (
            <motion.div
              key="stress-test-modal"
              className="modal-overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby="stress-test-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                type="button"
                className="modal-backdrop"
                aria-label="Close auto-evaluate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
              />

              <motion.div
                ref={panelRef}
                className="modal-panel modal-panel--matrix relative z-[1]"
                initial={{ opacity: 0, scale: 0.94, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ type: "spring", damping: 28, stiffness: 340, mass: 0.85 }}
                onClick={(event) => event.stopPropagation()}
                onPointerDown={handlePanelPointerDown}
              >
                <MatrixDataStream containerRef={panelRef} opacity={0.18} />

                <ModalTopControls
                  isMuted={isMuted}
                  onToggleMute={toggleMute}
                  onClose={onClose}
                  closeLabel="Close auto-evaluate"
                />

                <div className="modal-panel-inner relative z-10">
                  <header className="mb-6">
                    <p className="section-number mb-2">Auto-evaluate</p>
                    <h2
                      id="stress-test-title"
                      className="font-display text-display-sm tracking-tight text-text-primary"
                    >
                      {criterion.label}
                    </h2>
                    <p className="font-body mt-2 text-body-sm text-ds-secondary">
                      Answer three pressure scenarios. Scores are averaged into an
                      auto rating.
                    </p>
                  </header>

                  <div className="divider-accent my-5" />

                  <ol className="space-y-6">
                    {questions.map((item, index) => (
                      <li key={item.id} className="stress-question">
                        <p className="font-body text-body-sm leading-relaxed text-text-primary">
                          <span className="font-ui mr-2 text-ui-sm font-bold text-accent">
                            Q{index + 1}
                          </span>
                          {item.question}
                        </p>
                        <div
                          className="score-btn-group mt-3"
                          role="group"
                          aria-label={`Question ${index + 1} rating`}
                        >
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => handleAnswerChange(index, n)}
                              aria-pressed={answers[index] === n}
                              className={`btn-chamfer btn-chamfer-sm ${
                                answers[index] === n
                                  ? "btn-score btn-score-active"
                                  : "btn-score"
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-8 flex items-center justify-between gap-4 border-t border-border-subtle pt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-chamfer btn-close btn-md"
                    >
                      <X className="mr-2 h-4 w-4" aria-hidden />
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCalculate}
                      disabled={!canCalculate}
                      className="btn-chamfer btn-primary btn-md inline-flex items-center gap-2"
                    >
                      <Calculator className="h-4 w-4" aria-hidden />
                      Apply Score
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ModalPortal>
    </>
  );
}
