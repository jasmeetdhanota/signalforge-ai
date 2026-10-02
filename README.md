# SignalForge AI

SignalForge AI is an AI-first feature intelligence system designed to help
product teams turn unstructured customer feedback into clearer, explainable
product decisions.

Instead of treating feature requests as isolated tickets, SignalForge is being
designed to identify the underlying customer need, connect related requests,
surface recurring themes, and provide explainable prioritization signals for
product teams.

> This repository is currently under active development as part of a technical
> assessment.

## Planned Workflow

1. Capture customer feature requests.
2. Discover and support existing requests.
3. Use AI to identify the underlying customer need.
4. Connect semantically related requests and recurring themes.
5. Generate explainable impact and prioritization insights.
6. Keep final product decisions with the human product team.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase / PostgreSQL
- Google Gemini API
- Vercel
- Git & GitHub

## AI-Assisted Development

ChatGPT is being used as the primary AI-assisted development tool for this
project.

Development instructions and AI collaboration are documented in
`prompts.txt`, with persistent project guidance maintained in `AGENTS.md`.

AI-generated changes are reviewed and tested by the developer before being
committed.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Project Status

The application foundation is complete. Core feature-request workflows,
persistence, and AI-powered feature intelligence will be implemented in
subsequent development stages.
