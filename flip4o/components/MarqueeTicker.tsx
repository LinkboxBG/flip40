const ITEMS = [
  "Flip Potential",
  "Moat",
  "Market Size",
  "Execution",
  "Capital Efficiency",
  "Evaluate",
  "Verdict",
] as const;

export function MarqueeTicker() {
  return (
    <div className="marquee-shell" aria-hidden="true">
      <div className="marquee-track">
        <div className="marquee-content">
          {ITEMS.map((item) => (
            <span key={item} className="marquee-item">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
