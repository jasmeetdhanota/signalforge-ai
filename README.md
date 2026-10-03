# SignalForge AI

SignalForge AI is an AI-first feature intelligence system that helps product
teams turn unstructured customer feature requests into clearer, explainable
product decisions.

Instead of treating each feature request as an isolated ticket, SignalForge
captures customer signals, identifies the underlying need, connects related
requests, surfaces recurring patterns, and provides transparent prioritization
recommendations while keeping final product decisions with the human product
team.

## Product Overview

Product teams often receive feature requests through different channels and in
different language. Two customers may describe the same underlying problem in
completely different ways, making manual triage, grouping, and prioritization
slow and inconsistent.

SignalForge AI creates a workflow from raw customer feedback to product decision
support:

1. Capture a feature request.
2. Discover and search existing customer requests.
3. Express customer interest through support signals.
4. Use AI to identify the underlying customer need.
5. Suggest a relevant product theme.
6. Connect semantically related requests.
7. Combine customer and AI signals into an explainable priority recommendation.
8. Leave the final product decision with the human product team.

## Key Features

### Feature Request Management

Users can:

- Submit feature requests with a title and description.
- Browse existing customer requests.
- Search requests before submitting a new one.
- Filter requests by product status and trending signals.
- Express support for requests.
- See related-request counts and customer support signals.

### AI-Powered Feature Intelligence

After a new request is saved, SignalForge uses Google Gemini to analyze the
request in the context of existing customer feedback.

The AI produces:

- An underlying customer need.
- A suggested product theme.
- Concise reasoning for its interpretation.
- A confidence value.
- Semantically related existing requests.

AI analysis is stored separately from the original customer-submitted request so
that customer input and AI interpretation remain distinguishable.

### Explainable Prioritization

SignalForge converts existing product signals into decision support using a
transparent deterministic prioritization layer.

The recommendation considers:

- **Customer demand** — support associated with the request.
- **Recurring need** — the number of related customer requests.
- **AI confidence** — confidence in the request analysis.

These signals produce a **High**, **Medium**, or **Low** recommended priority.

The application intentionally avoids presenting an unexplained AI-generated
priority score. Product strategy, engineering effort, risk, business context,
and the final prioritization decision remain human responsibilities.

## AI-First Workflow

```text
Customer feature request
        |
        v
Persist request in Supabase
        |
        v
Gemini request analysis
        |
        +----> Underlying customer need
        |
        +----> Suggested product theme
        |
        +----> Related requests
        |
        +----> Reasoning + confidence
        |
        v
Persist AI intelligence
        |
        v
Transparent prioritization rules
        |
        v
Priority recommendation
        |
        v
Human product review and decision
```

The purpose of AI in SignalForge is not to replace product judgment. It reduces
the manual work required to interpret large amounts of qualitative feedback and
helps product teams see relationships that may be difficult to identify when
requests are reviewed individually.

## Architecture

SignalForge uses a lightweight full-stack architecture:

```text
Next.js / React UI
        |
        +----> Supabase client
        |         |
        |         v
        |     PostgreSQL
        |
        +----> Next.js API route
                  |
                  v
             Google Gemini
                  |
                  v
             Supabase
```

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS

The frontend handles request discovery, search, filtering, submission, support
interaction, AI intelligence presentation, and decision-support presentation.

### Data Layer

Supabase/PostgreSQL stores:

- Feature requests.
- AI-generated request analyses.
- Relationships between requests.

Row Level Security policies separate public application access from privileged
server-side AI persistence.

### AI Layer

The server-side AI workflow uses the Google GenAI SDK and Gemini.

The model receives the newly submitted request together with existing request
context and returns structured intelligence containing the customer need,
suggested theme, reasoning, confidence, and related requests.

Model calls include retry handling and model fallback for temporary or
retryable failures. A feature request remains saved even if AI analysis is
temporarily unavailable.

### Prioritization Layer

Prioritization is deliberately implemented separately from the generative AI
call.

A deterministic rules-based layer combines persisted customer demand,
related-request recurrence, and AI confidence. This makes the recommendation
inspectable and prevents the model from autonomously controlling product
priority.

## Human Judgment Boundary

SignalForge separates three types of information:

1. **Customer input** — the original request and support signals.
2. **AI interpretation** — customer need, suggested theme, relationships,
   reasoning, and confidence.
3. **Decision support** — a transparent recommendation derived from available
   signals.

The system does not automatically change a request's product status or make a
final roadmap decision.

Human product teams remain responsible for considering factors such as:

