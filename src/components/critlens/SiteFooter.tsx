import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-6 py-8 md:px-10">
        <div className="space-y-1">
          <div className="font-display text-[18px] leading-none">CritLens</div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            A heuristic evaluation tool
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Evaluate
          </Link>
          <Link to="/heuristics" className="hover:text-foreground">
            Heuristics
          </Link>
          <Link to="/methodology" className="hover:text-foreground">
            Methodology
          </Link>
          <a
            href="https://www.nngroup.com/articles/ten-usability-heuristics/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            NNG reference ↗
          </a>
        </nav>
      </div>
    </footer>
  );
}

*** Add File: src/components/critlens/Legend.tsx
import { SEVERITY_DEFINITIONS, EVIDENCE_DEFINITIONS } from "@/lib/heuristic-definitions";

export function Legend() {
  const sev = SEVERITY_DEFINITIONS.filter((s) => s.level >= 1);
  return (
    <div className="rounded-none border border-border bg-card">
      <div className="grid gap-0 md:grid-cols-2">
        <div className="border-b border-border p-5 md:border-b-0 md:border-r">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Severity scale
          </div>
          <dl className="mt-3 space-y-2">
            {sev.map((s) => (
              <div key={s.short} className="flex gap-3">
                <dt
                  className="w-20 shrink-0 font-mono text-[11px] font-semibold uppercase tracking-[0.08em]"
                  style={{ color: `var(--sev-${s.level})` }}
                >
                  {s.short} {s.label}
                </dt>
                <dd className="text-[13px] leading-snug text-foreground/80">
                  {s.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Evidence tags
          </div>
          <dl className="mt-3 space-y-2">
            {(["Observed", "Partial", "Out of scope"] as const).map((k) => (
              <div key={k} className="flex gap-3">
                <dt
                  className="w-24 shrink-0 font-mono text-[11px] font-semibold uppercase tracking-[0.08em]"
                  style={{
                    color:
                      k === "Observed"
                        ? "var(--ev-observed)"
                        : k === "Partial"
                          ? "var(--ev-partial)"
                          : "var(--ev-oos)",
                  }}
                >
                  {k}
                </dt>
                <dd className="text-[13px] leading-snug text-foreground/80">
                  {EVIDENCE_DEFINITIONS[k]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
