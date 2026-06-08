"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { isBrowser, safeGetLocalStorageItem, safeSetLocalStorageItem } from "@/lib/browser";
import { MODAL_AUDIO_MUTED_KEY } from "@/lib/constants";
import {
  isModalAudioMuted,
  playSound,
  stopAllSounds,
  stopSound,
  type SoundKey,
} from "@/lib/matrixSounds";
import { broadcastModalAudioMute, MODAL_AUDIO_MUTE_EVENT } from "@/lib/modalAudio";

const MODAL_VOLUME = 0.55;
const MODAL_FADE_IN = 250;

function readMutedPreference(): boolean {
  return safeGetLocalStorageItem(MODAL_AUDIO_MUTED_KEY) === "true";
}

export function useModalAmbientAudio(active: boolean, soundKey: SoundKey | null) {
  const isMuted = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      const handler = () => onStoreChange();
      window.addEventListener(MODAL_AUDIO_MUTE_EVENT, handler);
      window.addEventListener("storage", handler);
      return () => {
        window.removeEventListener(MODAL_AUDIO_MUTE_EVENT, handler);
        window.removeEventListener("storage", handler);
      };
    },
    readMutedPreference,
    () => false,
  );
  const activeSoundRef = useRef<SoundKey | null>(null);

  const prepareAndPlay = useCallback(() => {
    if (!isBrowser() || !soundKey || isMuted) return;
    activeSoundRef.current = soundKey;
    playSound(soundKey, {
      volume: MODAL_VOLUME,
      fadeIn: MODAL_FADE_IN,
      loop: false,
      stopCurrent: true,
    });
  }, [soundKey, isMuted]);

  const unlockAndPlay = useCallback(() => {
    prepareAndPlay();
  }, [prepareAndPlay]);

  const applyMuteState = useCallback(
    (muted: boolean, stopPlayback: boolean) => {
      safeSetLocalStorageItem(MODAL_AUDIO_MUTED_KEY, String(muted));

      if (muted || stopPlayback) {
        stopAllSounds();
        activeSoundRef.current = null;
      } else if (active && soundKey) {
        prepareAndPlay();
      }
    },
    [active, prepareAndPlay, soundKey],
  );

  const toggleMute = useCallback(() => {
    const next = !isMuted;
    applyMuteState(next, next);
    broadcastModalAudioMute(next);
  }, [applyMuteState, isMuted]);

  useEffect(() => {
    if (!isBrowser()) return;

    const handleMuteBroadcast = (event: Event) => {
      const muted = (event as CustomEvent<{ muted: boolean }>).detail.muted;
      applyMuteState(muted, muted);
    };

    window.addEventListener(MODAL_AUDIO_MUTE_EVENT, handleMuteBroadcast);

    return () => {
      window.removeEventListener(MODAL_AUDIO_MUTE_EVENT, handleMuteBroadcast);
    };
  }, [applyMuteState]);

  useEffect(() => {
    if (!isBrowser()) return;

    if (!active || !soundKey) {
      if (activeSoundRef.current) {
        stopSound(activeSoundRef.current);
        activeSoundRef.current = null;
      }
      return;
    }

    if (!isMuted && !isModalAudioMuted()) {
      prepareAndPlay();
    }

    return () => {
      if (activeSoundRef.current) {
        stopSound(activeSoundRef.current);
        activeSoundRef.current = null;
      }
    };
  }, [active, soundKey, isMuted, prepareAndPlay]);

  useEffect(() => {
    return () => {
      if (!isBrowser()) return;
      if (activeSoundRef.current) {
        stopSound(activeSoundRef.current);
        activeSoundRef.current = null;
      }
    };
  }, []);

  return { unlockAndPlay, isMuted, toggleMute };
}
