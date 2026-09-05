"use client";

import { Category, Expense } from "@/lib/types";
import { formatAmount, formatDateDisplay } from "@/lib/utils";
import { IconEdit, IconTrash, IconEmpty } from "./Icons";

interface ExpenseTableProps {
  expenses: Expense[];
  categories: Category[];
  currency: string;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  emptyLabel?: string;
}

function categoryColor(categories: Category[], name: string): string {
  return categories.find((c) => c.name === name)?.color ?? "var(--cat-10)";
}

export default function ExpenseTable({
  expenses,
  categories,
  currency,
  onEdit,
  onDelete,
  emptyLabel = "No expenses recorded yet.",
}: ExpenseTableProps) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--border)] py-14 text-center">
        <IconEmpty className="text-[var(--text-faint)]" />
        <p className="text-[13.5px] text-[var(--text-muted)]">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      {/* Desktop table */}
      <table className="hidden w-full text-left sm:table">
        <thead>
          <tr className="border-b border-[var(--border)] text-[11.5px] font-medium uppercase tracking-wide text-[var(--text-faint)]">
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Payment</th>
            <th className="px-4 py-3 text-right font-medium">Amount</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr
              key={e.id}
              className="group border-b border-[var(--border)] text-[13.5px] transition last:border-0 hover:bg-[var(--surface-hover)]"
            >
              <td className="whitespace-nowrap px-4 py-3 text-[var(--text-muted)]">
                {formatDateDisplay(e.date)}
              </td>
              <td className="px-4 py-3">
                <div className="font-medium text-[var(--text)]">{e.description}</div>
                {e.notes && (
                  <div className="mt-0.5 truncate text-[12px] text-[var(--text-faint)]">{e.notes}</div>
                )}
              </td>
              <td className="px-4 py-3">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-2.5 py-1 text-[12px] text-[var(--text-muted)]"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: categoryColor(categories, e.category) }}
                  />
                  {e.category}
                </span>
              </td>
              <td className="px-4 py-3 text-[var(--text-muted)]">{e.paymentMethod}</td>
              <td className="px-4 py-3 text-right font-semibold tabular-nums text-[var(--text)]">
                {formatAmount(e.amount, currency)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={() => onEdit(e)}
                    aria-label="Edit expense"
                    className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-active)] hover:text-[var(--text)]"
                  >
                    <IconEdit size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(e.id)}
                    aria-label="Delete expense"
                    className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--expense-soft)] hover:text-[var(--expense)]"
                  >
                    <IconTrash size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <ul className="divide-y divide-[var(--border)] sm:hidden">
        {expenses.map((e) => (
          <li key={e.id} className="flex items-center gap-3 px-4 py-3.5">
            <span
              className="h-9 w-1.5 shrink-0 rounded-full"
              style={{ background: categoryColor(categories, e.category) }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[13.5px] font-medium text-[var(--text)]">{e.description}</p>
                <p className="shrink-0 text-[13.5px] font-semibold tabular-nums text-[var(--text)]">
                  {formatAmount(e.amount, currency)}
                </p>
              </div>
              <p className="mt-0.5 truncate text-[12px] text-[var(--text-faint)]">
                {formatDateDisplay(e.date)} · {e.category} · {e.paymentMethod}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <button
                onClick={() => onEdit(e)}
                aria-label="Edit expense"
                className="rounded-lg p-1.5 text-[var(--text-faint)]"
              >
                <IconEdit size={15} />
              </button>
              <button
                onClick={() => onDelete(e.id)}
                aria-label="Delete expense"
                className="rounded-lg p-1.5 text-[var(--text-faint)]"
              >
                <IconTrash size={15} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
