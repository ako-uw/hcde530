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
                  className="w-24 shrink-0 font-mono text-[11px] font-semibold uppercase tracking-[0.08em]"
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
