"use client";

import { useMemo, useRef, useState } from "react";
import { Category, DateRangePreset, Expense, AppSettings } from "@/lib/types";
import { filterByPreset, sumExpenses, formatAmount, expensesToCSV } from "@/lib/utils";
import ExpenseTable from "./ExpenseTable";
import ShareButton from "./ShareButton";

interface ExpensesViewProps {
  expenses: Expense[];
  categories: Category[];
  settings: AppSettings;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const PRESETS: { id: DateRangePreset; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "last30", label: "Last 30 days" },
  { id: "year", label: "This year" },
  { id: "all", label: "All time" },
  { id: "custom", label: "Custom" },
];

const selectClass =
  "rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[13px] text-[var(--text)] focus:border-[var(--accent-soft-border)] focus:outline-none";

export default function ExpensesView({
  expenses,
  categories,
  settings,
  onEdit,
  onDelete,
}: ExpensesViewProps) {
  const [preset, setPreset] = useState<DateRangePreset>("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  const captureRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let result = filterByPreset(expenses, preset, customStart, customEnd);
    if (category !== "all") {
      result = result.filter((e) => e.category === category);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          e.notes?.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => {
      const cmp = a.date === b.date ? (a.createdAt < b.createdAt ? -1 : 1) : a.date < b.date ? -1 : 1;
      return sortDesc ? -cmp : cmp;
    });
  }, [expenses, preset, customStart, customEnd, category, search, sortDesc]);

  const total = sumExpenses(filtered);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[19px] font-semibold tracking-tight text-[var(--text)]">Expenses</h1>
        <ShareButton
          targetRef={captureRef}
          filename="expense-history"
          csvData={expensesToCSV(filtered)}
          csvFilename="expense-history.csv"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPreset(p.id)}
              className={`rounded-full px-3 py-1.5 text-[12.5px] font-medium transition ${
                preset === p.id
                  ? "bg-[var(--accent-soft)] text-[var(--accent-strong)] ring-1 ring-inset ring-[var(--accent-soft-border)]"
                  : "bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {preset === "custom" && (
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className={selectClass}
            />
            <span className="text-[12px] text-[var(--text-faint)]">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className={selectClass}
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search description, notes, category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-[180px] flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-[13px] text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--accent-soft-border)] focus:outline-none"
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setSortDesc((v) => !v)}
            className={selectClass + " flex items-center gap-1.5"}
            title="Toggle sort order"
          >
            {sortDesc ? "Newest first" : "Oldest first"}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <p className="text-[12.5px] text-[var(--text-faint)]">
          {filtered.length} {filtered.length === 1 ? "expense" : "expenses"}
        </p>
        <p className="text-[13.5px] font-semibold tabular-nums text-[var(--text)]">
          Total: {formatAmount(total, settings.currency)}
        </p>
      </div>

      <div ref={captureRef} className="rounded-2xl bg-[var(--surface)] p-0.5">
        <ExpenseTable
          expenses={filtered}
          categories={categories}
          currency={settings.currency}
          onEdit={onEdit}
          onDelete={onDelete}
          emptyLabel="No expenses match these filters."
        />
      </div>
    </div>
  );
}
