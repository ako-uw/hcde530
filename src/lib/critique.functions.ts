import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  ClaudeResponseSchema,
  type CritiqueReport,
  type HeuristicScore,
  type Issue,
} from "./critique.types";
import { HEURISTICS, SEVERITY_DEDUCTION, SEVERITY_SCORE_CAP } from "./heuristics";

const InputSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("url"), url: z.string().url() }),
  z.object({
    kind: z.literal("image"),
    dataUrl: z.string().min(1),
    mimeType: z.string().regex(/^image\/(png|jpeg|jpg|webp|gif)$/),
  }),
]);

const SYSTEM_PROMPT = `You are a senior UX expert performing a formal Nielsen heuristic evaluation. You apply strict integrity rules.

Nielsen's 10 Heuristics:
1. Visibility of system status
2. Match between system and the real world
3. User control and freedom
4. Consistency and standards
5. Error prevention
6. Recognition rather than recall
7. Flexibility and efficiency of use
8. Aesthetic and minimalist design
9. Help users recognize, diagnose, and recover from errors
10. Help and documentation

INTEGRITY RULES — apply strictly:

Rule 1 — Page-load verification. If the only observable content is an error page, waiting room, queue, CDN/bot-check, redirect loop, 4xx/5xx, "Just a moment", "Checking your browser", "Access denied", or similar infrastructure state, DO NOT produce a heuristic report. Instead return:
{ "blocked": true, "reason": "<one short sentence naming the specific error>" }

Rule 2 — Evidence tags (mandatory). Every issue and every heuristic must carry an evidence tag:
- "Observed" — the element was directly visible in the loaded interface.
- "Partial" — the heuristic was partially assessable from available content.
- "Out of scope" — requires live interaction, multi-step flows, error triggering, or dynamic states not available in this evaluation pass.
A heuristic tagged "Out of scope" gets no score and is excluded from the average. Never assert perfection for what you did not observe — absence of evidence is not evidence of absence.

Rule 3 — Score/finding consistency. A heuristic with an active finding is capped by the most severe finding: S4 → max 5.0, S3 → max 6.5, S2 → max 7.5, S1 → max 8.5. If you list a finding under a heuristic, the evidence must reflect a real violation.

Rule 4 — Infrastructure vs UX separation. Server errors, redirects, CDN behavior, queue/waiting-room systems, session tokens, URL parameters are INFRASTRUCTURE — never map them to NNG heuristics. If that's all you can see, return blocked per Rule 1.

For each issue:
- heuristic (1–10), title, description (what is wrong and why), location (plain-language where on the page), severity 0–4 (0 cosmetic, 1 minor, 2 moderate, 3 major, 4 catastrophic), recommendation (concrete fix), evidence ("Observed" | "Partial" | "Out of scope").

Return STRICT JSON ONLY (no markdown fences, no prose). Either the blocked shape above, or:
{
  "blocked": false,
  "summary": "2-3 sentence overall summary grounded ONLY in what was observed",
  "issues": [ { "heuristic": 1, "title": "...", "description": "...", "location": "...", "severity": 2, "recommendation": "...", "evidence": "Observed" } ],
  "heuristicEvaluations": [ { "id": 1, "evidence": "Observed" }, { "id": 2, "evidence": "Out of scope", "note": "no system-language content visible" } ]
}

Include all 10 heuristics in heuristicEvaluations. Be honest: when in doubt, mark "Partial" or "Out of scope" rather than inflating.`;

type FetchResult = { ok: true; text: string } | { ok: false; reason: string };

const BLOCK_PATTERNS: { rx: RegExp; reason: string }[] = [
  { rx: /just a moment/i, reason: "Cloudflare bot-check interstitial ('Just a moment…')" },
  { rx: /checking your browser/i, reason: "Bot-protection challenge page" },
  { rx: /attention required.*cloudflare/i, reason: "Cloudflare 'Attention Required' challenge" },
  { rx: /access denied/i, reason: "Access denied page" },
  { rx: /you are in (a )?queue|virtual waiting room|queue-it/i, reason: "Virtual waiting room / queue" },
  { rx: /enable javascript.*continue/i, reason: "JavaScript-required gate; no static UI content" },
  { rx: /<title>\s*(403|404|500|502|503|504)/i, reason: "HTTP error page returned as content" },
];

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

