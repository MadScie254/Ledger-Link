# LedgerLink Setup Guide

## Project Structure

```
src/
├── components/
│   ├── layout/           # AppLayout, Sidebar, Header
│   ├── ui/               # shadcn/ui primitives + EmptyState
│   ├── AIAssistant.tsx    # Gemini AI chat panel
│   ├── ErrorBoundary.tsx
│   └── theme-provider.tsx
├── contexts/
│   └── AuthContext.tsx    # Onboarding state + role management
├── lib/
│   ├── calculatePayroll.ts    # KRA 2026 tax engine (PAYE, NSSF, SHIF, AHL)
│   ├── generateInvoicePdf.ts  # Branded invoice PDFs (jsPDF)
│   ├── generatePayslip.ts     # Branded payslip PDFs (jsPDF)
│   ├── mockData.ts            # Seed data for demo mode
│   └── utils.ts               # cn() class merger
├── pages/
│   ├── dashboards/       # DashboardOwner.tsx, DashboardBoard.tsx
│   ├── Landing.tsx        # Public landing page (/)
│   ├── Pricing.tsx        # Public pricing page (/pricing)
│   ├── Onboarding.tsx     # Setup wizard (org name, sector, brand color)
│   ├── Dashboard.tsx      # Role-based router
│   ├── Invoicing.tsx
│   ├── Payroll.tsx
│   ├── Inventory.tsx
│   ├── Accounting.tsx
│   ├── Reports.tsx
│   ├── Clients.tsx
│   └── Settings.tsx
├── store/
│   └── useAppStore.ts    # Zustand global store with persistence
├── App.tsx               # Top-level routing (public + private)
├── main.tsx              # React entry point + BrowserRouter
└── index.css             # Design system tokens (oklch)
```

## Technology Stack

| Layer         | Technology                     | Version |
| ------------- | ------------------------------ | ------- |
| Framework     | React                          | 19      |
| Language      | TypeScript                     | 5.8     |
| Styling       | Tailwind CSS                   | 4       |
| UI Primitives | shadcn/ui + Radix UI           | Latest  |
| Icons         | Lucide React                   | 0.546   |
| Charts        | Recharts                       | 3.9     |
| State         | Zustand                        | 5.0     |
| Routing       | React Router DOM               | 7.18    |
| PDF           | jsPDF                          | 4.2     |
| AI            | @google/genai (Gemini)         | 2.4     |
| Fonts         | Inter via @fontsource-variable | —      |
| Build         | Vite                           | 6.2     |

## Setup Instructions

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
npm install
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable           | Required | Description                                |
| ------------------ | -------- | ------------------------------------------ |
| `GEMINI_API_KEY` | Optional | Google Gemini API key for the AI Assistant |

> The AI Assistant is a nice-to-have feature. The app works fully without it — you'll just see a "can't connect" message in the chat panel.

### Build for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy to any static host (Cloudflare Pages, Vercel, Netlify).

## Design System

LedgerLink defines semantic color tokens in `src/index.css` using the **oklch** color space. All UI should use these tokens — never raw Tailwind colors.

### Color Tokens

| Token             | Light Mode      | Dark Mode     | Usage                       |
| ----------------- | --------------- | ------------- | --------------------------- |
| `--primary`     | Deep teal       | Lighter teal  | Brand, buttons, active nav  |
| `--success`     | Green (hue 155) | Lighter green | Paid, active, positive      |
| `--warning`     | Amber (hue 80)  | Lighter amber | Pending, overdue, low stock |
| `--destructive` | Red             | Lighter red   | Errors, deletions           |

### Usage Examples

```tsx
// ✅ Correct — semantic token
<Badge className="bg-success/10 text-success">Paid</Badge>

// ❌ Wrong — raw Tailwind color
<Badge className="bg-emerald-100 text-emerald-800">Paid</Badge>
```

## Routing Architecture

The app uses a two-tier routing system:

```TypeScript
/ .............. Landing.tsx      (public)
/pricing ....... Pricing.tsx      (public)
/app/* ......... MainApp          (private — onboarding gate)
  /app/dashboard
  /app/invoicing
  /app/payroll
  /app/inventory
  /app/accounting
  /app/reports
  /app/clients
  /app/settings
```

`App.tsx` handles the top-level split. `AppLayout.tsx` handles the `/app/*` sub-routes.

## State Management

All application state lives in `src/store/useAppStore.ts` (Zustand with `persist` middleware). The following data is persisted to `localStorage`:

- `orgProfile` (name, sector, qbConnected, primaryColor)
- `invoices`, `customers`, `accounts`, `bills`
- `staff`, `inventory`, `movements`
- `payrollHistory`
- `mpesaTransactions`, `bankTransactions`
- `activityLog`

Action functions (e.g., `addInvoice`, `setStaff`) are **not** persisted.

To reset all persisted data, use the **"Reset Demo Data"** button in Settings, or clear `localStorage` manually.
