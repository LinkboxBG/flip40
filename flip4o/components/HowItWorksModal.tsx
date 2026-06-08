"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useModalAmbientAudio } from "@/hooks/useModalAmbientAudio";
import { MODAL_AUDIO } from "@/lib/modalAudio";
import { BrandLogo } from "./BrandLogo";
import { MatrixDataStream } from "./MatrixDataStream";
import { ModalPortal } from "./ModalPortal";
import { ModalTopControls } from "./ModalTopControls";

interface HowItWorksModalProps {
  open: boolean;
  onClose: () => void;
  onAudioReady?: (unlock: () => void) => void;
}

const STEPS = [
  {
    label: "INPUT",
    text: "Rate your asset across 5 core criteria: Flip Potential, Moat, Market Size, Execution, and Capital Efficiency.",
  },
  {
    label: "EVALUATE",
    text: "Our auto-evaluate engine runs specialized scenarios to expose hidden weaknesses in your project.",
  },
  {
    label: "VALIDATE",
    text: "Review the Visual Dashboard to identify if your asset is balanced or requires a strategic pivot.",
  },
  {
    label: "DECIDE",
    text: "Get a definitive verdict—BUILD, PIVOT, or KILL—and determine if your asset has true exit value.",
  },
] as const;

export function HowItWorksModal({ open, onClose, onAudioReady }: HowItWorksModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { unlockAndPlay, isMuted, toggleMute } = useModalAmbientAudio(
    open,
    MODAL_AUDIO.howItWorks,
  );

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

  const handlePanelPointerDown = () => {
    unlockAndPlay();
  };

  return (
    <>
      <ModalPortal>
        <AnimatePresence>
          {open && (
            <motion.div
              key="how-it-works-modal"
              className="modal-overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby="how-it-works-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                type="button"
                className="modal-backdrop"
                aria-label="Close dialog"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
              />

              <motion.div
                ref={panelRef}
                className="modal-panel modal-panel--matrix relative z-[1]"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 26, stiffness: 320, mass: 0.9 }}
                onClick={(event) => event.stopPropagation()}
                onPointerDown={handlePanelPointerDown}
              >
                <MatrixDataStream containerRef={panelRef} opacity={0.18} />

                <ModalTopControls
                  isMuted={isMuted}
                  onToggleMute={toggleMute}
                  onClose={onClose}
                  closeLabel="Close how it works"
                />

                <div className="modal-panel-inner relative z-10">
                  <header className="mb-6">
                    <p className="section-number mb-2">How it works</p>
                    <h2
                      id="how-it-works-title"
                      className="font-display text-display-sm tracking-tight text-text-primary flex flex-wrap items-center gap-x-2 gap-y-1"
                    >
                      <span>WELCOME TO</span>
                      <BrandLogo className="brand-logo--modal-title h-7 w-auto md:h-8" />
                    </h2>
                    <p className="font-ui mt-2 text-ui-sm uppercase tracking-[0.15em] text-ds-secondary">
                      Strategic Asset Evaluation Engine
                    </p>
                  </header>

                  <div className="divider-accent my-5" />

                  <section>
                    <h3 className="font-display mb-4 text-ui-md uppercase tracking-wider text-accent">
                      HOW IT WORKS
                    </h3>
                    <ol className="space-y-4">
                      {STEPS.map((step) => (
                        <li key={step.label} className="modal-step">
                          <span className="modal-step-label font-ui">{step.label}</span>
                          <p className="font-body mt-1 text-body-sm leading-relaxed text-ds-secondary">
                            {step.text}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </section>

                  <p className="font-body mt-6 border-t border-border-subtle pt-5 text-body-sm leading-relaxed text-ds-secondary">
                    FLIP40.COM: Built for entrepreneurs who create scalable, exit-ready assets.
                  </p>

                  <div className="mt-8 flex justify-end">
                    <button type="button" onClick={onClose} className="btn-chamfer btn-close btn-md">
                      <X className="mr-2 h-4 w-4" aria-hidden />
                      Close
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
