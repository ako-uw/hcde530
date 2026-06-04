# CritLens

CritLens is an AI-powered heuristic evaluation tool for UX designers and design managers. It analyzes any public website URL or uploaded screenshot and returns a structured findings report based on Nielsen's 10 Usability Heuristics.

## Live Tool
https://critlens-ai-review.lovable.app/

## Who it is for
- UX designers who want to self-check their work before a critique session
- Design managers who review screens for quality and consistency
- Anyone who wants structured, evidence-based feedback on a UI

## How to use it
1. Go to https://critlens-ai-review.lovable.app/
2. Paste a public URL or upload a screenshot (PNG, JPG, WEBP, max 5MB)
3. Click Evaluate
4. Review the findings report with severity ratings and recommendations

## Input types
- **URL** — Fetches and analyzes the page's text and structure. Works on public pages only.
- **Screenshot** — Analyzes the visual layout directly using AI vision. Recommended for mockups, designs, or pages behind login.

## Built with
- Lovable (React frontend)
- Lovable AI Gateway (Gemini)
- Nielsen's 10 Usability Heuristics framework
