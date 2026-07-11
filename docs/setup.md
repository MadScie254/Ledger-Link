# LedgerLink Setup Guide

## Project Structure
- `/src/components/layout`: Contains AppLayout, Sidebar, and Header components.
- `/src/components/ui`: shadcn/ui shared primitives (buttons, cards, tables).
- `/src/pages`: Feature-specific modules (Dashboard, Invoicing).
- `/src/lib`: Utility functions including tailwind `cn` merger.
- `/server.ts`: Express backend entry point.

## Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Recharts, shadcn/ui.
- **Backend**: Node.js, Express (Vite middleware for development).
- **Fonts**: Inter via `@fontsource-variable/inter`.

## Setup Instructions
1. Install dependencies: `npm install`
2. Start development server: `npm run dev` (Runs both Express backend and Vite frontend).
3. Build for production: `npm run build`
4. Start production server: `npm run start`

## Design System
- **Colors**: Deep indigo/navy primary (`indigo-900`/`indigo-950`), white backgrounds, emerald accents (`emerald-600` for positive actions), and amber for warnings.
- **Typography**: Inter (sans-serif) for clean financial-grade readability.
