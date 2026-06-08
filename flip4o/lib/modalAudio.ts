import type { SoundKey } from "./matrixSounds";
import type { CriterionKey } from "./types";

export const MODAL_AUDIO = {
  howItWorks: "clubbed_to_death",
  privacy: "watching_you",
} as const satisfies Record<string, SoundKey>;

const CRITERION_AUDIO: Record<CriterionKey, SoundKey> = {
  flipPotential: "what_is_the_matrix",
  moat: "red_pill",
  marketSize: "no_spoon",
  execution: "mr_anderson",
  capitalEfficiency: "buckle_seatbelt",
};

export function getCriterionSoundKey(key: CriterionKey): SoundKey {
  return CRITERION_AUDIO[key];
}

export const MODAL_AUDIO_MUTE_EVENT = "flip4o-modal-audio-mute";

export function broadcastModalAudioMute(muted: boolean): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(MODAL_AUDIO_MUTE_EVENT, { detail: { muted } }),
  );
}
