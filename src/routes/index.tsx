import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Aperture, Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { analyzeDesign } from "@/lib/critique.functions";
import type { CritiqueReport } from "@/lib/critique.types";
import { InputPanel, type AnalysisInput } from "@/components/critlens/InputPanel";
import { ReportView } from "@/components/critlens/ReportView";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "CritLens — AI-powered UX heuristic evaluation" },
      {
        name: "description",
        content:
          "Run faster, structured design reviews. CritLens analyzes a URL or screenshot against Nielsen's 10 usability heuristics.",
      },
    ],
  }),
});

function Index() {
  const analyzeFn = useServerFn(analyzeDesign);
  const [report, setReport] = useState<CritiqueReport | null>(null);

  const mutation = useMutation({
    mutationFn: (input: AnalysisInput) => analyzeFn({ data: input }),
    onSuccess: (data) => setReport(data),
  });

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-5 md:px-8">
          <div className="flex size-9 items-center justify-center rounded-lg bg-foreground text-background">
            <Aperture className="size-5" />
          </div>
          <div>
            <div className="text-base font-semibold tracking-tight">CritLens</div>
            <div className="text-xs text-muted-foreground">
              AI-powered UX critique · Nielsen's 10 heuristics
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-5 py-8 md:px-8 md:py-12">
        {!report && (
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Faster, structured design reviews
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              Paste a URL or upload a screenshot. CritLens runs a heuristic evaluation and
              returns a scored report with prioritized recommendations.
            </p>
          </div>
        )}

        <InputPanel
          loading={mutation.isPending}
          onAnalyze={(input) => {
            setReport(null);
            mutation.mutate(input);
          }}
        />

        {mutation.isPending && (
          <div className="flex items-center gap-3 rounded-xl border bg-card px-5 py-4 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Running heuristic evaluation… this can take 20–40 seconds.
          </div>
        )}

        {mutation.isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
            {(mutation.error as Error).message || "Analysis failed."}
          </div>
        )}

        {report && <ReportView report={report} />}
      </main>
    </div>
  );
}
