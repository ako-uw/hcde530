# Mini Project 2 — Competency Claim

## C1 — Vibecoding and Rapid Prototyping
I built and deployed CritLens using Lovable from a structured, detailed prompt that specified the UI layout, report format, scoring system, severity badges, and AI integration in a single declaration. The first version returned mock data — I caught this and attempted to connect the Anthropic Claude API directly, but ran into credit limitations. I switched to Lovable's built-in AI gateway running Gemini, which worked without an external key. I iterated through at least six versions: fixing the input panel to be mutually exclusive tabs, adding a 3-step stepper, adding a hero section, and refining the methodology page. The deployed app is at https://critlens-ai-review.lovable.app/

## C7 — Critical Evaluation and Professional Judgment
The most significant judgment call in this project was discovering that the AI was assigning scores to heuristics it could not actually observe — H9 and H10 were getting 10/10 not because the interface was perfect but because the AI had no evidence either way. I added 5 integrity rules to prevent fabricated scores, replaced the overall numeric score with a stats panel showing counts and severity distribution, and added evidence tags (Observed, Partial, Out of scope) to every finding. This distinction between code that runs and output that is trustworthy is the core of what C7 means.

## C8 — Building and Deploying a Complete Tool
CritLens is deployed at a public URL, accepts real input, and returns real AI-powered heuristic evaluation reports. The tool went through multiple scoping decisions including descoping complex input types to focus on URL and screenshot for feasibility. The biggest technical challenge was that URL analysis fetches HTML text only — the AI never sees the visual layout — which limits accuracy for visual design issues. I documented this limitation in the Methodology page rather than hiding it.
