import type { Evidence } from "@/lib/critique.types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { EVIDENCE_DEFINITIONS } from "@/lib/heuristic-definitions";

const STYLES: Record<Evidence, string> = {
  Observed: "text-[color:var(--ev-observed)] bg-[color:var(--ev-observed-bg)]",
  Partial: "text-[color:var(--ev-partial)] bg-[color:var(--ev-partial-bg)]",
  "Out of scope": "text-[color:var(--ev-oos)] bg-[color:var(--ev-oos-bg)]",
};

export function EvidenceBadge({ evidence }: { evidence: Evidence }) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`font-mono inline-flex cursor-help items-center rounded-none px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] ${STYLES[evidence]}`}
          >
            {evidence}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-[12px] leading-snug">
          {EVIDENCE_DEFINITIONS[evidence]}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
