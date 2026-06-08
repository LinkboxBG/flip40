"use client";

import { ChevronDown } from "lucide-react";

export function JumpToVerdict() {
  const handleJump = () => {
    document.getElementById("verdict-panel")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="jump-verdict-bar lg:hidden">
      <button
        type="button"
        onClick={handleJump}
        className="jump-verdict-btn btn-chamfer"
        aria-label="Jump to verdict section"
      >
        <span>Jump to Verdict</span>
        <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
      </button>
    </div>
  );
}
