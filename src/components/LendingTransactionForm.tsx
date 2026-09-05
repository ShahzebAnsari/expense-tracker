"use client";

import { useState, type FormEvent } from "react";
import type { LendingTransactionType } from "@/lib/lending-types";

interface LendingTransactionFormProps {
  type: LendingTransactionType;
  onSubmit: (data: { date: string; amount: number; dueDate?: string; note?: string }) => void;
  onCancel: () => void;
}

const CONFIG: Record<LendingTransactionType, { title: string; amountLabel: string; hasDueDate: boolean }> = {
  lend: { title: "Lend money", amountLabel: "Amount lent", hasDueDate: true },
  receive: { title: "Receive money", amountLabel: "Amount received", hasDueDate: false },
  borrow: { title: "Borrow money", amountLabel: "Amount borrowed", hasDueDate: true },
  repay: { title: "Repay money", amountLabel: "Amount repaid", hasDueDate: false },
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function LendingTransactionForm({ type, onSubmit, onCancel }: LendingTransactionFormProps) {
  const config = CONFIG[type];
  const [date, setDate] = useState(today());
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      setError("Enter a valid amount greater than 0.");
      return;
    }
    if (dueDate && dueDate < date) {
      setError("Due date can't be before the transaction date.");
      return;
    }
    onSubmit({
      date,
      amount: parsed,
      dueDate: config.hasDueDate && dueDate ? dueDate : undefined,
      note: note.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-[var(--text-muted)]">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text)]"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-[var(--text-muted)]">{config.amountLabel}</label>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text)]"
          placeholder="0.00"
          autoFocus
        />
      </div>
      {config.hasDueDate && (
        <div>
          <label className="mb-1 block text-sm text-[var(--text-muted)]">Due date (optional)</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text)]"
            min={date}
          />
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm text-[var(--text-muted)]">Note (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text)]"
          rows={2}
          placeholder="What's this for?"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-elevated)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-[var(--accent)] px-4 py-2 text-[13px] font-semibold text-[#161006] hover:bg-[var(--accent-strong)] active:scale-[0.98]"
        >
          {config.title}
        </button>
      </div>
    </form>
  );
}
