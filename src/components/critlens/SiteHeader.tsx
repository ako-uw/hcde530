import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useCritique } from "@/lib/critique-context";
import { ArrowRight } from "lucide-react";

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
    <header className="sticky top-0 z-30 border-b-2 border-[color:var(--border-strong)] bg-[color:var(--background)]/90 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 py-4 md:px-10">
        {/* Left: wordmark lockup */}
        <Link
          to="/"
          onClick={() => reset()}
          className="group flex items-center gap-3 justify-self-start"
          aria-label="CritLens — home"
        >
          <span
            aria-hidden
            className="grid size-8 place-items-center bg-[color:var(--foreground)] text-[color:var(--background)] font-display text-[16px] leading-none"
          >
            C
          </span>
          <span className="flex items-baseline gap-2">
            <span className="font-display text-[22px] font-bold leading-none tracking-tight text-foreground">
              CritLens
            </span>
            <span className="hidden font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:inline">
              · Issue 01
            </span>
          </span>
        </Link>

        {/* Center: navigation */}
        <nav className="hidden items-center gap-1 justify-self-center md:flex">
          <NavLink to="/" active={pathname === "/"}>Evaluate</NavLink>
          <NavLink to="/heuristics" active={pathname.startsWith("/heuristics")}>Heuristics</NavLink>
          <NavLink to="/methodology" active={pathname.startsWith("/methodology")}>Methodology</NavLink>
        </nav>

        {/* Right: conditional CTA */}
        <div className="flex items-center justify-end gap-3 justify-self-end">
          {report ? (
            <button
              onClick={newEvaluation}
              className="group inline-flex h-10 cursor-pointer items-center gap-2 border-2 border-[color:var(--border-strong)] bg-[color:var(--foreground)] px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--background)] shadow-[3px_3px_0_0_var(--border-strong)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_var(--border-strong)]"
            >
              New evaluation
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <span className="hidden font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:inline">
              Nielsen · NN/g 10
            </span>
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
      className={`relative px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors hover:text-foreground ${
        active ? "text-foreground" : "text-muted-foreground"
      }`}
    >
      {children}
      {active && (
        <span
          aria-hidden
          className="absolute inset-x-3 -bottom-[17px] h-[2px] bg-[color:var(--primary)]"
        />
      )}
    </Link>
  );
}
