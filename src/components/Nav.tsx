"use client";

import { IconDashboard, IconList, IconChart, IconSettings, IconPlus, IconPeople } from "./Icons";

export type Tab = "dashboard" | "expenses" | "reports" | "settings" | "people";

const items: { id: Tab; label: string; icon: typeof IconDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: IconDashboard },
  { id: "expenses", label: "Expenses", icon: IconList },
  { id: "people", label: "People", icon: IconPeople },
  { id: "reports", label: "Reports", icon: IconChart },
  { id: "settings", label: "Settings", icon: IconSettings },
];

interface NavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
  onAdd: () => void;
  userName: string;
}

export default function Nav({ active, onChange, onAdd, userName }: NavProps) {
  const initial = userName.trim().charAt(0).toUpperCase() || "Y";

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-6 sm:flex">
        <div className="mb-8 flex items-center gap-2.5 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-soft-border)] text-[var(--accent-strong)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h10M4 18h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="19" cy="12" r="2.4" fill="currentColor" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[var(--text)]">Ledger</span>
        </div>

        <button
          onClick={onAdd}
          className="mb-6 flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-3.5 py-2.5 text-[13.5px] font-semibold text-[#161006] transition hover:bg-[var(--accent-strong)] active:scale-[0.98]"
        >
          <IconPlus size={16} />
          Add expense
        </button>

        <nav className="flex flex-1 flex-col gap-1">
          {items.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition ${
                active === id
                  ? "bg-[var(--surface-active)] text-[var(--text)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
              }`}
            >
              <Icon size={17} className={active === id ? "text-[var(--accent-strong)]" : ""} />
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] px-3 py-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[12px] font-semibold text-[var(--accent-strong)]">
            {initial}
          </div>
          <span className="truncate text-[13px] text-[var(--text-muted)]">{userName}</span>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3.5 sm:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent-soft-border)] text-[var(--accent-strong)]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h10M4 18h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="19" cy="12" r="2.4" fill="currentColor" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[var(--text)]">Ledger</span>
        </div>
        <button
          onClick={onAdd}
          aria-label="Add expense"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-[#161006] transition active:scale-95"
        >
          <IconPlus size={18} />
        </button>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-[var(--border)] bg-[var(--bg-elevated)]/95 backdrop-blur sm:hidden">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition ${
              active === id ? "text-[var(--accent-strong)]" : "text-[var(--text-muted)]"
            }`}
          >
            <Icon size={19} />
            {label}
          </button>
        ))}
      </nav>
    </>
  );
}
