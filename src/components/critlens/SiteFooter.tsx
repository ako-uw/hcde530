import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-6 py-8 md:px-10">
        <div className="space-y-1">
          <div className="font-display text-[18px] leading-none">CritLens</div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            A heuristic evaluation tool
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Evaluate
          </Link>
          <Link to="/heuristics" className="hover:text-foreground">
            Heuristics
          </Link>
          <Link to="/methodology" className="hover:text-foreground">
            Methodology
          </Link>
          <a
            href="https://www.nngroup.com/articles/ten-usability-heuristics/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            NNG reference ↗
          </a>
        </nav>
      </div>
    </footer>
  );
}
