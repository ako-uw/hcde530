import { SEVERITY_LABEL } from "@/lib/heuristics";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { SEVERITY_DEFINITIONS } from "@/lib/heuristic-definitions";

const COLORS: Record<number, string> = {
  0: "text-[color:var(--sev-0)] bg-[color:var(--sev-0-bg)]",
  1: "text-[color:var(--sev-1)] bg-[color:var(--sev-1-bg)]",
  2: "text-[color:var(--sev-2)] bg-[color:var(--sev-2-bg)]",
  3: "text-[color:var(--sev-3)] bg-[color:var(--sev-3-bg)]",
  4: "text-[color:var(--sev-4)] bg-[color:var(--sev-4-bg)]",
};

export function SeverityBadge({ severity }: { severity: number }) {
  const label = SEVERITY_LABEL[severity] ?? "Cosmetic";
  const def = SEVERITY_DEFINITIONS.find((s) => s.level === severity);
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`font-mono inline-flex cursor-help items-center gap-1.5 rounded-none px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] ${COLORS[severity] ?? COLORS[0]}`}
          >
            <span className="size-1.5 rounded-full bg-current" />
            S{severity} {label}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-[12px] leading-snug">
          {def?.description ?? label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function severityVar(severity: number): string {
  return `var(--sev-${Math.max(0, Math.min(4, severity))})`;
}
