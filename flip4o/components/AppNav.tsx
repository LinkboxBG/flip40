"use client";

import { HelpCircle } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

interface AppNavProps {
  onHelpClick: () => void;
}

export function AppNav({ onHelpClick }: AppNavProps) {
  return (
    <nav className="nav">
      <div className="app-container nav-inner flex w-full items-center justify-between">
        <div className="nav-brand-group">
          <BrandLogo className="brand-logo--nav h-11 w-auto md:h-12" />
        </div>
        <div className="nav-meta-group">
          <button
            type="button"
            onClick={onHelpClick}
            className="btn-chamfer btn-chamfer-sm badge badge--violet badge--interactive btn-nav-help"
            aria-label="How it works — learn the FLIP40.COM evaluation flow"
            title="How it works — learn the FLIP40.COM evaluation flow"
          >
            <HelpCircle className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            <span>How it works</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
