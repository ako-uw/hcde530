import { SEVERITY_LABEL } from "@/lib/heuristics";

const COLORS: Record<number, string> = {
  0: "bg-[color:var(--sev-0)]/15 text-[color:var(--sev-0)] border-[color:var(--sev-0)]/30",
  1: "bg-[color:var(--sev-1)]/15 text-[color:var(--sev-1)] border-[color:var(--sev-1)]/30",
  2: "bg-[color:var(--sev-2)]/20 text-[color:var(--sev-2)] border-[color:var(--sev-2)]/40",
  3: "bg-[color:var(--sev-3)]/20 text-[color:var(--sev-3)] border-[color:var(--sev-3)]/40",
  4: "bg-[color:var(--sev-4)]/20 text-[color:var(--sev-4)] border-[color:var(--sev-4)]/40",
};

export function SeverityBadge({ severity }: { severity: number }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${COLORS[severity] ?? COLORS[0]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {SEVERITY_LABEL[severity]} · {severity}
    </span>
  );
}