# CritLens — Plan

An AI-powered UX critique tool that runs Nielsen heuristic evaluations on a URL or screenshot using Claude.

## Stack & services

- **Frontend**: React (TanStack Start), Tailwind + shadcn/ui
- **Backend**: TanStack server function (`src/lib/critique.functions.ts`) — keeps the Claude API key server-side
- **AI**: Anthropic Claude API (`claude-sonnet-4-5`) directly via REST — user explicitly requested Claude. Requires `ANTHROPIC_API_KEY` secret.
- **URL fetching**: Firecrawl connector (scrape → markdown + screenshot) for rich URL analysis. Falls back gracefully if not connected.

## User flow

1. Header: lens icon + "CritLens" wordmark, subtitle.
2. Input card with two tabs:
   - **Enter URL** — text input + Analyze
   - **Upload Screenshot** — drag/drop or file picker (PNG/JPG, ≤5MB), preview thumbnail
3. Click **Analyze** → loading state with progress hints ("Fetching page…", "Running heuristic evaluation…")
4. Report appears below.

## Report layout

- **Score hero**: large number /10, circular progress ring, color (green ≥8, yellow 6–8, red <6)
- **Overall summary**: 2–3 sentence paragraph
- **Scoring breakdown**: collapsible table — each of Nielsen's 10 heuristics with starting 10, deductions list, final score
- **Top 3 priorities**: highlighted cards, sorted by severity desc
- **All issues**: grouped by heuristic, each with: heuristic name, description, location (plain language), severity badge (0 gray / 1 blue / 2 yellow / 3 orange / 4 red), recommendation
- **Actions**: Copy as Markdown, Export JSON

## Backend logic (`analyzeDesign` server function)

Input: `{ kind: "url", url } | { kind: "image", dataUrl, mimeType }`

1. If URL + Firecrawl available → scrape markdown + screenshot, send both (text + image) to Claude.
2. If URL + no Firecrawl → send URL + fetched HTML text only.
3. If image → send image directly to Claude vision.
4. System prompt: senior UX expert performing formal Nielsen heuristic evaluation. Must return strict JSON matching schema.
5. Use Claude's JSON output (response_format-style via prompt + parse). Validate with Zod.
6. Server computes scores deterministically from issues (10 − Σ deductions per heuristic; average across 10). Don't trust model arithmetic.

### JSON schema returned to client

```ts
{
  summary: string,
  issues: Array<{
    heuristic: 1..10,           // Nielsen heuristic number
    title: string,
    description: string,
    location: string,
    severity: 0..4,
    recommendation: string,
  }>,
  heuristicScores: Array<{ id, name, score, deductions: Array<{severity, title}> }>,
  overallScore: number,         // 0..10, one decimal
  topPriorities: Issue[]        // top 3
}
```

## File plan

- `src/routes/index.tsx` — main page (input + report)
- `src/components/critlens/Header.tsx`
- `src/components/critlens/InputPanel.tsx` (tabs, URL input, image upload)
- `src/components/critlens/ReportView.tsx`
- `src/components/critlens/ScoreHero.tsx`
- `src/components/critlens/HeuristicBreakdown.tsx`
- `src/components/critlens/IssueCard.tsx`, `SeverityBadge.tsx`, `PriorityList.tsx`
- `src/lib/critique.functions.ts` — `analyzeDesign` server function
- `src/lib/critique.server.ts` — Claude client + Firecrawl call + scoring
- `src/lib/heuristics.ts` — shared constants (10 heuristics, severity deductions)
- `src/lib/critique.types.ts` — Zod schema + TS types

## Secrets / connectors required

- `ANTHROPIC_API_KEY` (via `add_secret` after you confirm)
- Firecrawl connector (optional but recommended for URL mode) — I'll prompt to connect

## Open questions

1. Confirm using **Anthropic Claude directly** (needs your API key) vs Lovable AI gateway (no key needed, supports Gemini/GPT, no Claude). You asked for Claude, so I'll proceed with Anthropic + ask for the key.
2. OK to add **Firecrawl** for URL scraping (best results)? If you skip, URL mode will use a basic fetch and be less accurate on JS-heavy pages.
3. Persistence — keep results in-page only (no DB), or save history (would enable Lovable Cloud)? Default: in-page only.
