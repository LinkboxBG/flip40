"use client";

import Link from "next/link";
import { LINKEDIN_URL } from "@/lib/constants";

export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-container flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="app-footer__link"
          aria-label="The Chosen One on LinkedIn (opens in new tab)"
        >
          The Chosen One
        </a>
        <span className="app-footer__sep" aria-hidden>
          ·
        </span>
        <Link href="/privacy" className="app-footer__link app-footer__link--violet">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
