# Project Rules

## Prompt Logging

Every time you receive a new instruction or prompt, append it to prompts.txt in the project root with a timestamp (ISO 8601) and a brief summary of what you did in response. Create the file if it doesn't exist. Keep this log updated throughout all sessions.

---

# SignalForge AI — AI Development Instructions

## AI Tool

This project uses ChatGPT as the primary AI-assisted development tool.

ChatGPT may assist with architecture, implementation, debugging, testing, documentation, and technical reasoning. All AI-assisted changes must be reviewed and tested by the developer before they are committed.

## Engineering Principles

- Write clear, maintainable, production-quality code.
- Prefer simple solutions over unnecessary complexity.
- Keep AI-generated recommendations explainable.
- Clearly separate AI recommendations from human decisions.
- Never expose or commit secrets, API keys, or credentials.
- Handle loading, error, and empty states appropriately.
- Maintain accessibility and responsive design.
- Document important architectural decisions and technical tradeoffs.
- Avoid adding unnecessary dependencies or abstractions.
- Keep implementation decisions aligned with the assessment requirements.

## Git Workflow

- Never develop features directly on `main`.
- Use focused branches for meaningful units of work.
- Use Conventional Commit-style commit messages.
- Keep commits small, understandable, and logically grouped.
- Do not commit secrets, environment files, or generated credentials.
- Update relevant documentation when architecture or application behavior changes.
- Keep Git history clear enough for a reviewer to understand how the project evolved.

## Git Safety

Never automatically commit or push code.

All AI-generated changes must be reviewed and tested by the developer before they are committed.

After making code changes:

1. Stop and summarize what changed.
2. Provide the steps or commands needed to test the changes.
3. Wait for the developer to verify that the implementation works correctly.
4. Review `git status` and `git diff` before staging changes.
5. Only proceed with staging, committing, pushing, merging, or creating a pull
   request after explicit developer approval.

Do not run `git add`, `git commit`, `git push`, merge branches, or create pull requests unless the developer explicitly requests it.
