"use client";

import { useRef, useState } from "react";
import type { Person, PersonLedger, LendingTransaction, LendingTransactionType } from "@/lib/lending-types";
import { exportPersonTimelineCSV, shareOrDownloadPng, formatMoney } from "@/lib/lending-utils";
import Modal from "./Modal";
import PersonForm from "./PersonForm";
import LendingTransactionForm from "./LendingTransactionForm";

interface PersonDetailViewProps {
  person: Person;
  ledger: PersonLedger;
  currency: string; // e.g. "INR", "USD" — from settings.currency
  onBack: () => void;
  onUpdatePerson: (data: { name: string; contact?: string; notes?: string }) => void;
  onDeletePerson: () => void;
  onAddTransaction: (data: Omit<LendingTransaction, "id" | "createdAt" | "personId">) => void;
  onUpdateTransaction: (id: string, data: { date: string; amount: number; dueDate?: string; note?: string }) => void;
  onDeleteTransaction: (id: string) => void;
}

const TYPE_LABEL: Record<LendingTransactionType, string> = {
  lend: "Lent",
  receive: "Received",
  borrow: "Borrowed",
  repay: "Repaid",
};

const FORM_TITLE: Record<LendingTransactionType, string> = {
  lend: "Lend money",
  receive: "Receive money",
  borrow: "Borrow money",
  repay: "Repay money",
};

