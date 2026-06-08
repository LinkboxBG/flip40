"use client";

import { Clock, Trash2 } from "lucide-react";
import type { SavedIdea } from "@/lib/types";
import { MotionCard } from "./MotionCard";

interface IdeasHistoryProps {
  ideas: SavedIdea[];
  onLoad: (idea: SavedIdea) => void;
  onDelete: (id: string) => void;
}

export function IdeasHistory({ ideas, onLoad, onDelete }: IdeasHistoryProps) {
  if (ideas.length === 0) return null;

  return (
    <MotionCard className="mt-12">
      <p className="stat-label mb-4">Saved Ideas</p>
      <ul className="scrollbar-thin max-h-44 space-y-2 overflow-y-auto">
        {ideas.map((idea) => (
          <li key={idea.id} className="idea-item flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onLoad(idea)}
              className="min-w-0 flex-1 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-lime"
            >
              <p className="font-ui truncate text-body-sm font-medium text-text-primary">
                {idea.name}
              </p>
              <p className="font-body mt-1 flex items-center gap-1.5 text-ui-sm text-ds-secondary">
                <Clock className="h-3.5 w-3.5" />
                {new Date(idea.timestamp).toLocaleString()}
                <span className="font-mono ml-1 text-accent glow-text-lime tabular-nums">
                  · {idea.result?.finalScore ?? "—"}
                </span>
              </p>
            </button>
            <button
              type="button"
              onClick={() => onDelete(idea.id)}
              className="shrink-0 rounded-sm p-2 text-ds-secondary transition hover:bg-bg-elevated hover:text-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-lime"
              aria-label={`Delete ${idea.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </MotionCard>
  );
}
