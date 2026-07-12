# Changelog Updates

## Recent Changes

### Features & UI Improvements

* **Mobile Sidebar Drawer**: Added a slide-in mobile drawer for navigation on viewports smaller than `md`, triggered by a hamburger menu in the Header. Auto-closes on route changes.
* **Sector-Aware Dashboard**: The Owner Dashboard now dynamically adjusts labels (e.g., "Unpaid School Fees" vs. "Outstanding Pledges"), compliance alerts, and specialized KPI cards based on the selected organization sector.
* **Loading Skeletons**: Added simulated 500ms skeleton loading animations to the Owner Dashboard, Board Dashboard, Invoicing, Payroll, and Inventory pages using the existing `Skeleton` component to improve perceived performance.

### Bug Fixes

* **Navigation Fixed**: Replaced the local `useState` routing in `AppLayout.tsx` with proper URL-based routing using `react-router-dom`. The root URL (`/`) now redirects to `/dashboard`.
* **Button Overflow Fixed**: Fixed an issue in the Onboarding step 2 where three full-width buttons were overflowing on narrow screens. Used `flex-wrap` and `flex-1 min-w-0` to allow graceful wrapping.

### Data & State Management

* **Data Wiring**: Wired the Owner Dashboard to read KPIs ("Total Invoiced", "Outstanding Arrears", etc.) and the Recent Activity feed directly from the `useAppStore` instead of using hardcoded mock data.
* **Auth Persistence**: Configured `AuthContext.tsx` to read and write the `isOnboarded` state via `localStorage`, ensuring progress isn't reset on page refresh.
* **Store Persistence**: Wrapped `useAppStore.ts` with Zustand's `persist` middleware, utilizing `partialize` to specifically persist the `orgProfile` to `localStorage` while leaving mock lists transient.
