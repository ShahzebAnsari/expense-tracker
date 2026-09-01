"use client";

import { useState } from "react";
import { AppSettings, Category } from "@/lib/types";
import { CURRENCIES } from "@/lib/constants";
import { IconPlus, IconTrash, IconEdit, IconCheck, IconClose } from "./Icons";

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  categories: Category[];
  onAddCategory: (name: string) => void;
  onRenameCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
  onResetCategories: () => void;
  onAddPaymentMethod: (m: string) => void;
  onRemovePaymentMethod: (m: string) => void;
  expenseCountByCategory: (name: string) => number;
}

const inputClass =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-[14px] text-[var(--text)] placeholder:text-[var(--text-faint)] transition focus:border-[var(--accent-soft-border)] focus:outline-none";

export default function SettingsView({
  settings,
  onUpdateSettings,
  categories,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
  onResetCategories,
  onAddPaymentMethod,
  onRemovePaymentMethod,
  expenseCountByCategory,
}: SettingsViewProps) {
  const [newCategory, setNewCategory] = useState("");
  const [newMethod, setNewMethod] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [nameInput, setNameInput] = useState(settings.userName);

  function saveName() {
    onUpdateSettings({ userName: nameInput.trim() || "You" });
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditValue(cat.name);
  }

  function confirmEdit() {
    if (editingId) onRenameCategory(editingId, editValue);
    setEditingId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Profile */}
      <Section title="Profile" description="Shown around the app — nothing leaves your browser.">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1.5 block text-[12.5px] font-medium text-[var(--text-muted)]">
              Display name
            </label>
            <div className="flex gap-2">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={saveName}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                className={inputClass}
                maxLength={40}
                placeholder="Your name"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-[12.5px] font-medium text-[var(--text-muted)]">
              Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => onUpdateSettings({ currency: e.target.value })}
              className={inputClass}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} — {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      {/* Categories */}
      <Section
        title="Expense categories"
        description="Add your own or edit the defaults. Categories in use can't be removed."
        action={
          <button
            onClick={onResetCategories}
            className="text-[12.5px] font-medium text-[var(--text-faint)] underline decoration-dotted underline-offset-2 hover:text-[var(--text-muted)]"
          >
            Reset to defaults
          </button>
        }
      >
        <div className="mb-3 flex gap-2">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onAddCategory(newCategory);
                setNewCategory("");
              }
            }}
            placeholder="New category name"
            className={inputClass}
            maxLength={30}
          />
          <button
            onClick={() => {
              onAddCategory(newCategory);
              setNewCategory("");
            }}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3.5 text-[13px] font-semibold text-[#161006] transition hover:bg-[var(--accent-strong)]"
          >
            <IconPlus size={15} />
            Add
          </button>
        </div>

        <ul className="flex flex-col gap-1.5">
          {categories.map((c) => {
            const count = expenseCountByCategory(c.name);
            const isEditing = editingId === c.id;
            return (
              <li
                key={c.id}
                className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-3 py-2.5"
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c.color }} />
                {isEditing ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && confirmEdit()}
                    className="flex-1 rounded-md border border-[var(--border-strong)] bg-[var(--bg)] px-2 py-1 text-[13.5px] text-[var(--text)] focus:outline-none"
                  />
                ) : (
                  <span className="flex-1 text-[13.5px] text-[var(--text)]">{c.name}</span>
                )}
                <span className="shrink-0 text-[11.5px] text-[var(--text-faint)]">
                  {count} {count === 1 ? "entry" : "entries"}
                </span>
                <div className="flex shrink-0 items-center gap-0.5">
                  {isEditing ? (
                    <>
                      <button
                        onClick={confirmEdit}
                        className="rounded-lg p-1.5 text-[var(--positive)] hover:bg-[var(--positive-soft)]"
                        aria-label="Confirm rename"
                      >
                        <IconCheck size={14} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-lg p-1.5 text-[var(--text-faint)] hover:bg-[var(--surface-hover)]"
                        aria-label="Cancel rename"
                      >
                        <IconClose size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(c)}
                        className="rounded-lg p-1.5 text-[var(--text-faint)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
                        aria-label="Rename category"
                      >
                        <IconEdit size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteCategory(c.id)}
                        disabled={count > 0}
                        title={count > 0 ? "Reassign or delete expenses in this category first" : "Delete"}
                        className="rounded-lg p-1.5 text-[var(--text-faint)] transition hover:bg-[var(--expense-soft)] hover:text-[var(--expense)] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                        aria-label="Delete category"
                      >
                        <IconTrash size={14} />
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Payment methods */}
      <Section title="Payment methods" description="Customize the options available in the expense form.">
        <div className="mb-3 flex gap-2">
          <input
            value={newMethod}
            onChange={(e) => setNewMethod(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onAddPaymentMethod(newMethod);
                setNewMethod("");
              }
            }}
            placeholder="New payment method"
            className={inputClass}
            maxLength={30}
          />
          <button
            onClick={() => {
              onAddPaymentMethod(newMethod);
              setNewMethod("");
            }}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3.5 text-[13px] font-semibold text-[#161006] transition hover:bg-[var(--accent-strong)]"
          >
            <IconPlus size={15} />
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {settings.paymentMethods.map((m) => (
            <span
              key={m}
              className="flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-[12.5px] text-[var(--text-muted)]"
            >
              {m}
              <button
                onClick={() => onRemovePaymentMethod(m)}
                aria-label={`Remove ${m}`}
                className="text-[var(--text-faint)] hover:text-[var(--expense)]"
              >
                <IconClose size={12} />
              </button>
            </span>
          ))}
        </div>
      </Section>

      <Section title="Your data" description="Everything is stored locally in this browser via localStorage — nothing is sent to a server.">
        <p className="text-[12.5px] text-[var(--text-faint)]">
          Clearing your browser data or using a different browser/device will start a fresh ledger.
          Use the export options on the Expenses and Reports tabs to keep a backup.
        </p>
      </Section>
    </div>
  );
}

function Section({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[14px] font-semibold text-[var(--text)]">{title}</h3>
          {description && (
            <p className="mt-0.5 text-[12.5px] text-[var(--text-faint)]">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
