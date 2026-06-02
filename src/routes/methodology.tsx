import { createFileRoute } from "@tanstack/react-router";
import { SEVERITY_DEFINITIONS, EVIDENCE_DEFINITIONS } from "@/lib/heuristic-definitions";

export const Route = createFileRoute("/methodology")({
  component: MethodologyPage,
  head: () => ({
    meta: [
      { title: "Methodology — CritLens" },
      {
        name: "description",
        content:
          "How CritLens evaluates an interface, in plain language for stakeholders and in detail for UX practitioners.",
      },
      { property: "og:title", content: "Methodology — CritLens" },
      {
        property: "og:description",
        content:
          "How CritLens evaluates an interface, in plain language for stakeholders and in detail for UX practitioners.",
      },
    ],
  }),
});

function MethodologyPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-20">
      <header className="mb-12 border-b border-border pb-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Methodology
        </div>
        <h1 className="font-display mt-2 text-[44px] leading-[1.05] tracking-tight md:text-[56px]">
          How we read an interface.
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.75] text-muted-foreground">
          Two ways in: the plain-English version for stakeholders, and the
          rulebook for practitioners.
        </p>
      </header>

      <div className="grid gap-0 md:grid-cols-[5fr_4fr]">
        {/* Stakeholder side — editorial paper */}
        <section className="bg-[color:var(--paper)] px-6 py-12 md:px-12 md:py-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            For stakeholders
          </div>
          <h2 className="font-display mt-3 text-[28px] leading-[1.15] md:text-[34px]">
            What heuristic evaluation actually is.
          </h2>
          <div className="prose-editorial mt-6 space-y-5 text-[16px] leading-[1.8] text-foreground/90">
            <p>
              A heuristic evaluation is a structured walk-through of an
              interface against a small set of well-known usability principles.
              No users are involved. One reviewer reads the screen the way a
              first-time user would, then writes down what's working and what
              isn't.
            </p>
            <p>
              The point isn't to grade the design. The point is to surface
              specific, fixable problems before they reach real users — the
              cheapest possible round of UX feedback.
            </p>
            <p>
              Each finding is one observable problem, tied to one principle,
              with one recommendation. They're ranked by how badly they'll get
              in a user's way, from <em>cosmetic</em> up to <em>catastrophic</em>.
            </p>
            <p>
              We don't pretend to see what we can't. If a flow needs login,
              real data, or multi-step interaction we don't have access to, we
              mark it as out of scope rather than guessing. The result is a
              short, honest list of things worth fixing.
            </p>
          </div>
        </section>

        {/* Practitioner side — ink panel */}
        <section className="bg-[color:var(--ink)] px-6 py-12 text-[color:var(--ink-fg)] md:px-12 md:py-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--ink-fg)]/60">
            For practitioners
          </div>
          <h2 className="font-display mt-3 text-[28px] leading-[1.15] md:text-[34px] text-[color:var(--ink-fg)]">
            The rules we follow.
          </h2>

          <div className="mt-8 space-y-8">
            <Block label="Integrity rules">
              <ol className="space-y-2 font-mono text-[12px] leading-[1.7]">
                <li>
                  <span className="text-[color:var(--ink-fg)]/60">01 — </span>
                  Page-load verification. Errors, redirects, queues, and CDN
                  challenges block the report rather than scoring infrastructure
                  as UX.
                </li>
                <li>
                  <span className="text-[color:var(--ink-fg)]/60">02 — </span>
                  Every finding and every heuristic carries an evidence tag.
                </li>
                <li>
                  <span className="text-[color:var(--ink-fg)]/60">03 — </span>
                  Out-of-scope heuristics are reported separately, not folded
                  into a grade.
                </li>
                <li>
                  <span className="text-[color:var(--ink-fg)]/60">04 — </span>
                  Infrastructure behaviour (5xx, 4xx, captchas, URL params) is
                  never mapped to an NNG heuristic.
                </li>
                <li>
                  <span className="text-[color:var(--ink-fg)]/60">05 — </span>
                  Output is counts: heuristics observed, issues found, severity
                  distribution, items out of scope. No averaged score.
                </li>
              </ol>
            </Block>

            <Block label="Severity scale (NNG 0–4)">
              <dl className="space-y-2 font-mono text-[12px] leading-[1.7]">
                {SEVERITY_DEFINITIONS.filter((s) => s.level >= 1).map((s) => (
                  <div key={s.short} className="grid grid-cols-[5rem_1fr] gap-3">
                    <dt className="text-[color:var(--ink-fg)]">
                      {s.short} {s.label}
                    </dt>
                    <dd className="text-[color:var(--ink-fg)]/75">{s.description}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--ink-fg)]/50">
                Scale per Nielsen, J. (1995). Severity Ratings for Usability Problems.
                Nielsen Norman Group.
              </p>
            </Block>

            <Block label="Evidence tags">
              <dl className="space-y-2 font-mono text-[12px] leading-[1.7]">
                {(["Observed", "Partial", "Out of scope"] as const).map((k) => (
                  <div key={k} className="grid grid-cols-[6rem_1fr] gap-3">
                    <dt className="text-[color:var(--ink-fg)]">{k}</dt>
                    <dd className="text-[color:var(--ink-fg)]/75">
                      {EVIDENCE_DEFINITIONS[k]}
                    </dd>
                  </div>
                ))}
              </dl>
            </Block>

            <Block label="Score caps (per heuristic)">
              <p className="font-mono text-[12px] leading-[1.7] text-[color:var(--ink-fg)]/75">
                The most severe finding on a heuristic caps any internal score
                used for ranking: S4 → 5.0, S3 → 6.5, S2 → 7.5, S1 → 8.5. These
                caps are not surfaced as grades — they exist only to order
                findings by impact.
              </p>
            </Block>
          </div>
        </section>
      </div>
    </div>
  );
}

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--ink-fg)]/60">
        {label}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