export default function PersonDetailView({
  person,
  ledger,
  currency,
  onBack,
  onUpdatePerson,
  onDeletePerson,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
}: PersonDetailViewProps) {
  const [activeForm, setActiveForm] = useState<LendingTransactionType | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<LendingTransaction | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const { direction, outstanding } = ledger;

  // Which two actions to show depends on the current relationship:
  // borrower-of-yours -> [Lend more / Receive], your-creditor -> [Borrow more / Repay],
  // settled -> both starting actions.
  const actions: { type: LendingTransactionType; label: string; style: string }[] =
    direction === "they_owe_me"
      ? [
          { type: "lend", label: "Lend more", style: "bg-emerald-600 hover:bg-emerald-500" },
          { type: "receive", label: "Receive money", style: "bg-[var(--surface-active)] hover:bg-[var(--surface-hover)]" },
        ]
      : direction === "i_owe_them"
      ? [
          { type: "borrow", label: "Borrow more", style: "bg-rose-600 hover:bg-rose-500" },
          { type: "repay", label: "Repay", style: "bg-[var(--surface-active)] hover:bg-[var(--surface-hover)]" },
        ]
      : [
          { type: "lend", label: "Lend money", style: "bg-emerald-600 hover:bg-emerald-500" },
          { type: "borrow", label: "Borrow money", style: "bg-rose-600 hover:bg-rose-500" },
        ];

  const handleShare = async () => {
    if (timelineRef.current) {
      await shareOrDownloadPng(
        timelineRef.current,
        `${person.name.replace(/\s+/g, "-").toLowerCase()}-timeline.png`,
        `${person.name}'s ledger`
      );
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-[13px] text-[var(--text-muted)] hover:text-[var(--text)]">
        &larr; Back to people
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
        <div>
          <h1 className="text-[19px] font-semibold tracking-tight text-[var(--text)]">{person.name}</h1>
          {person.contact && <p className="text-[13px] text-[var(--text-muted)]">{person.contact}</p>}
          <p className="mt-2 text-[13.5px] text-[var(--text-muted)]">
            {direction === "they_owe_me" && (
              <>
                Owes you <span className="font-semibold text-emerald-400">{formatMoney(outstanding, currency)}</span>
              </>
            )}
            {direction === "i_owe_them" && (
              <>
                You owe <span className="font-semibold text-rose-400">{formatMoney(outstanding, currency)}</span>
              </>
            )}
            {direction === "settled" && <span className="font-semibold text-[var(--text-muted)]">Settled up</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditOpen(true)}
            className="rounded-xl border border-[var(--border)] px-3.5 py-2 text-[13px] font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
          >
            Edit
          </button>
          <button
            onClick={handleShare}
            className="rounded-xl border border-[var(--border)] px-3.5 py-2 text-[13px] font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
          >
            Share
          </button>
          <button
            onClick={() => exportPersonTimelineCSV(person, ledger)}
            className="rounded-xl border border-[var(--border)] px-3.5 py-2 text-[13px] font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
          >
            CSV
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        {actions.map((a) => (
          <button
            key={a.type}
            onClick={() => setActiveForm(a.type)}
            className={`flex-1 rounded-xl px-4 py-3 text-[13.5px] font-semibold text-white transition active:scale-[0.98] ${a.style}`}
          >
            {a.label}
          </button>
        ))}
      </div>

      {/* Everything inside this div is what gets captured for the PNG share */}
      <div ref={timelineRef} className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[12px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
            Transaction timeline
          </h2>
          <span className="text-[12px] text-[var(--text-muted)]">
            {direction === "settled"
              ? "Settled"
              : direction === "they_owe_me"
              ? `Owed to you: ${formatMoney(outstanding, currency)}`
              : `You owe: ${formatMoney(outstanding, currency)}`}
          </span>
        </div>
        {ledger.transactions.length === 0 ? (
          <p className="text-[13px] text-[var(--text-muted)]">No transactions yet.</p>
        ) : (
          <ul className="space-y-3">
            {[...ledger.transactions].reverse().map((t) => (
              <li
                key={t.id}
                className="flex items-start justify-between gap-3 border-b border-[var(--border)] pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="text-[13.5px] font-medium text-[var(--text)]">
                    {TYPE_LABEL[t.type]} · {t.date}
                  </p>
                  {t.dueDate && <p className="text-[12px] text-[var(--text-muted)]">Due {t.dueDate}</p>}
                  {t.note && <p className="text-[12px] text-[var(--text-muted)]">{t.note}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-semibold ${
                      t.type === "lend" || t.type === "repay" ? "text-rose-400" : "text-emerald-400"
                    }`}
                  >
                    {formatMoney(t.amount, currency)}
                  </span>
                  <button
                    onClick={() => setEditingTransaction(t)}
                    className="text-[12px] text-[var(--text-muted)] hover:text-[var(--text)]"
                    aria-label="Edit transaction"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteTransaction(t.id)}
                    className="text-[12px] text-[var(--text-muted)] hover:text-rose-400"
                    aria-label="Delete transaction"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit person">
        <PersonForm
          initial={person}
          onSubmit={(data) => {
            onUpdatePerson(data);
            setEditOpen(false);
          }}
          onCancel={() => setEditOpen(false)}
        />
        <button
          onClick={() => {
            if (confirm(`Remove ${person.name} and all related transactions?`)) onDeletePerson();
          }}
          className="mt-4 text-[13px] text-rose-400 hover:text-rose-300"
        >
          Delete person
        </button>
      </Modal>

      <Modal open={activeForm !== null} onClose={() => setActiveForm(null)} title={activeForm ? FORM_TITLE[activeForm] : ""}>
        {activeForm && (
          <LendingTransactionForm
            type={activeForm}
            onSubmit={(data) => {
              onAddTransaction({ ...data, type: activeForm });
              setActiveForm(null);
            }}
            onCancel={() => setActiveForm(null)}
          />
        )}
      </Modal>

      <Modal
        open={editingTransaction !== null}
        onClose={() => setEditingTransaction(null)}
        title={editingTransaction ? `Edit ${TYPE_LABEL[editingTransaction.type].toLowerCase()} entry` : ""}
      >
        {editingTransaction && (
          <LendingTransactionForm
            type={editingTransaction.type}
            initial={{
              date: editingTransaction.date,
              amount: editingTransaction.amount,
              dueDate: editingTransaction.dueDate,
              note: editingTransaction.note,
            }}
            onSubmit={(data) => {
              onUpdateTransaction(editingTransaction.id, data);
              setEditingTransaction(null);
            }}
            onCancel={() => setEditingTransaction(null)}
          />
        )}
      </Modal>
    </div>
  );
}
