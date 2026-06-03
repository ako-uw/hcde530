import { useEffect, useState } from "react";
import type { OkReport } from "@/lib/critique.types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { SEVERITY_DEFINITIONS } from "@/lib/heuristic-definitions";

function useCountUp(target: number, durationMs = 700) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (target <= 0) {
      setN(0);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return n;
}

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
    <div className="grid gap-px overflow-hidden border-2 border-[color:var(--border-strong)] bg-[color:var(--border-strong)] shadow-[4px_4px_0_0_var(--border-strong)] md:grid-cols-3">
      <Metric
        label="Heuristics observed"
        target={report.scoredCount}
        suffix="/ 10"
        accent="primary"
      />
      <Metric label="Issues found" target={report.issues.length} accent="warm" />
      <Metric label="Out of scope" target={oos} suffix="heuristics" accent="muted" />
      <div className="bg-[color:var(--card)] p-6 md:col-span-3">
        <div className="flex items-center justify-between">
          <div className="text-label">Severity breakdown</div>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            S4 ▸ S1
          </span>
        </div>
        <TooltipProvider delayDuration={150}>
          <div className="mt-5 grid grid-cols-4 gap-3">
            {sevItems.map((s) => {
              const def = SEVERITY_DEFINITIONS.find((d) => d.level === s.key);
              const count = sev[s.key];
              return (
                <Tooltip key={s.key}>
                  <TooltipTrigger asChild>
                    <div
                      className="group flex cursor-help flex-col gap-1 border-l-[3px] pl-3 transition-transform hover:translate-y-[-1px]"
                      style={{ borderColor: `var(--severity-s${s.key})` }}
                    >
                      <SevCount n={count} colorVar={`var(--severity-s${s.key})`} />
                      <span
                        className="font-mono text-[10px] font-semibold tracking-[0.14em]"
                        style={{ color: `var(--severity-s${s.key})` }}
                      >
                        {s.label} · {def?.label}
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
    </div>
  );
}

function SevCount({ n, colorVar }: { n: number; colorVar: string }) {
  const v = useCountUp(n);
  return (
    <span
      className="font-display text-[34px] font-bold leading-none tabular-nums"
      style={{ color: n > 0 ? colorVar : "var(--muted-foreground)" }}
    >
      {v}
    </span>
  );
}

function Metric({
  label,
  target,
  suffix,
  accent = "default",
}: {
  label: string;
  target: number;
  suffix?: string;
  accent?: "primary" | "warm" | "muted" | "severity" | "default";
}) {
  const v = useCountUp(target);
  const color =
    accent === "primary"
      ? "var(--primary)"
      : accent === "warm"
        ? "var(--accent-warm)"
        : accent === "severity"
          ? `var(--severity-s${Math.max(1, target) as 1 | 2 | 3 | 4})`
          : "var(--foreground)";
  return (
    <div className="relative bg-[color:var(--card)] p-6">
      <div className="text-label">{label}</div>
      <div className="mt-5 flex items-baseline gap-2">
        <span
          className="font-display text-[48px] font-bold leading-none tabular-nums"
          style={{ color: target > 0 ? color : "var(--muted-foreground)" }}
        >
          {v}
        </span>
        {suffix && (
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}