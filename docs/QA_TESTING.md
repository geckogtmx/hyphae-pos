# Hyphae POS - QA & Testing Protocol

> **Status**: Enforced
> **Scope**: All code contributions

## 1. Zero-Broken-Window Policy

We adhere to a strict **"Zero Broken Windows"** policy. No commit is accepted if it breaks existing builds or tests.
- **Build**: `npm run build` must pass.
- **Lint**: `npm run lint` must pass (0 warnings).
- **Test**: `npm run test` must pass (0 failures).

## 2. Testing Pyramid Strategy

We prioritize speed and confidence using standard pyramid layers:

### A. Unit Tests (Vitest) - 70%
- **Target**: Pure logic, helper functions, hooks, state reducers.
- **Location**: `__tests__` directories alongside source files.
- **Naming**: `*.test.ts` or `*.test.tsx`.
- **Requirement**: "If it has logic, it gets a test."
- **Mocking**: Mock all external I/O (Database, API, WebSocket).

### B. Integration Tests (Vitest + Testing Library) - 20%
- **Target**: Component interactions, Context providers, Data flows.
- **Requirement**: Test user interactions (clicks, inputs), not implementation details.
- **Pattern**: `render(<OrderProvider><Component /></OrderProvider>)`.

### C. E2E Tests (Playwright - Future) - 10%
- **Target**: Critical User Journeys (CUJs).
- **Scope**: Checkout flow, Shift Open/Close.

## 3. Test Coverage Standards

We enforce high coverage on domain-critical packages.

| Domain | Min Coverage | Rationale |
|BC|BC|BC|
| **POS Calculations** | 100% | Tax, Totals, and Balancing must be perfect. |
| **Inventory Logic** | 90% | Stock levels determine business viability. |
| **UI Components** | 70% | Focus on interaction logic, not styling. |
| **Utilities** | 100% | Helpers should be robust and side-effect free. |

## 4. TDD Workflow (Test Driven Development)

When implementing a NEW feature:
1. **Red**: Write a failing test describing the desired behavior.
2. **Green**: Write the minimal code to pass the test.
3. **Refactor**: Optimize code while keeping tests green.

## 5. Regression Defense

If a bug is reported:
1. **Reproduce** the bug with a numeric/logical test case.
2. **Fail**: Confirm the test fails.
3. **Fix**: Apply the patch.
4. **Pass**: Confirm the test passes.
5. **Commit**: The test remains forever as regressive armor.

## 6. Tooling Configuration

- **Runner**: Vitest (Fast, Vite-native).
- **Assertions**: `expect` (Jest-compatible).
- **Mocks**: `vi.mock` / `vi.spyOn`.
- **Environment**: `jsdom` for React components.
