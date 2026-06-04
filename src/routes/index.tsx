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
      <div className="mx-auto max-w-6xl space-y-12 px-6 py-10 md:px-10 md:py-16">
        {!report && (
          <section className="border-b-2 border-[color:var(--border-strong)] pb-10 md:pb-14">
            <h1 className="font-display text-[42px] font-bold leading-[1.05] tracking-[-0.03em] text-foreground md:text-[72px]">
              Read an interface.<br className="hidden md:block" />{" "}
              <span className="text-[color:var(--primary)]">Like a practitioner would.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-[1.55] text-foreground/70 md:text-[17px]">
              CritLens runs a structured heuristic evaluation against Nielsen's 10
              principles and returns a prioritized findings report.
            </p>
          </section>
        )}

        <InputPanel loading={isPending} onAnalyze={runAnalyze} />

        {isPending && (
          <div className="flex items-center gap-3 border-2 border-[color:var(--border-strong)] bg-[color:var(--card)] px-5 py-4 text-sm text-foreground/85 shadow-[3px_3px_0_0_var(--border-strong)]">
            <Loader2 className="size-4 animate-spin text-[color:var(--primary)]" />
            <span>
              Reading the interface…{" "}
              <span className="text-muted-foreground">usually 20–40 seconds.</span>
            </span>
          </div>
        )}

        {isError && (
          <div className="cl-slide-in border-l-[6px] border-[color:var(--severity-s4)] border-y border-r border-[color:var(--border-strong)] bg-[color:var(--sev-4-bg)] px-5 py-4 text-sm text-foreground">
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
