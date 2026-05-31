import type { OkReport } from "@/lib/critique.types";

export function StatsOverview({ report }: { report: OkReport }) {
  const sev: Record<1 | 2 | 3 | 4, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const i of report.issues) {
    if (i.severity >= 1 && i.severity <= 4) sev[i.severity as 1 | 2 | 3 | 4] += 1;
  }
  const oos = 10 - report.scoredCount;

  const sevItems: { key: 1 | 2 | 3 | 4; label: string }[] = [
    { key: 4, label: "S4" },
    { key: 3, label: "S3" },
    { key: 2, label: "S2" },
    { key: 1, label: "S1" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Metric label="Heuristics observed" value={`${report.scoredCount}`} suffix="/ 10" />
      <Metric label="Issues found" value={`${report.issues.length}`} />
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="text-label">Severity breakdown</div>
        <div className="mt-3 flex items-end justify-between gap-2">
          {sevItems.map((s) => (
            <div key={s.key} className="flex flex-col items-center gap-1">
              <span
                className="text-2xl font-semibold tabular-nums leading-none"
                style={{ color: sev[s.key] > 0 ? `var(--sev-${s.key})` : "var(--muted-foreground)" }}
              >
                {sev[s.key]}
              </span>
              <span
                className="text-[10px] font-semibold tracking-[0.04em]"
                style={{ color: `var(--sev-${s.key})` }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Metric label="Out of scope" value={`${oos}`} suffix="heuristics" />
    </div>
  );
}

function Metric({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-[var(--shadow-card-hover)]">
      <div className="text-label">{label}</div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-display text-[34px] leading-none tabular-nums text-foreground">
          {value}
        </span>
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}