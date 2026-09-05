"use client";

import { useMemo, useRef } from "react";
import { Category, Expense, AppSettings } from "@/lib/types";
import { filterByPreset, groupSum, sumExpenses, todayISO, expensesToCSV } from "@/lib/utils";
import SummaryCards from "./SummaryCards";
import ExpenseTable from "./ExpenseTable";
import ShareButton from "./ShareButton";
import { CategoryPieChart } from "./Charts";

interface DashboardViewProps {
  expenses: Expense[];
  categories: Category[];
  settings: AppSettings;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function DashboardView({
  expenses,
  categories,
  settings,
  onEdit,
  onDelete,
  onAdd,
}: DashboardViewProps) {
  const todayExpenses = useMemo(
    () => filterByPreset(expenses, "today").sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [expenses]
  );
  const weekExpenses = useMemo(() => filterByPreset(expenses, "week"), [expenses]);
  const monthExpenses = useMemo(() => filterByPreset(expenses, "month"), [expenses]);

  const monthCategoryTotals = useMemo(
    () => groupSum(monthExpenses, (e) => e.category),
    [monthExpenses]
  );

  const captureRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[19px] font-semibold tracking-tight text-[var(--text)]">
            Hey {settings.userName.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-[13px] text-[var(--text-faint)]">{formatFullDate()}</p>
        </div>
        <button
          onClick={onAdd}
          className="hidden rounded-xl bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-[#161006] transition hover:bg-[var(--accent-strong)] sm:block"
        >
          + Add expense
        </button>
      </div>

      <SummaryCards
        today={sumExpenses(todayExpenses)}
        week={sumExpenses(weekExpenses)}
        month={sumExpenses(monthExpenses)}
        topCategory={monthCategoryTotals[0] ?? null}
        currency={settings.currency}
      />

      <div className="grid grid-cols-1 gap-5">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-[var(--text)]">
              Today&apos;s expenses
            </h2>
            {todayExpenses.length > 0 && (
              <ShareButton
                targetRef={captureRef}
                filename={`expenses-${todayISO()}`}
                csvData={expensesToCSV(todayExpenses)}
                csvFilename={`expenses-${todayISO()}.csv`}
              />
            )}
          </div>
          <div ref={captureRef} className="rounded-2xl bg-[var(--surface)] p-0.5">
            <ExpenseTable
              expenses={todayExpenses}
              categories={categories}
              currency={settings.currency}
              onEdit={onEdit}
              onDelete={onDelete}
              emptyLabel="Nothing logged today. Add your first expense to get started."
            />
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-[14px] font-semibold text-[var(--text)]">
            This month by category
          </h2>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <CategoryPieChart
              data={monthCategoryTotals}
              categories={categories}
              currency={settings.currency}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatFullDate() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
