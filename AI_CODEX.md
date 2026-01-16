# AI CODEX - Multi-Agent Coordination Protocol

> **Authority**: Supreme
> **Purpose**: Single Source of Truth for AI Collaboration.

All AI models (Gemini, Claude, GPT) working on `hyphae-pos` MUST adhere to this Codex. It defines our shared context, rules, and memory.

## 1. Prime Directives

1.  **Read-First**: You must read `DEV_HANDOFF.md` and `docs/STATUS.md` before taking any action.
2.  **Tasks.md is Law**: Work *only* on tasks listed in `docs/TASKS.md`. If a task is not there, add it first.
3.  **Strict Handoff**: You never finish a session without updating `DEV_HANDOFF.md` for the next agent.
4.  **No Hallucinations**: Do not reference files/skills that do not exist. Verify paths first.

## 2. Project Context (The "What")

*   **Project**: Hyphae POS (Mobile Point of Sale)
*   **Architecture**: React 19, Vite, Tailwind (SHASO Palette), Local-First (SQLite/IndexedDB).
*   **Design**: SHASO (Single Hand Solo Operator) - See `docs/DESIGN_SHASO.md`.
*   **State**: Phase 0 (Stabilization) -> Phase 1 (Testing).

## 3. Tool Use Standards (The "How")

*   **Terminal**: Use `npm run dev` to verify visual changes. Use `npm run build` to verify integrity.
*   **Files**: Always use absolute paths.
*   **Skills**: Check `.agent/skills/` for specialized knowledge.

## 4. Documentation Map

*   `docs/DESIGN_SHASO.md`: UI/UX Truth.
*   `docs/QA_TESTING.md`: Testing Rules.
*   `docs/TASKS.md`: Current Roadmap.
*   `DEV_HANDOFF.md`: The baton pass between agents.

## 5. Conflict Resolution

If a User Request contradicts the Codex:
1.  **Minor**: Prioritize User Request (Flexibility).
2.  **Major** (e.g., "Delete all tests"): Warn User, cite Codex, ask for confirmation.
