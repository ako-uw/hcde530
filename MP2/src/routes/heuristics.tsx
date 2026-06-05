import { createFileRoute } from "@tanstack/react-router";
import { HEURISTIC_DEFINITIONS } from "@/lib/heuristic-definitions";

export const Route = createFileRoute("/heuristics")({
  component: HeuristicsPage,
  head: () => ({
    meta: [
      { title: "Heuristics — CritLens" },
      {
        name: "description",
        content:
          "The ten usability heuristics by Jakob Nielsen, with the full definitions used by CritLens during evaluation.",
      },
      { property: "og:title", content: "Heuristics — CritLens" },
      {
        property: "og:description",
        content:
          "The ten usability heuristics by Jakob Nielsen, with full NNG definitions.",
      },
    ],
  }),
});

function HeuristicsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-20">
      <header className="mb-12 border-b border-border pb-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Reference
        </div>
        <h1 className="font-display mt-2 text-[44px] leading-[1.05] tracking-tight md:text-[56px]">
          The ten heuristics
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.75] text-muted-foreground">
          Jakob Nielsen's ten general principles for interaction design. CritLens
          uses these as the evaluation rubric. Definitions are adapted from the
          Nielsen Norman Group's{" "}
          <a
            href="https://www.nngroup.com/articles/ten-usability-heuristics/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
          >
            original article
          </a>
          .
        </p>
      </header>

      <ol className="space-y-12">
        {HEURISTIC_DEFINITIONS.map((h) => (
          <li key={h.id} className="grid grid-cols-[3.5rem_1fr] gap-6">
            <div className="font-display text-[34px] leading-none text-foreground/30 tabular-nums">
              {String(h.id).padStart(2, "0")}
            </div>
            <div>
              <h2 className="font-display text-[24px] leading-tight">{h.name}</h2>
              <p className="mt-3 text-[15px] leading-[1.75] text-foreground/90">
                {h.summary}
              </p>
              <p className="mt-3 text-[14px] leading-[1.75] text-muted-foreground">
                {h.details}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
