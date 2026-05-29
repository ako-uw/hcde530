import { AlertTriangle } from "lucide-react";

export function BlockedNotice({
  reason,
  source,
}: {
  reason: string;
  source: { kind: "url"; url: string } | { kind: "image" };
}) {
  return (
    <div className="rounded-lg border border-border surface p-6">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-muted-foreground border border-border">
          <AlertTriangle className="size-4" />
        </div>
        <div className="space-y-2">
          <h2 className="text-base font-medium text-foreground">
            Evaluation blocked — interface did not load successfully
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Reason: {reason}. No scores assigned.
          </p>
          {source.kind === "url" && (
            <div className="text-xs text-muted-foreground break-all">
              <span className="text-label mr-1">Source</span>
              {source.url}
            </div>
          )}
          <p className="text-xs text-muted-foreground pt-2 border-t border-border mt-3">
            Server errors, redirect loops, CDN challenges, and queue systems are infrastructure
            concerns — not UX heuristic violations. Retry once the interface renders, or upload a
            screenshot of the live UI.
          </p>
        </div>
      </div>
    </div>
  );
}
