import type { OkReport } from "@/lib/critique.types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { SEVERITY_DEFINITIONS } from "@/lib/heuristic-definitions";

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
    <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border md:grid-cols-4">
      <Metric label="Heuristics observed" value={`${report.scoredCount}`} suffix="/ 10" />
      <Metric label="Issues found" value={`${report.issues.length}`} />
      <div className="bg-card p-5">
        <div className="text-label">Severity breakdown</div>
        <TooltipProvider delayDuration={150}>
          <div className="mt-4 flex items-end justify-between gap-2">
            {sevItems.map((s) => {
              const def = SEVERITY_DEFINITIONS.find((d) => d.level === s.key);
              return (
                <Tooltip key={s.key}>
                  <TooltipTrigger asChild>
                    <div className="flex cursor-help flex-col items-center gap-1">
                      <span
                        className="font-display text-[28px] tabular-nums leading-none"
                        style={{
                          color: sev[s.key] > 0 ? `var(--sev-${s.key})` : "var(--muted-foreground)",
                        }}
                      >
                        {sev[s.key]}
                      </span>
                      <span
                        className="font-mono text-[10px] font-medium tracking-[0.12em]"
                        style={{ color: `var(--sev-${s.key})` }}
                      >
                        {s.label}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[220px] text-[12px] leading-snug">
                    <strong>{s.label} — {def?.label}.</strong> {def?.description}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </div>
      <Metric label="Out of scope" value={`${oos}`} suffix="heuristics" />
    </div>
  );
}

function Metric({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="bg-card p-5">
      <div className="text-label">{label}</div>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="font-display text-[40px] leading-none tabular-nums text-foreground">
          {value}
        </span>
        {suffix && (
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}