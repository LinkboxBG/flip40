"use client";

import { AnimatedNumber } from "./AnimatedNumber";

interface FlipScoreMicroProps {
  score: number;
}

export function FlipScoreMicro({ score }: FlipScoreMicroProps) {
  return (
    <div className="flip-score-micro" aria-label={`Flip score: ${score} out of 100`}>
      <span className="flip-score-micro__label">Flip Score</span>
      <AnimatedNumber
        value={score}
        className="flip-score-micro__value price text-accent glow-text-lime"
      />
    </div>
  );
}
