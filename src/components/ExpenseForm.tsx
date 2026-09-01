"use client";

import { useState } from "react";
import { Category, Expense } from "@/lib/types";
import { todayISO } from "@/lib/utils";

interface ExpenseFormProps {
  categories: Category[];
  paymentMethods: string[];
  initial?: Expense | null;
  onSubmit: (data: Omit<Expense, "id" | "createdAt">) => void;
  onCancel: () => void;
}

const inputClass =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[14px] text-[var(--text)] placeholder:text-[var(--text-faint)] transition focus:border-[var(--accent-soft-border)] focus:outline-none";

export default function ExpenseForm({
  categories,
  paymentMethods,
  initial,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? categories[0]?.name ?? "");
  const [amount, setAmount] = useState(initial ? String(initial.amount) : "");
  const [paymentMethod, setPaymentMethod] = useState(
    initial?.paymentMethod ?? paymentMethods[0] ?? ""
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!description.trim()) {
      setError("Add a short description.");
      return;
    }
    if (!numericAmount || numericAmount <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }
    if (!category) {
      setError("Choose a category.");
      return;
    }
    if (!date) {
      setError("Pick a date.");
      return;
    }
    onSubmit({
      date,
      description: description.trim(),
      category,
      amount: Math.round(numericAmount * 100) / 100,
      paymentMethod,
      notes: notes.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12.5px] font-medium text-[var(--text-muted)]">Date</label>
          <input
            type="date"
            value={date}
            max={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12.5px] font-medium text-[var(--text-muted)]">Amount</label>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`${inputClass} tabular-nums`}
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12.5px] font-medium text-[var(--text-muted)]">Description</label>
        <input
          type="text"
          placeholder="e.g. Lunch at Cafe Delight"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          maxLength={120}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12.5px] font-medium text-[var(--text-muted)]">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12.5px] font-medium text-[var(--text-muted)]">Payment method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className={inputClass}
          >
            {paymentMethods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12.5px] font-medium text-[var(--text-muted)]">
          Notes <span className="text-[var(--text-faint)]">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any extra detail worth remembering"
          rows={2}
          className={`${inputClass} resize-none`}
          maxLength={200}
        />
      </div>

      {error && (
        <p className="rounded-lg bg-[var(--expense-soft)] px-3 py-2 text-[12.5px] text-[var(--expense)]">
          {error}
        </p>
      )}

      <div className="mt-1 flex gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-[var(--border)] px-4 py-2.5 text-[13.5px] font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-[13.5px] font-semibold text-[#161006] transition hover:bg-[var(--accent-strong)] active:scale-[0.98]"
        >
          {initial ? "Save changes" : "Add expense"}
        </button>
      </div>
    </form>
  );
}
