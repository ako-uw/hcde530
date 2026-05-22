import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Aperture, Loader2, ArrowDown } from "lucide-react";
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
    <div className="relative min-h-screen bg-background">
      <Toaster />
      <header className="sticky top-0 z-30 border-b border-border/60 backdrop-blur-xl bg-background/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="relative flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_24px_-4px_oklch(0.88_0.21_125_/_0.6)]">
              <Aperture className="size-5" />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="font-display text-2xl leading-none">CritLens</div>
              <span className="font-mono-label text-muted-foreground hidden sm:inline">v1.0</span>
            </div>
          </div>
          <nav className="hidden items-center gap-6 md:flex font-mono-label text-muted-foreground">
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#heuristics" className="hover:text-foreground transition-colors">Heuristics</a>
            <a
              href="https://www.nngroup.com/articles/ten-usability-heuristics/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Nielsen ↗
            </a>
          </nav>
        </div>
      </header>

      {!report && (
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 grid-bg opacity-60" />
          <div className="absolute -top-40 right-[-10%] size-[520px] rounded-full bg-primary/20 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-10 md:px-8 md:pt-24 md:pb-16">
            <div className="font-mono-label text-primary">
              ◐ AI heuristic evaluation
            </div>
            <h1 className="mt-5 font-display text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
              Design reviews,
              <br />
              <span className="italic text-primary">scored in seconds.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
              Paste a URL or drop a screenshot. CritLens runs a senior‑level critique against
              Nielsen's 10 usability heuristics and returns a prioritized, exportable report.
            </p>
            <div className="mt-8 flex items-center gap-3 font-mono-label text-muted-foreground">
              <ArrowDown className="size-3.5 text-primary" />
              Start an evaluation below
            </div>
          </div>
        </section>
      )}

      <main className="mx-auto max-w-6xl space-y-10 px-5 py-10 md:px-8 md:py-14">
        <InputPanel
          loading={mutation.isPending}
          onAnalyze={(input) => {
            setReport(null);
            mutation.mutate(input);
          }}
        />

        {mutation.isPending && (
          <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 px-5 py-4 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-primary" />
            Running heuristic evaluation… this can take 20–40 seconds.
          </div>
        )}

        {mutation.isError && (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/10 px-5 py-4 text-sm text-destructive-foreground">
            {(mutation.error as Error).message || "Analysis failed."}
          </div>
        )}

        {report && <ReportView report={report} />}

        {!report && !mutation.isPending && <HowItWorks />}
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-6 md:px-8 font-mono-label text-muted-foreground">
          <span>© CritLens — UX critique, automated.</span>
          <span>Powered by Claude · Nielsen's 10 Heuristics</span>
        </div>
      </footer>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Submit", d: "Drop a URL or screenshot of any interface." },
    { n: "02", t: "Evaluate", d: "Claude inspects your UI as a senior UX expert." },
    { n: "03", t: "Score", d: "Get prioritized issues and an exportable report." },
  ];
  return (
    <section id="how" className="space-y-8 pt-6">
      <div className="flex items-end justify-between gap-4 border-b border-border/60 pb-4">
        <h2 className="font-display text-3xl md:text-4xl">How it works</h2>
        <span className="font-mono-label text-muted-foreground">/ process</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <div
            key={s.n}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 transition-colors hover:border-primary/50"
          >
            <div className="font-mono-label text-primary">{s.n}</div>
            <div className="mt-3 font-display text-2xl">{s.t}</div>
            <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            <div className="pointer-events-none absolute -bottom-12 -right-12 size-32 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  );
}
