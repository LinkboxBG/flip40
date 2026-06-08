export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function safeGetLocalStorageItem(key: string): string | null {
  if (!isBrowser()) return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetLocalStorageItem(key: string, value: string): void {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore quota / storage errors */
  }
}
