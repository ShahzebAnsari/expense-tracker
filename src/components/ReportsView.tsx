"use client";

import { useMemo, useRef, useState } from "react";
import { Category, DateRangePreset, Expense, AppSettings, GroupBy } from "@/lib/types";
import {
  filterByPreset,
  groupSum,
  sumExpenses,
  dailyTotals,
  monthlyTotals,
  formatAmount,
  downloadFile,
} from "@/lib/utils";
import { CategoryPieChart, TrendBarChart, PaymentMethodChart } from "./Charts";
import ShareButton from "./ShareButton";

interface ReportsViewProps {
  expenses: Expense[];
  categories: Category[];
  settings: AppSettings;
}

const PRESETS: { id: DateRangePreset; label: string }[] = [
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "last30", label: "Last 30 days" },
  { id: "year", label: "This year" },
  { id: "all", label: "All time" },
];

const pillClass = (active: boolean) =>
  `rounded-full px-3 py-1.5 text-[12.5px] font-medium transition ${
    active
      ? "bg-[var(--accent-soft)] text-[var(--accent-strong)] ring-1 ring-inset ring-[var(--accent-soft-border)]"
      : "bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)]"
  }`;

export default function ReportsView({ expenses, categories, settings }: ReportsViewProps) {
  const [preset, setPreset] = useState<DateRangePreset>("month");
  const [groupBy, setGroupBy] = useState<GroupBy>("category");

  const filtered = useMemo(() => filterByPreset(expenses, preset), [expenses, preset]);
  const total = sumExpenses(filtered);

  const categoryTotals = useMemo(() => groupSum(filtered, (e) => e.category), [filtered]);
  const paymentTotals = useMemo(() => groupSum(filtered, (e) => e.paymentMethod), [filtered]);
  const trend = useMemo(() => {
    return preset === "year" || preset === "all" ? monthlyTotals(filtered) : dailyTotals(filtered);
  }, [filtered, preset]);

  const aggregation = useMemo(() => {
    if (groupBy === "category") return groupSum(filtered, (e) => e.category);
    if (groupBy === "paymentMethod") return groupSum(filtered, (e) => e.paymentMethod);
    if (groupBy === "day") return groupSum(filtered, (e) => e.date);
    if (groupBy === "month") return groupSum(filtered, (e) => e.date.slice(0, 7));
    return groupSum(filtered, (e) => e.category);
  }, [filtered, groupBy]);

  const chartsRef = useRef<HTMLDivElement>(null);

  function exportAggregationCsv() {
    const header = ["Group", "Total", "Count"];
    const rows = aggregation.map((a) => [a.key, a.total.toFixed(2), String(a.count)]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    downloadFile(`aggregation-${groupBy}.csv`, csv, "text/csv;charset=utf-8;");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[19px] font-semibold tracking-tight text-[var(--text)]">Reports</h1>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.id} onClick={() => setPreset(p.id)} className={pillClass(preset === p.id)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4">
        <div>
          <p className="text-[12.5px] text-[var(--text-faint)]">Total spent</p>
          <p className="mt-0.5 text-[22px] font-semibold tabular-nums text-[var(--text)]">
            {formatAmount(total, settings.currency)}
          </p>
        </div>
        <ShareButton targetRef={chartsRef} filename={`report-${preset}`} label="Share charts" />
      </div>

      <div ref={chartsRef} className="flex flex-col gap-5 rounded-2xl bg-[var(--surface)] p-0.5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ChartCard title="Spend over time">
            <TrendBarChart data={trend} currency={settings.currency} dateKey={preset === "year" || preset === "all" ? "month" : "date"} />
          </ChartCard>
          <ChartCard title="By category">
            <CategoryPieChart data={categoryTotals} categories={categories} currency={settings.currency} />
          </ChartCard>
        </div>
        <ChartCard title="By payment method">
          <PaymentMethodChart data={paymentTotals} currency={settings.currency} />
        </ChartCard>
      </div>

      {/* Aggregation table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[14px] font-semibold text-[var(--text)]">Aggregated totals</h2>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupBy)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-[12.5px] text-[var(--text)] focus:outline-none sm:w-auto sm:py-1.5"
            >
              <option value="category">Group by category</option>
              <option value="paymentMethod">Group by payment method</option>
              <option value="day">Group by day</option>
              <option value="month">Group by month</option>
            </select>
            <button
              onClick={exportAggregationCsv}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-[12.5px] font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text)] sm:w-auto sm:py-1.5"
            >
              Export CSV
            </button>
          </div>
        </div>

        {aggregation.length === 0 ? (
          <p className="py-8 text-center text-[13px] text-[var(--text-faint)]">
            No expenses in this range yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {aggregation.map((a) => {
              const pct = total > 0 ? (a.total / total) * 100 : 0;
              return (
                <div key={a.key} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 truncate text-[12.5px] text-[var(--text-muted)]">
                    {a.key}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--surface-hover)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-24 shrink-0 text-right text-[12.5px] font-medium tabular-nums text-[var(--text)]">
                    {formatAmount(a.total, settings.currency)}
                  </span>
                  <span className="w-10 shrink-0 text-right text-[11.5px] text-[var(--text-faint)]">
                    {a.count}x
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <h3 className="mb-3 text-[13.5px] font-semibold text-[var(--text)]">{title}</h3>
      {children}
    </div>
  );
}