- Product strategy.
- Engineering complexity.
- Delivery effort.
- Business value.
- Risk.
- Dependencies.
- Organizational priorities.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase / PostgreSQL
- Google Gemini via `@google/genai`
- Git & GitHub

## Project Structure

```text
src/
  app/
    api/
      analyze-request/
        route.ts
    layout.tsx
    page.tsx
  components/
    app-header.tsx
    request-card.tsx
    request-filters.tsx
    request-search.tsx
    submit-request-modal.tsx
  lib/
    ai/
      gemini.ts
    supabase/
      client.ts
      requests.ts
      server.ts
    prioritization.ts
  types/
    request.ts

supabase/
  migrations/
  seed.sql

AGENTS.md
prompts.txt
```

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd signalforge-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the provided environment template:

```bash
cp .env.example .env.local
```

Configure the following values in `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
GEMINI_API_KEY
```

Real environment values and API credentials must never be committed to source
control.

### 4. Configure Supabase

Create a Supabase project and run the SQL migrations in `supabase/migrations/`
in order.

Optional demonstration data is available in:

```text
supabase/seed.sql
```

### 5. Start the application

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Database Model

SignalForge currently uses three primary data concepts.

### Feature Requests

Stores the original customer-submitted request, product theme, workflow status,
support count, and submission timestamp.

### Request Analyses

Stores AI-derived intelligence for a request, including:

- Underlying customer need.
- Suggested theme.
- AI reasoning.
- Confidence.

### Request Relationships

Stores AI-detected relationships between feature requests together with
relationship reasoning and confidence.

Keeping AI intelligence separate from customer-submitted data makes the source
of each signal explicit.

## Resilience and Failure Handling

The AI workflow is designed so that generative AI is an enhancement rather than
a dependency for capturing customer feedback.

If AI analysis fails temporarily:

- The original feature request remains persisted.
- The API reports that analysis is unavailable.
- Existing customer data remains usable.
- Retry and model-fallback logic handles retryable model failures.

This prevents a temporary AI-provider issue from blocking the core feature
request workflow.

## AI-Assisted Development

ChatGPT was used as the primary AI-assisted development tool throughout the
project.

AI assistance was used for tasks including:

- Architecture exploration.
- Implementation planning.
- Code generation and refinement.
- Debugging.
- Database and AI integration.
- UX wording and accessibility review.
- Documentation and validation planning.

Persistent AI-development guidance is maintained in `AGENTS.md`.

Meaningful development prompts and response summaries are documented
chronologically in `prompts.txt`.

AI-generated changes were reviewed and tested by the developer before being
committed. Git staging, commits, pushes, pull requests, and merges remained
developer-controlled.

## Proposed Success Metrics

If SignalForge were evaluated in a production product organization, useful
success metrics would include:

1. **Time to triage**

   Median time between feature-request submission and an actionable product
   triage recommendation.

2. **Related-request discovery rate**

   Percentage of incoming requests successfully connected to relevant existing
   customer needs, helping reduce duplicate manual triage.

3. **Recommendation usefulness**

   Percentage of AI-assisted theme and priority recommendations accepted or
   minimally adjusted by product reviewers.

These are proposed product metrics rather than measured results from this
assessment implementation.

## Current Tradeoffs and Limitations

SignalForge is intentionally scoped as a focused technical-assessment
implementation.

Current tradeoffs include:

- Support interactions are demonstrated in the client experience and are not
  persisted as individual user votes.
- Request relationships are currently stored directionally.
- AI analysis is triggered through an application API route rather than a
  background job queue.
- AI analysis and relationship persistence are not handled as one database
  transaction.
- Prioritization uses intentionally simple and explainable thresholds rather
  than a learned ranking model.
- The AI-analysis endpoint would require additional authentication, rate
  limiting, and abuse protection before production use.
- Production observability, background processing, and organization-level
  access controls are outside the current scope.

These choices keep the assessment focused on the product workflow, explainable
AI integration, and architectural reasoning without hiding important production
considerations.

## Validation

The project is validated through:

```bash
npm run lint
npm run build
```

The application also includes explicit loading, error, and empty states and is
designed to remain usable across desktop and smaller viewport sizes.

## Development Approach

Development was organized into focused feature branches and pull requests,
covering:

1. Application foundation.
2. Feature request management.
3. Supabase persistence.
4. AI request intelligence.
5. Explainable prioritization.
6. Final polish and submission readiness.

This structure keeps implementation changes reviewable and documents how the
system evolved from the initial product workflow into the final AI-assisted
decision-support experience.
