"use client";

import { useState, type FormEvent } from "react";
import type { Person } from "@/lib/lending-types";

interface PersonFormProps {
  initial?: Person;
  onSubmit: (data: { name: string; contact?: string; notes?: string }) => void;
  onCancel: () => void;
}

export default function PersonForm({ initial, onSubmit, onCancel }: PersonFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [contact, setContact] = useState(initial?.contact ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    onSubmit({ name: name.trim(), contact: contact.trim() || undefined, notes: notes.trim() || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-[var(--text-muted)]">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text)]"
          placeholder="e.g. Ravi Kumar"
          autoFocus
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-[var(--text-muted)]">Contact (phone / email)</label>
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text)]"
          placeholder="Optional"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-[var(--text-muted)]">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-[var(--text)]"
          rows={2}
          placeholder="Optional — e.g. relationship, how you know them"
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
          {initial ? "Save changes" : "Add person"}
        </button>
      </div>
    </form>
  );
}
