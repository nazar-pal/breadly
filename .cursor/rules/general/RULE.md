---
alwaysApply: true
---

# Code Style, Naming, and Structure

## TypeScript

- Prefer `interface` over `type`
- Never use `enum`; prefer `as const` instead
- Don't unnecessarily add `try`/`catch` blocks. If needed, use the utility functions `tryCatch` or `asyncTryCatch`
- Don't cast to `any`. Avoid `as` unless absolutely necessary
- Only create an abstraction when it's actually needed
- Prefer clear function/variable names over inline comments
- Avoid helper functions when a simple inline expression suffices
- Use `knip` to remove unused code when making large changes
- The `gh` CLI is installed—use it
- Avoid braces `{}` whenever possible (e.g., single-line function returns or single-line if statements)

## React

- Avoid massive JSX blocks—compose smaller components instead
- Colocate code that changes together
- Avoid `useEffect` unless absolutely necessary
- **Memoization (`useMemo`, `useCallback`, `React.memo`)**: Avoid by default. Trust the React Compiler. Only use if a file cannot be memoized based on lint issues

## After AI Edits

1. **Lint**: Run `bun run lint` and fix all errors
2. **Type Check**: Run `bun run typecheck` and fix all errors
