"use client";

import { useEffect } from "react";
import { isBrowser } from "@/lib/browser";

export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked || !isBrowser()) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [locked]);
}
