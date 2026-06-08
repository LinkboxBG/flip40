import { safeGetLocalStorageItem } from "@/lib/browser";
import { MODAL_AUDIO_MUTED_KEY } from "@/lib/constants";

const AUDIO_BASE = "/assets/audio";

export const matrixSounds = {
  clubbed_to_death: `${AUDIO_BASE}/clubbed-to-death.mp3`,
  what_is_the_matrix: `${AUDIO_BASE}/what-is-the-matrix.mp3`,
  red_pill: `${AUDIO_BASE}/red-pill.mp3`,
  no_spoon: `${AUDIO_BASE}/no-spoon.mp3`,
  mr_anderson: `${AUDIO_BASE}/mr-anderson.mp3`,
  buckle_seatbelt: `${AUDIO_BASE}/buckle-seatbelt.mp3`,
  watching_you: `${AUDIO_BASE}/watching-you.mp3`,
} as const;

export type SoundKey = keyof typeof matrixSounds;

const pool: Partial<Record<SoundKey, HTMLAudioElement>> = {};
const fadeTimers = new Map<SoundKey, ReturnType<typeof setInterval>>();

export interface PlayOptions {
  volume?: number;
  loop?: boolean;
  fadeIn?: number;
  stopCurrent?: boolean;
}

export function isModalAudioMuted(): boolean {
  return safeGetLocalStorageItem(MODAL_AUDIO_MUTED_KEY) === "true";
}

function clearFadeTimer(key: SoundKey) {
  const timer = fadeTimers.get(key);
  if (timer) {
    clearInterval(timer);
    fadeTimers.delete(key);
  }
}

export function playSound(key: SoundKey, options: PlayOptions = {}): HTMLAudioElement | null {
  if (typeof window === "undefined" || isModalAudioMuted()) return null;

  const { volume = 0.7, loop = false, fadeIn = 0, stopCurrent = true } = options;

  if (stopCurrent && pool[key]) {
    clearFadeTimer(key);
    pool[key]!.pause();
    pool[key]!.currentTime = 0;
  }

  const audio = new Audio(matrixSounds[key]);
  audio.loop = loop;
  audio.volume = fadeIn > 0 ? 0 : volume;
  pool[key] = audio;

  audio.play().catch(() => {
    /* blocked until explicit user gesture */
  });

  if (fadeIn > 0) {
    clearFadeTimer(key);
    const steps = 20;
    const interval = fadeIn / steps;
    const increment = volume / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, volume);
      audio.volume = current;
      if (current >= volume) {
        clearFadeTimer(key);
      }
    }, interval);
    fadeTimers.set(key, timer);
  }

  return audio;
}

export function stopSound(key: SoundKey, fadeOut = 0): void {
  const audio = pool[key];
  if (!audio) return;

  clearFadeTimer(key);

  if (fadeOut > 0) {
    const steps = 20;
    const timer = setInterval(() => {
      audio.volume = Math.max(audio.volume - audio.volume / steps, 0);
      if (audio.volume <= 0.01) {
        clearInterval(timer);
        fadeTimers.delete(key);
        audio.pause();
        audio.currentTime = 0;
      }
    }, fadeOut / steps);
    fadeTimers.set(key, timer);
    return;
  }

  audio.pause();
  audio.currentTime = 0;
}

export function stopAllSounds(fadeOut = 0): void {
  (Object.keys(pool) as SoundKey[]).forEach((key) => stopSound(key, fadeOut));
}
