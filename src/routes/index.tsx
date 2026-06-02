import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { InputPanel } from "@/components/critlens/InputPanel";
import { ReportView } from "@/components/critlens/ReportView";
import { useCritique } from "@/lib/critique-context";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "CritLens — Heuristic evaluation for designers" },
      {
        name: "description",
        content:
          "Run a heuristic evaluation against Nielsen's ten usability principles. Counts, severities, and evidence tags — no inflated grades.",
      },
    ],
  }),
});

function Index() {
  const { report, isPending, isError, error, runAnalyze, reset } = useCritique();

  return (
    <div>
      <Toaster />
      <div className="mx-auto max-w-5xl space-y-10 px-6 py-10 md:px-10 md:py-16">
        {!report && (
          <section className="border-b border-border pb-10">
            <div className="text-label">Heuristic evaluation</div>
            <h1 className="font-display mt-3 text-[44px] leading-[1.05] tracking-tight md:text-[64px]">
              Read an interface,<br className="hidden md:inline" />
              <span className="italic text-foreground/70">like a practitioner would.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-[1.7] text-foreground/80">
              Paste a URL or drop a screenshot. CritLens walks the interface against
              Nielsen's ten heuristics, tags every finding with the evidence it had,
              and leaves the rest out of scope.
            </p>
          </section>
        )}

        <InputPanel loading={isPending} onAnalyze={runAnalyze} />

        {isPending && (
          <div className="flex items-center gap-3 border border-border bg-card px-5 py-4 text-sm text-foreground/80">
            <Loader2 className="size-4 animate-spin text-foreground/60" />
            <span>
              Reading the interface…{" "}
              <span className="text-muted-foreground">usually 20–40 seconds.</span>
            </span>
          </div>
        )}

        {isError && (
          <div className="border border-[color:var(--sev-4)]/40 bg-[color:var(--sev-4-bg)] px-5 py-4 text-sm text-foreground">
            {error?.message || "Evaluation failed."}
          </div>
        )}

        {report && (
          <ReportView
            report={report}
            onImageSelected={(dataUrl, mimeType) =>
              runAnalyze({ kind: "image", dataUrl, mimeType })
            }
            onNewEvaluation={reset}
          />
        )}
      </div>
    </div>
  );
}