async function fetchViaProxyOnce(url: string): Promise<FetchResult> {
  try {
    const proxied = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res = await fetch(proxied, {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "application/json,text/html;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });
    if (!res.ok) {
      return { ok: false, reason: `Proxy responded ${res.status} ${res.statusText || ""}`.trim() };
    }
    const payload = (await res.json()) as { contents?: string; status?: { http_code?: number } };
    const httpCode = payload.status?.http_code ?? 200;
    if (httpCode >= 400) {
      return { ok: false, reason: `Origin returned HTTP ${httpCode}` };
    }
    const html = payload.contents ?? "";
    const cleaned = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    for (const { rx, reason } of BLOCK_PATTERNS) {
      if (rx.test(html) || rx.test(cleaned)) return { ok: false, reason };
    }
    if (cleaned.length < 500) {
      return { ok: false, reason: "Fetched page returned almost no readable content" };
    }
    return { ok: true, text: cleaned.slice(0, 12000) };
  } catch (e) {
    return { ok: false, reason: `Network error: ${(e as Error).message}` };
  }
}

async function fetchUrlText(url: string): Promise<FetchResult> {
  const first = await fetchViaProxyOnce(url);
  if (first.ok) return first;
  await new Promise((r) => setTimeout(r, 2000));
  const second = await fetchViaProxyOnce(url);
  return second;
}

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fence) return JSON.parse(fence[1].trim());
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end > start) return JSON.parse(trimmed.slice(start, end + 1));
    throw new Error("Model did not return JSON");
  }
}

function computeReport(
  parsed: z.infer<typeof ClaudeResponseSchema>,
  source: { kind: "url"; url: string } | { kind: "image" },
): CritiqueReport {
  if ("blocked" in parsed && parsed.blocked === true) {
    return { blocked: true, reason: parsed.reason, source };
  }
  const ok = parsed as Extract<typeof parsed, { summary: string }>;
  const issues: Issue[] = ok.issues;
  const evalMap = new Map(ok.heuristicEvaluations?.map((e) => [e.id, e]) ?? []);

  const heuristicScores: HeuristicScore[] = HEURISTICS.map((h) => {
    const its = issues.filter((i) => i.heuristic === h.id);
    const deductions = its.map((i) => ({ severity: i.severity, title: i.title }));
    const evalEntry = evalMap.get(h.id);
    let evidence: HeuristicScore["evidence"];
    if (evalEntry) evidence = evalEntry.evidence;
    else if (its.length > 0) evidence = its.some((i) => i.evidence === "Observed") ? "Observed" : "Partial";
    else evidence = "Out of scope";

    if (evidence === "Out of scope") {
      return {
        id: h.id,
        name: h.name,
        score: null,
        evidence,
        note: evalEntry?.note ?? "Insufficient observable evidence in the loaded interface.",
        deductions,
      };
    }
    const totalDed = its.reduce((s, i) => s + (SEVERITY_DEDUCTION[i.severity] ?? 0), 0);
    let score = Math.max(0, Math.min(10, 10 - totalDed));
    // Rule 3 — tightened: cap by the most severe finding under this heuristic.
    if (its.length > 0) {
      const maxSev = its.reduce((m, i) => Math.max(m, i.severity), 0);
      const cap = SEVERITY_SCORE_CAP[maxSev] ?? 7.5;
      if (score > cap) score = cap;
    }
    return {
      id: h.id,
      name: h.name,
      score: Math.round(score * 10) / 10,
      evidence,
      note: evalEntry?.note,
      deductions,
    };
  });

  const scored = heuristicScores.filter(
    (h): h is HeuristicScore & { score: number } => h.score !== null,
  );
  const overall = scored.length === 0 ? 0 : scored.reduce((s, h) => s + h.score, 0) / scored.length;
  const topPriorities = [...issues].sort((a, b) => b.severity - a.severity).slice(0, 3);

  return {
    blocked: false,
    summary: ok.summary,
    issues,
    heuristicScores,
    overallScore: Math.round(overall * 10) / 10,
    scoredCount: scored.length,
    topPriorities,
    source,
  };
}

type UserContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

async function callAI(content: UserContentPart[]): Promise<string> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 429) throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in Settings > Workspace > Usage.");
    throw new Error(`AI gateway ${res.status}: ${errText.slice(0, 500)}`);
  }

  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = json.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from AI gateway");
  return text;
}

export const analyzeDesign = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<CritiqueReport> => {
    let content: UserContentPart[];
    let source: { kind: "url"; url: string } | { kind: "image" };

    if (data.kind === "url") {
      const fetched = await fetchUrlText(data.url);
      if (!fetched.ok) {
        return {
          blocked: true,
          kind: "fetch_failed",
          reason: fetched.reason,
          source: { kind: "url", url: data.url },
        };
      }
      content = [
        {
          type: "text",
          text: `Evaluate the UX of this web page following the integrity rules.\n\nURL: ${data.url}\n\nExtracted text content from the page:\n${fetched.text}\n\nReturn strict JSON.`,
        },
      ];
      source = { kind: "url", url: data.url };
    } else {
      content = [
        { type: "image_url", image_url: { url: data.dataUrl } },
        {
          type: "text",
          text: "Evaluate the UX of this design screenshot following the integrity rules. Return strict JSON.",
        },
      ];
      source = { kind: "image" };
    }

    const raw = await callAI(content);
    const parsed = ClaudeResponseSchema.parse(extractJson(raw));
    return computeReport(parsed, source);
  });
