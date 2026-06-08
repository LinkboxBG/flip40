import { LINKEDIN_URL } from "@/lib/constants";

const SECTIONS = [
  {
    title: "1. Data Processing Philosophy",
    body: 'FLIP40.COM operates on a "Privacy-by-Design" principle. We believe your business ideas are your most valuable assets. Therefore, we do not collect, store, or transmit your business ideas, asset names, or evaluation scores to any external servers.',
  },
  {
    title: "2. Local Storage",
    body: 'The "Save" and "History" features of this application utilize your browser\u2019s localStorage capability. This means all data you input\u2014including asset names and evaluation metrics\u2014stays strictly on your device. We do not have access to this data.',
  },
  {
    title: "3. External Data",
    body: "We do not use third-party trackers or cookies to profile your behavior. Our infrastructure is designed to keep your analysis isolated from our environment.",
  },
  {
    title: "4. Liability",
    body: "FLIP40.COM is a strategic evaluation tool. The verdicts provided (BUILD, PIVOT, KILL) are algorithmic suggestions based on your inputs. We are not liable for any business or investment decisions made based on these evaluations.",
  },
] as const;

export function PrivacyPolicy() {
  return (
    <article className="privacy-document privacy-document--embedded">
      <header className="privacy-document__header">
        <p className="section-number mb-2">Legal</p>
        <h1
          id="privacy-policy-title"
          className="privacy-document__title font-display text-display-sm tracking-tight text-text-primary"
        >
          PRIVACY POLICY
        </h1>
        <p className="font-ui mt-2 text-ui-sm uppercase tracking-[0.15em] text-ds-secondary">
          Last Updated: June 8, 2026
        </p>
      </header>

      <div className="divider-accent my-6" />

      <div className="privacy-document__body space-y-6">
        {SECTIONS.map((section) => (
          <section key={section.title} className="privacy-section">
            <h2 className="privacy-section__title font-ui">{section.title}</h2>
            <p className="font-body mt-2 text-body-sm leading-relaxed text-ds-secondary">
              {section.body}
            </p>
          </section>
        ))}

        <section className="privacy-section">
          <h2 className="privacy-section__title font-ui">5. Contact</h2>
          <p className="font-body mt-2 text-body-sm leading-relaxed text-ds-secondary">
            If you have questions regarding this policy, you may reach out to the project owner:{" "}
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="privacy-contact-link"
            >
              Ivan Kolev
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
