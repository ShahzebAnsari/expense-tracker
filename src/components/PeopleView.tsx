"use client";

import { useMemo, useState } from "react";
import type { Person, LendingTransaction } from "@/lib/lending-types";
import { getOverallLendingSummary, getPersonLedger, exportPeopleSummaryCSV } from "@/lib/lending-utils";
import { formatAmount } from "@/lib/utils";
import Modal from "./Modal";
import PersonForm from "./PersonForm";
import PersonDetailView from "./PersonDetailView";

interface PeopleViewProps {
  people: Person[];
  transactions: LendingTransaction[];
  currency: string; // e.g. "INR", "USD" — from settings.currency
  onAddPerson: (data: { name: string; contact?: string; notes?: string }) => Person;
  onUpdatePerson: (id: string, data: Partial<Omit<Person, "id" | "createdAt">>) => void;
  onDeletePerson: (id: string) => void;
  onAddTransaction: (data: Omit<LendingTransaction, "id" | "createdAt">) => void;
  onUpdateTransaction: (id: string, data: { date: string; amount: number; dueDate?: string; note?: string }) => void;
  onDeleteTransaction: (id: string) => void;
}

type Row = { person: Person; ledger: ReturnType<typeof getPersonLedger> };

export default function PeopleView({
  people,
  transactions,
  currency,
  onAddPerson,
  onUpdatePerson,
  onDeletePerson,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
}: PeopleViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const summary = useMemo(() => getOverallLendingSummary(people, transactions), [people, transactions]);
  const selectedPerson = people.find((p) => p.id === selectedId) ?? null;

  const handleDelete = (person: Person) => {
    if (confirm(`Remove ${person.name} and all related transactions? This can't be undone.`)) {
      onDeletePerson(person.id);
    }
  };

  if (selectedPerson) {
    const ledger = getPersonLedger(selectedPerson.id, transactions);
    return (
      <PersonDetailView
        person={selectedPerson}
        ledger={ledger}
        currency={currency}
        onBack={() => setSelectedId(null)}
        onUpdatePerson={(data) => onUpdatePerson(selectedPerson.id, data)}
        onDeletePerson={() => {
          onDeletePerson(selectedPerson.id);
          setSelectedId(null);
        }}
        onAddTransaction={(data) => onAddTransaction({ ...data, personId: selectedPerson.id })}
        onUpdateTransaction={onUpdateTransaction}
        onDeleteTransaction={onDeleteTransaction}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-[19px] font-semibold tracking-tight text-[var(--text)]">People</h1>
        <div className="flex gap-2">
          <button
            onClick={() => exportPeopleSummaryCSV(people, transactions)}
            className="rounded-xl border border-[var(--border)] px-3.5 py-2 text-[13px] font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
          >
            Export CSV
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="rounded-xl bg-[var(--accent)] px-3.5 py-2 text-[13px] font-semibold text-[#161006] transition hover:bg-[var(--accent-strong)] active:scale-[0.98]"
          >
            + Add person
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
          <p className="text-[13px] text-[var(--text-muted)]">You will receive</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-400">{formatAmount(summary.totalOwedToMe, currency)}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
          <p className="text-[13px] text-[var(--text-muted)]">You will pay</p>
          <p className="mt-1 text-2xl font-semibold text-rose-400">{formatAmount(summary.totalIOwe, currency)}</p>
        </div>
      </div>

      <Section
        title="People who owe you"
        emptyText="No one owes you money right now."
        rows={summary.lenders}
        currency={currency}
        amountClass="text-emerald-400"
        onSelect={setSelectedId}
        onEdit={setEditingPerson}
        onDelete={handleDelete}
      />

      <Section
        title="People you owe"
        emptyText="You don't owe anyone right now."
        rows={summary.borrowers}
        currency={currency}
        amountClass="text-rose-400"
        onSelect={setSelectedId}
        onEdit={setEditingPerson}
        onDelete={handleDelete}
      />

      {summary.settled.length > 0 && (
        <Section
          title="Settled"
          emptyText=""
          rows={summary.settled}
          currency={currency}
          amountClass="text-[var(--text-muted)]"
          onSelect={setSelectedId}
          onEdit={setEditingPerson}
          onDelete={handleDelete}
        />
      )}

      {summary.noActivity.length > 0 && (
        <Section
          title="Added, no activity yet"
          emptyText=""
          rows={summary.noActivity}
          currency={currency}
          amountClass="text-[var(--text-muted)]"
          onSelect={setSelectedId}
          onEdit={setEditingPerson}
          onDelete={handleDelete}
        />
      )}

      {people.length === 0 && (
        <p className="text-center text-[13px] text-[var(--text-muted)]">
          Add the first person to start tracking lending and borrowing.
        </p>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add person">
        <PersonForm
          onSubmit={(data) => {
            onAddPerson(data);
            setAddOpen(false);
          }}
          onCancel={() => setAddOpen(false)}
        />
      </Modal>

      <Modal open={editingPerson !== null} onClose={() => setEditingPerson(null)} title="Edit person">
        {editingPerson && (
          <PersonForm
            initial={editingPerson}
            onSubmit={(data) => {
              onUpdatePerson(editingPerson.id, data);
              setEditingPerson(null);
            }}
            onCancel={() => setEditingPerson(null)}
          />
        )}
      </Modal>
    </div>
  );
}

function Section({
  title,
  emptyText,
  rows,
  currency,
  amountClass,
  onSelect,
  onEdit,
  onDelete,
}: {
  title: string;
  emptyText: string;
  rows: Row[];
  currency: string;
  amountClass: string;
  onSelect: (id: string) => void;
  onEdit: (person: Person) => void;
  onDelete: (person: Person) => void;
}) {
  if (rows.length === 0 && !emptyText) return null;
  return (
    <div>
      <h2 className="mb-2 text-[12px] font-medium uppercase tracking-wide text-[var(--text-muted)]">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-[13px] text-[var(--text-muted)]">{emptyText}</p>
      ) : (
        <ul className="divide-y divide-[var(--border)] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
          {rows.map(({ person, ledger }) => (
            <li key={person.id} className="flex items-center gap-2 px-2 transition hover:bg-[var(--surface-hover)]">
              <button
                onClick={() => onSelect(person.id)}
                className="flex flex-1 items-center justify-between px-2 py-3 text-left"
              >
                <div>
                  <p className="font-medium text-[var(--text)]">{person.name}</p>
                  {person.contact && <p className="text-[12px] text-[var(--text-muted)]">{person.contact}</p>}
                </div>
                <span className={`font-semibold ${amountClass}`}>
                  {ledger.transactions.length === 0
                    ? "No activity"
                    : ledger.direction === "settled"
                    ? "Settled"
                    : formatAmount(ledger.outstanding, currency)}
                </span>
              </button>
              <button
                onClick={() => onEdit(person)}
                aria-label={`Edit ${person.name}`}
                className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--surface-active)] hover:text-[var(--text)]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={() => onDelete(person)}
                aria-label={`Delete ${person.name}`}
                className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--surface-active)] hover:text-rose-400"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
