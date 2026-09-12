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
- **People — lending & borrowing** — a dedicated tab for tracking money you've
  lent out or borrowed, separate from day-to-day expenses:
  - A summary of total amount you're owed and total amount you owe, plus
    "People who owe you," "People you owe," "Settled," and "Added, no
    activity yet" sections.
  - Add a person with a name, optional contact, and optional notes; edit or
    delete a person directly from the list (deleting also removes their
    transaction history).
  - Each person has a detail page with their outstanding balance, a full
    transaction timeline, and an action panel that adapts to the
    relationship: **Lend more / Receive money** if they owe you,
    **Borrow more / Repay** if you owe them, or **Lend money / Borrow money**
    once settled.
  - Every timeline entry (lend, receive, borrow, repay) can be edited in
    place or deleted, and supports a date, amount, optional due date (for
    lend/borrow), and an optional note.
  - Share a person's timeline as a PNG (with their outstanding total baked
    into the image) or export it as CSV; export the full people list with
    balances as CSV from the People tab.

## Tech stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (dark theme, no light mode)
- Recharts for charts
- html-to-image for chart/table sharing (also used for People timeline share)
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

- All expenses, categories, settings, people, and lending transactions live
  in your browser's `localStorage` under keys prefixed `expense-tracker:`
  (people and lending transactions specifically under
  `expense-tracker:people` and `expense-tracker:lending-transactions`).
- Data is per-browser and per-device — clearing site data, using a private
  window, or switching browsers/devices starts a fresh ledger.
- Use the **Share → Export as CSV** options on the Expenses and Reports tabs,
  and the **Export CSV** / person-level **CSV** buttons on the People tab, to
  keep a backup or move data elsewhere.

## Project structure

```
src/
  app/
    layout.tsx        Root layout (dark theme, metadata)
    page.tsx           Main app shell: tabs, modal state, wiring
    globals.css         Design tokens (colors, radii) + Tailwind import
  components/
    Nav.tsx              Sidebar (desktop) / bottom tab bar (mobile) — includes People tab
    DashboardView.tsx    Today's snapshot + this month's category pie
    ExpensesView.tsx     Filterable/searchable history table
    ReportsView.tsx      Charts + aggregation breakdown
    SettingsView.tsx     Profile, categories, payment methods
    ExpenseForm.tsx      Add/edit expense form
    ExpenseTable.tsx     Shared table/card list for expenses
    Charts.tsx           Recharts wrappers (pie, bar, horizontal bar)
    ShareButton.tsx      PNG share / CSV export button
    Modal.tsx, Icons.tsx Small shared UI primitives
    PeopleView.tsx        People tab: totals, lent/borrowed/settled sections, add/edit/delete person
    PersonDetailView.tsx  Person detail: balance, action panel, timeline, share/export
    PersonForm.tsx        Add/edit person form (name, contact, notes)
    LendingTransactionForm.tsx  Shared form for lend/receive/borrow/repay entries
  hooks/
    useLocalStorage.ts   Generic localStorage-synced state (useSyncExternalStore)
    useAppData.ts        useExpenses / useCategories / useSettings
    useLending.ts        usePeople / useLendingTransactions
  lib/
    types.ts             Shared TypeScript types
    lending-types.ts      Person, LendingTransaction, PersonLedger types
    constants.ts         Default categories, payment methods, currencies
    utils.ts             Formatting, date filtering, aggregation, CSV export
    lending-utils.ts      Balance calculations, People CSV export, PNG share helper
```

## Customizing

- **Colors/theme:** edit the CSS variables at the top of `src/app/globals.css`.
- **Default categories/payment methods:** edit `src/lib/constants.ts`.
- **Currency list:** also in `src/lib/constants.ts` (`CURRENCIES`).
- **Lending/borrowing balance logic:** `getPersonLedger` and
  `getOverallLendingSummary` in `src/lib/lending-utils.ts` compute each
  person's outstanding balance and direction (owed to you / you owe /
  settled) from their transaction history.
