# Changelog

All notable changes to LedgerLink are documented in this file.

---

## [0.4.0] — 2026-07-18

### Added
- **Public Landing Page** (`/`) — Hero section targeting schools, churches, law firms, and hospitals with a CSS dashboard mockup and sector cards.
- **Pricing Page** (`/pricing`) — Three-tier pricing (Starter KES 2,500 / Growth KES 6,000 / Enterprise Custom) with feature comparison.
- **Top-Level Routing** — `App.tsx` now uses `react-router-dom` `<Routes>` at the root. Public pages live at `/` and `/pricing`; the app dashboard lives under `/app/*`.
- **Organization Branding** — Added optional `primaryColor` (hex) field to `OrgProfile`. Captured via a color picker in onboarding step 1.
- **Sidebar Workspace Switcher** — Organization name now displayed beneath the LedgerLink logo in the sidebar with a brand-colored accent dot.
- **Dynamic PDF Branding** — `generateInvoicePdf.ts` and `generatePayslip.ts` now use the organization's custom `primaryColor` for header accents instead of hardcoded emerald.

### Changed
- All internal navigation links updated from `/dashboard`, `/invoicing`, etc. to `/app/dashboard`, `/app/invoicing`, etc.
- `AppLayout.tsx` root redirect changed from `/dashboard` to `/app/dashboard`.

---

## [0.3.0] — 2026-07-18

### Added
- **Semantic Color Tokens** — Defined `--success` (hue 155) and `--warning` (hue 80) tokens in `src/index.css` using `oklch`. Wired into the Tailwind `@theme` block.
- **Dashboard Hero Metric** — Promoted "Cash Position" to a large hero card at the top of the Owner Dashboard; remaining 5 KPIs moved to a secondary 5-column grid.
- **EmptyState Component** — New reusable `src/components/ui/empty-state.tsx` component with icon, message, and optional CTA button.
- **Empty States Integrated** — Invoicing, Clients, Inventory (list + Movement Log dialog), Accounting (Bills, M-Pesa, Bank), and Reports now show `EmptyState` instead of plain text when tables are empty.
- **Payroll Jargon Microcopy** — Added muted helper text beneath PAYE (Income Tax), NSSF (Pension), SHIF (Health), and AHL (Housing) column headers.

### Changed
- Replaced 62+ hardcoded `emerald-*` and `amber-*` Tailwind classes across Invoicing, Accounting, Inventory, Payroll, Clients, Reports, Onboarding, Header, DashboardOwner, and DashboardBoard with `success` and `warning` semantic tokens.

---

## [0.2.0] — 2026-07-18

### Added
- **Full State Persistence** — Expanded `useAppStore.ts` `persist` config to save invoices, customers, accounts, bills, staff, inventory, movements, payrollHistory, mpesaTransactions, bankTransactions, and activityLog. Only data arrays are persisted; action functions are excluded.
- **Reset Demo Data Button** — Added to Settings page; clears localStorage and reloads the app to restore original seed data.
- **Real Notification Bell** — Header notification dropdown now shows dynamic alerts derived from overdue invoices, low-stock items, and pending payroll instead of a hardcoded "No new notifications" message.
- **Dynamic Dashboard Date** — Owner Dashboard greeting and date display now uses the current date instead of a static string.

---

## [0.1.0] — 2026-07-17

### Added
- **Mobile Sidebar Drawer** — Slide-in mobile navigation for viewports smaller than `md`, triggered by hamburger menu in Header. Auto-closes on route changes.
- **Sector-Aware Dashboard** — Owner Dashboard dynamically adjusts labels (e.g., "Unpaid School Fees" vs. "Outstanding Pledges"), compliance alerts, and KPI cards based on organization sector.
- **Loading Skeletons** — Simulated 500ms skeleton loading animations on Owner Dashboard, Board Dashboard, Invoicing, Payroll, and Inventory pages.
- **Data Wiring** — Owner Dashboard reads KPIs and Recent Activity from `useAppStore` instead of hardcoded values.
- **Auth Persistence** — `AuthContext.tsx` reads/writes `isOnboarded` via `localStorage`.
- **Store Persistence** — `useAppStore.ts` wrapped with Zustand `persist` middleware for `orgProfile`.

### Fixed
- Replaced local `useState` routing in `AppLayout.tsx` with URL-based routing using `react-router-dom`.
- Fixed Onboarding step 2 button overflow on narrow screens with `flex-wrap` and `flex-1 min-w-0`.
