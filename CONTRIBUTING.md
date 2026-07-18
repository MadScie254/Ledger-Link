# Contributing to LedgerLink

Thank you for your interest in contributing! Here's how to get started.

---

## Development Setup

1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/<your-username>/Ledger-Link.git
   cd Ledger-Link
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the dev server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) to see the app.

---

## Project Conventions

### Branching

- `main` — production-ready code
- `feature/<name>` — new features
- `fix/<name>` — bug fixes

### Code Style

- **TypeScript** is required for all source files.
- **Tailwind CSS** — use semantic design tokens (`text-success`, `bg-warning`, etc.) instead of raw color classes like `text-emerald-500`. See `src/index.css` for available tokens.
- **Components** — follow the existing `shadcn/ui` component patterns in `src/components/ui/`.
- **State** — all global state lives in `src/store/useAppStore.ts` via Zustand. Avoid local state for data that needs persistence.

### File Organization

| Directory | Purpose |
|---|---|
| `src/pages/` | Route-level page components |
| `src/components/layout/` | AppLayout, Sidebar, Header |
| `src/components/ui/` | Shared UI primitives |
| `src/lib/` | Utilities, PDF generators, payroll calculations |
| `src/store/` | Zustand store |
| `src/contexts/` | React context providers |
| `docs/` | Project documentation |

---

## Making Changes

1. Create a feature branch from `main`.
2. Make your changes following the conventions above.
3. Run the type checker before committing:
   ```bash
   npm run lint
   ```
4. Test your changes manually — verify the app loads, navigation works, and your feature renders correctly.
5. Open a Pull Request with a clear description of your changes.

---

## Design System

When adding or modifying UI, use these semantic tokens defined in `src/index.css`:

| Token | When to use |
|---|---|
| `--primary` | Brand actions, active states, CTAs |
| `--success` | Paid, active, positive values |
| `--warning` | Pending, overdue, low stock (non-destructive) |
| `--destructive` | Deletions, errors, critical alerts |

**Do not** introduce new raw Tailwind color classes (e.g., `bg-emerald-500`). Use the token equivalents (`bg-success`, `text-warning`, etc.) instead.

---

## Adding a New Page

1. Create the component in `src/pages/YourPage.tsx`.
2. Add a route in `src/components/layout/AppLayout.tsx` under the `<Routes>` block.
3. Add a navigation entry in `src/components/layout/Sidebar.tsx` in the `navigation` array (use the `/app/` prefix).
4. If the page has empty states, use the `EmptyState` component from `src/components/ui/empty-state.tsx`.

---

## Reporting Issues

Please open an issue on GitHub with:
- A clear description of the bug or feature request
- Steps to reproduce (for bugs)
- Expected vs. actual behavior
- Screenshots if applicable

---

## License

By contributing, you agree that your contributions will be licensed under the Apache-2.0 License.
