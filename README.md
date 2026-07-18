# LedgerLink

> Clean books for schools, churches, law firms and hospitals — without hiring a full finance team.

LedgerLink is a modern financial management platform designed for Kenyan organizations that need transparent bookkeeping, compliant payroll, and professional invoicing — without the overhead of enterprise accounting software.

---

## Features

| Module | Description |
|---|---|
| **Dashboard** | Sector-aware KPI dashboards with a hero Cash Position metric, activity feeds, and a fiscal calendar. |
| **Invoicing** | Create, track, send reminders (Email/SMS), and generate branded PDF invoices. |
| **Payroll** | KRA-compliant PAYE, NSSF, SHIF, and AHL calculations with one-click payslip PDF generation. |
| **Inventory** | Real-time stock tracking, low-stock alerts, and a full movement log. |
| **Accounting** | M-Pesa and bank transaction feeds, plus a complete bills payable workflow. |
| **Reports** | Income Statement (P&L) with grouped income/expense categories and pie charts. |
| **Clients** | Client directory with outstanding balance tracking and invoice history. |
| **AI Assistant** | Built-in Gemini-powered AI chat for financial questions. |

### Platform Capabilities

- **Sector Configurations** — Out-of-the-box labels and compliance cards for Schools, Churches, Law Firms, and Hospitals/Clinics.
- **Organization Branding** — Custom brand color captured at onboarding; applied to sidebar accent and all generated PDFs.
- **Full State Persistence** — All data persists in `localStorage` via Zustand middleware. A "Reset Demo Data" button in Settings clears everything.
- **Real Notification Bell** — Dynamic notifications derived from overdue invoices, low stock, and pending payroll.
- **Public Landing & Pricing Pages** — Marketing-ready pages at `/` and `/pricing`; the app itself lives under `/app/*`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS v4 |
| UI Components | shadcn/ui, Radix UI, Lucide Icons |
| Charts | Recharts |
| State | Zustand (with `persist` middleware) |
| Routing | React Router DOM v7 |
| PDF Generation | jsPDF |
| AI | Google Gemini API (`@google/genai`) |
| Fonts | Inter (`@fontsource-variable/inter`) |
| Build | Vite |
| Hosting | Cloudflare Pages (static) |

---

## Project Structure

```
src/
├── components/
│   ├── layout/          # AppLayout, Sidebar, Header
│   ├── ui/              # shadcn/ui primitives + EmptyState
│   ├── AIAssistant.tsx   # Gemini-powered chat panel
│   ├── ErrorBoundary.tsx
│   └── theme-provider.tsx
├── contexts/
│   └── AuthContext.tsx   # Onboarding state + role management
├── lib/
│   ├── calculatePayroll.ts   # KRA 2026 tax engine
│   ├── generateInvoicePdf.ts # Branded invoice PDFs
│   ├── generatePayslip.ts    # Branded payslip PDFs
│   ├── mockData.ts           # Seed data for demo
│   └── utils.ts              # cn() helper
├── pages/
│   ├── dashboards/      # DashboardOwner, DashboardBoard
│   ├── Landing.tsx      # Public landing page
│   ├── Pricing.tsx      # Public pricing tiers
│   ├── Onboarding.tsx   # Setup wizard
│   ├── Invoicing.tsx
│   ├── Payroll.tsx
│   ├── Inventory.tsx
│   ├── Accounting.tsx
│   ├── Reports.tsx
│   ├── Clients.tsx
│   └── Settings.tsx
├── store/
│   └── useAppStore.ts   # Global Zustand store
├── App.tsx              # Top-level routing
├── main.tsx             # React entry point
└── index.css            # Design system tokens
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
git clone https://github.com/MadScie254/Ledger-Link.git
cd Ledger-Link
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the landing page. Navigate to `/app` to enter the dashboard.

### Production Build

```bash
npm run build
```

The static output in `dist/` can be deployed to Cloudflare Pages, Vercel, Netlify, or any static host.

---

## Routes

| Path | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/pricing` | Public | Pricing tiers |
| `/app` | Private | Redirects to `/app/dashboard` (runs onboarding if first visit) |
| `/app/dashboard` | Private | Sector-aware dashboard |
| `/app/invoicing` | Private | Invoice management |
| `/app/payroll` | Private | Payroll processing |
| `/app/inventory` | Private | Stock management |
| `/app/accounting` | Private | Bills, M-Pesa, Bank feeds |
| `/app/reports` | Private | Income Statement |
| `/app/clients` | Private | Client directory |
| `/app/settings` | Private | Org profile, QB config, demo reset |

---

## Design System

LedgerLink uses a semantic color token system defined in `src/index.css` using the `oklch` color space:

| Token | Usage |
|---|---|
| `--primary` | Brand teal, buttons, active nav items |
| `--success` | Paid invoices, positive values, active staff |
| `--warning` | Pending items, overdue invoices, low stock |
| `--destructive` | Deletions, negative values, errors |

All pages use these tokens instead of raw Tailwind color classes for consistency.

---

## Environment Variables

Copy `.env.example` to `.env` and set:

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key for the AI Assistant |

> **Note:** The API key is only used server-side. For static deployments (Cloudflare Pages), the AI Assistant will show a connection error — this is expected.

---

## Documentation

- [Setup Guide](docs/setup.md) — Project structure and configuration details
- [API Reference](docs/api.md) — Planned REST API endpoints
- [Changelog](CHANGELOG.md) — Full release history
- [Contributing](CONTRIBUTING.md) — How to contribute

---

## License

Apache-2.0
