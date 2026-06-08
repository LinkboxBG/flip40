import Link from "next/link";

export default function NotFound() {
  return (
    <main className="app-container flex min-h-screen flex-col items-center justify-center gap-6 py-16 text-center">
      <p className="section-number">404</p>
      <h1 className="font-display text-display-sm uppercase tracking-tight text-text-primary">
        Page not found
      </h1>
      <p className="font-body max-w-md text-body-md text-ds-secondary">
        This route does not exist. Return to the FLIP40 evaluation engine.
      </p>
      <Link href="/" className="btn-chamfer btn-chamfer-sm badge badge--lime">
        Back to home
      </Link>
    </main>
  );
}
