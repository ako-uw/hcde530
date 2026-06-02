import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useCritique } from "@/lib/critique-context";

export function SiteHeader() {
  const navigate = useNavigate();
  const { report, reset } = useCritique();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  function newEvaluation(e?: React.MouseEvent) {
    e?.preventDefault();
    reset();
    if (pathname !== "/") navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 md:px-10">
        <Link
          to="/"
          onClick={() => reset()}
          className="group flex items-baseline gap-2.5"
          aria-label="CritLens — home"
        >
          <span className="font-display text-[22px] leading-none tracking-tight text-foreground">
            CritLens
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Heuristic eval
          </span>
        </Link>

        <nav className="hidden items-center gap-7 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground md:flex">
          <NavLink to="/" active={pathname === "/"}>
            Evaluate
          </NavLink>
          <NavLink to="/heuristics" active={pathname.startsWith("/heuristics")}>
            Heuristics
          </NavLink>
          <NavLink to="/methodology" active={pathname.startsWith("/methodology")}>
            Methodology
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {report && (
            <button
              onClick={newEvaluation}
              className="inline-flex h-9 cursor-pointer items-center rounded-none border border-foreground bg-foreground px-4 font-mono text-[11px] uppercase tracking-[0.14em] text-background transition-colors hover:bg-background hover:text-foreground"
            >
              New evaluation
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({
  to,
  active,
  children,
}: {
  to: "/" | "/heuristics" | "/methodology";
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`transition-colors hover:text-foreground ${active ? "text-foreground" : ""}`}
    >
      {children}
    </Link>
  );
}
