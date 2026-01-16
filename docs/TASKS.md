# Hyphae POS - Task List (Phase 0 & 1)

> **Status**: Active
> **Phase**: 1 - Testing & Quality Assurance
> **Objective**: Convert prototype to production-grade application

## Phase 0: Stabilization (Build & Style System)
1. [x] **Remove CDN Dependencies**: Delete `<script src="...">` for Tailwind and React from `index.html`.
2. [x] **Install Styling Engine**: Run `npm install -D tailwindcss postcss autoprefixer`.
3. [x] **Initialize Configuration**: Generate `tailwind.config.js` and `postcss.config.js`.
4. [x] **Implement SHASO Palette**: Port the "Abyssal" color tokens (Ink/Jet/Teal) into `tailwind.config.js`.
5. [x] **Create CSS Entry Point**: Create `src/index.css` with standard `@tailwind` directives.
6. [x] **Bind Styles**: Import `index.css` into `src/index.tsx` (or `main.tsx`).
7. [x] **Cleanup HTML**: Remove Import Maps and legacy CSS hacks from `index.html`.
8. [x] **Verify Dependencies**: Ensure `package.json` includes `clsx` and `tailwind-merge` for dynamic classes.
9. [x] **Build Validation**: Execute `npm run build` to confirm no build errors occur.
10. [x] **Visual Regression Check**: Launch `npm run dev` and compare with SHASO Design doc.
11. [x] **Switch to pnpm**: Migrate toolchain to `pnpm` for robustness.
12. [x] **Fix Visual Regression**: Identify and patch `bg-white` artifacts to `bg-ink-xxx`.

## Phase 1: Testing & Quality Assurance
13. [x] **Install Test Runner**: Install `vitest`, `jsdom`, and `@testing-library/react`.
14. [x] **Configure Vitest**: Create `vitest.config.ts` (shared or separate from Vite).
15. [x] **Sanity Test**: Write a basic rendering test for `<App />`.
16. [x] **Linting Standards**: Install `eslint` and `prettier` with project-specific rules.
17. [ ] **Pre-commit Hooks**: Setup `husky` (optional) or `lint-staged`.
18. [x] **UI Unit Tests**: Create and test `Button` component (CVA) and `ErrorBoundary`.
19. [x] **Environment Config**: Create `.env.example` standardizing API keys and flags.

## Phase 2: Architecture & Backend Prep
31. [x] **Directory Re-structure**: Move `components` to `src/components`, `hooks` to `src/hooks` (if not already strictly enforced).
32. [x] **Database Setup**: Install `drizzle-orm` and `@libsql/client` (switched from better-sqlite3 due to build issues).
33. [x] **Schema Definition**: Create initial Drizzle schema for `Orders` and `Menu`.
34. [x] **Migration Test**: Run a local SQLite migration to prove DB connectivity.
