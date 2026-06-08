"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useModalAmbientAudio } from "@/hooks/useModalAmbientAudio";
import { MODAL_AUDIO } from "@/lib/modalAudio";
import { MatrixDataStream } from "./MatrixDataStream";
import { ModalPortal } from "./ModalPortal";
import { ModalTopControls } from "./ModalTopControls";
import { PrivacyPolicy } from "./PrivacyPolicy";

interface PrivacyPolicyModalProps {
  open: boolean;
  onClose: () => void;
  onAudioReady?: (unlock: () => void) => void;
}

export function PrivacyPolicyModal({
  open,
  onClose,
  onAudioReady,
}: PrivacyPolicyModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { unlockAndPlay, isMuted, toggleMute } = useModalAmbientAudio(
    open,
    MODAL_AUDIO.privacy,
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
              key="privacy-policy-modal"
              className="modal-overlay"
              role="dialog"
              aria-modal="true"
              aria-labelledby="privacy-policy-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                type="button"
                className="modal-backdrop"
                aria-label="Close privacy policy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
              />

              <motion.div
                ref={panelRef}
                className="modal-panel modal-panel--matrix modal-panel--privacy relative z-[1]"
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
                  closeLabel="Close privacy policy"
                />

                <div className="modal-panel-inner relative z-10">
                  <PrivacyPolicy />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ModalPortal>
    </>
  );
}
