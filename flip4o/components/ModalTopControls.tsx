"use client";

import type { MouseEvent } from "react";
import { Volume2, VolumeX, X } from "lucide-react";

interface ModalTopControlsProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onClose?: () => void;
  closeLabel?: string;
}

export function ModalTopControls({
  isMuted,
  onToggleMute,
  onClose,
  closeLabel = "Close",
}: ModalTopControlsProps) {
  const handleToggleMute = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggleMute();
  };

  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClose?.();
  };

  return (
    <div className="modal-top-controls">
      <button
        type="button"
        className="modal-audio-toggle"
        onClick={handleToggleMute}
        aria-label={isMuted ? "Unmute ambient audio" : "Mute ambient audio"}
        aria-pressed={isMuted}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="modal-audio-toggle__icon" strokeWidth={2} aria-hidden />
        ) : (
          <Volume2 className="modal-audio-toggle__icon" strokeWidth={2} aria-hidden />
        )}
      </button>
      {onClose && (
        <button
          type="button"
          className="modal-close-x"
          onClick={handleClose}
          aria-label={closeLabel}
        >
          <X className="modal-close-x__icon" strokeWidth={2.5} aria-hidden />
        </button>
      )}
    </div>
  );
}
