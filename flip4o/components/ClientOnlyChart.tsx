"use client";

import { useSyncExternalStore, type ReactNode } from "react";

interface ClientOnlyChartProps {
  children: ReactNode;
  fallback?: ReactNode;
}

function subscribeNoop() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function ClientOnlyChart({
  children,
  fallback = (
    <div className="flex h-full min-h-[240px] items-center justify-center font-body text-body-sm text-ds-secondary">
      Loading chart…
    </div>
  ),
}: ClientOnlyChartProps) {
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (!mounted) return <>{fallback}</>;
  return <>{children}</>;
}
