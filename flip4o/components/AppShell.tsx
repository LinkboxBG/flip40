"use client";

import type { ReactNode } from "react";

interface AppShellProps {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

export function AppShell({ header, footer, children }: AppShellProps) {
  return (
    <div className="relative z-[1] flex min-h-screen flex-1 flex-col">
      <header className="sticky top-0 z-40 w-full shrink-0">{header}</header>
      <main className="app-main bg-base-noise relative z-[1] flex flex-1 flex-col py-8 pb-12 lg:py-12">
        <div className="app-container">{children}</div>
      </main>
      <footer className="app-footer-shell shrink-0">{footer}</footer>
    </div>
  );
}
