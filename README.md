# Ledger — Daily Expense Tracker

A simple, dark-themed daily expense tracker built with Next.js. No backend,
no database, no sign-up — everything is stored locally in your browser via
`localStorage`.

## Features

- **Add expenses** — date (defaults to today), description, category, amount,
  payment method, and an optional notes field.
- **Settings panel** — set your display name and currency, manage expense
  categories (add/rename/delete, with the 9 requested defaults pre-loaded:
  Food & Dining, Transport, Grocery, Personal Care, Banking/Finance,
  Healthcare, Bills, Entertainment, Others), and manage payment methods.
- **Today & history views** — today's expenses on the dashboard, full
  searchable/filterable history on the Expenses tab (by date range, category,
  or free text), shown as a table on desktop and cards on mobile.
- **Charts** — category breakdown (pie), spend-over-time (bar), and
  payment-method comparison, filterable by date range (this week/month, last
  30 days, this year, all time).
- **Share & export** — every table and chart panel has a Share button that
  exports it as a PNG (using the native share sheet on mobile, or a download
  on desktop) or as CSV.
- **Aggregation** — a breakdown table on the Reports tab totals your spend by
  category, payment method, day, or month, with percentage bars and CSV
  export.

## Tech stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (dark theme, no light mode)
- Recharts for charts
- html-to-image for chart/table sharing
- date-fns for date handling
- All state persisted to `localStorage` — no server, no database, no API keys

## Running locally

**Requirements:** Node.js 18.18 or newer (Node 20 LTS recommended). Check
with `node -v`.

```bash
# 1. Unzip the project and move into it
cd expense-tracker

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open **http://localhost:3000** in your browser.

### Production build (optional)

```bash
npm run build
npm run start
```

This serves an optimized build, also at http://localhost:3000.

## Notes on data storage

- All expenses, categories, and settings live in your browser's
  `localStorage` under keys prefixed `expense-tracker:`.
- Data is per-browser and per-device — clearing site data, using a private
  window, or switching browsers/devices starts a fresh ledger.
- Use the **Share → Export as CSV** options on the Expenses and Reports tabs
  to keep a backup or move data elsewhere.

## Project structure

```
src/
  app/
    layout.tsx        Root layout (dark theme, metadata)
    page.tsx           Main app shell: tabs, modal state, wiring
    globals.css         Design tokens (colors, radii) + Tailwind import
  components/
    Nav.tsx              Sidebar (desktop) / bottom tab bar (mobile)
    DashboardView.tsx    Today's snapshot + this month's category pie
    ExpensesView.tsx     Filterable/searchable history table
    ReportsView.tsx      Charts + aggregation breakdown
    SettingsView.tsx     Profile, categories, payment methods
    ExpenseForm.tsx      Add/edit expense form
    ExpenseTable.tsx     Shared table/card list for expenses
    Charts.tsx           Recharts wrappers (pie, bar, horizontal bar)
    ShareButton.tsx      PNG share / CSV export button
    Modal.tsx, Icons.tsx Small shared UI primitives
  hooks/
    useLocalStorage.ts   Generic localStorage-synced state (useSyncExternalStore)
    useAppData.ts        useExpenses / useCategories / useSettings
  lib/
    types.ts             Shared TypeScript types
    constants.ts         Default categories, payment methods, currencies
    utils.ts             Formatting, date filtering, aggregation, CSV export
```

## Customizing

- **Colors/theme:** edit the CSS variables at the top of `src/app/globals.css`.
- **Default categories/payment methods:** edit `src/lib/constants.ts`.
- **Currency list:** also in `src/lib/constants.ts` (`CURRENCIES`).
