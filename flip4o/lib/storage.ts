import { isBrowser, safeGetLocalStorageItem, safeSetLocalStorageItem } from "./browser";
import { IDEAS_CHANGED_EVENT, STORAGE_KEY } from "./constants";
import { normalizeEvaluation } from "./evaluation";
import { sanitizeScores } from "./engine";
import type { AnalysisResult, CriteriaScores, SavedIdea } from "./types";

function safeParseJson(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function isValidAnalysisResult(value: unknown): value is AnalysisResult {
  if (!value || typeof value !== "object") return false;
  const result = value as AnalysisResult;
  return (
    typeof result.baseScore === "number" &&
    typeof result.totalPenalty === "number" &&
    typeof result.finalScore === "number" &&
    typeof result.verdict === "string" &&
    typeof result.verdictTone === "string" &&
    Array.isArray(result.penalties) &&
    Array.isArray(result.counterArguments) &&
    typeof result.developerModeActive === "boolean"
  );
}

function isValidSavedIdea(item: unknown): item is SavedIdea {
  if (!item || typeof item !== "object") return false;
  const idea = item as SavedIdea;
  return (
    typeof idea.id === "string" &&
    typeof idea.name === "string" &&
    typeof idea.timestamp === "string" &&
    idea.scores !== null &&
    typeof idea.scores === "object" &&
    isValidAnalysisResult(idea.result)
  );
}

function normalizeSavedIdea(item: SavedIdea): SavedIdea {
  const scores = sanitizeScores(item.scores as CriteriaScores);
  return {
    id: item.id,
    name: item.name.trim() || "Untitled",
    scores,
    evaluation: normalizeEvaluation(item.evaluation, scores),
    result: item.result,
    timestamp: item.timestamp,
  };
}

export function loadIdeas(): SavedIdea[] {
  if (!isBrowser()) return [];

  try {
    const raw = safeGetLocalStorageItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = safeParseJson(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(isValidSavedIdea)
      .map(normalizeSavedIdea)
      .slice(0, 50);
  } catch {
    return [];
  }
}

export function saveIdea(idea: SavedIdea): void {
  if (!isBrowser()) return;

  try {
    const existing = loadIdeas();
    const normalized = normalizeSavedIdea(idea);
    const updated = [
      normalized,
      ...existing.filter((i) => i.id !== normalized.id),
    ].slice(0, 50);
    safeSetLocalStorageItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(IDEAS_CHANGED_EVENT));
  } catch {
    /* ignore quota / storage errors */
  }
}

export function deleteIdea(id: string): void {
  if (!isBrowser()) return;

  try {
    const updated = loadIdeas().filter((i) => i.id !== id);
    safeSetLocalStorageItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(IDEAS_CHANGED_EVENT));
  } catch {
    /* ignore quota / storage errors */
  }
}
