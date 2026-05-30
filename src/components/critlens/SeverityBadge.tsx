import { SEVERITY_LABEL } from "@/lib/heuristics";

const COLORS: Record<number, string> = {
  0: "text-[color:var(--sev-0)] bg-[color:var(--sev-0-bg)]",
  1: "text-[color:var(--sev-1)] bg-[color:var(--sev-1-bg)]",
  2: "text-[color:var(--sev-2)] bg-[color:var(--sev-2-bg)]",
  3: "text-[color:var(--sev-3)] bg-[color:var(--sev-3-bg)]",
  4: "text-[color:var(--sev-4)] bg-[color:var(--sev-4-bg)]",
};

export function SeverityBadge({ severity }: { severity: number }) {
  const label = SEVERITY_LABEL[severity] ?? "Cosmetic";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] ${COLORS[severity] ?? COLORS[0]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      S{severity} — {label}
    </span>
  );
}

export function severityVar(severity: number): string {
  return `var(--sev-${Math.max(0, Math.min(4, severity))})`;
}

export function severityVar(severity: number): string {
  return `var(--sev-${Math.max(0, Math.min(4, severity))})`;
}
