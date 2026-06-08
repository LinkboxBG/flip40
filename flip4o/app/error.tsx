"use client";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="app-container flex min-h-screen flex-col items-center justify-center gap-6 py-16 text-center">
      <p className="section-number">System</p>
      <h1 className="font-display text-display-sm uppercase tracking-tight text-text-primary">
        Something went wrong
      </h1>
      <p className="font-body max-w-md text-body-md text-ds-secondary">
        The evaluation engine hit an unexpected error. Try again or reload the page.
      </p>
      <button type="button" onClick={reset} className="btn-chamfer btn-chamfer-sm badge badge--violet badge--interactive">
        Try again
      </button>
    </main>
  );
}
