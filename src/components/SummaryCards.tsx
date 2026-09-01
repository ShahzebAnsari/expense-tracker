"use client";

import { formatAmount } from "@/lib/utils";
import { IconWallet, IconTrendingUp, IconCalendar, IconChart } from "./Icons";

interface SummaryCardsProps {
  today: number;
  week: number;
  month: number;
  topCategory: { key: string; total: number } | null;
  currency: string;
}

export default function SummaryCards({
  today,
  week,
  month,
  topCategory,
  currency,
}: SummaryCardsProps) {
  const cards = [
    {
      label: "Today",
      value: formatAmount(today, currency),
      icon: IconWallet,
      accent: "var(--accent-strong)",
    },
    {
      label: "This week",
      value: formatAmount(week, currency),
      icon: IconCalendar,
      accent: "var(--positive)",
    },
    {
      label: "This month",
      value: formatAmount(month, currency),
      icon: IconTrendingUp,
      accent: "var(--expense)",
    },
    {
      label: "Top category",
      value: topCategory ? topCategory.key : "—",
      sub: topCategory ? formatAmount(topCategory.total, currency) : "No data yet",
      icon: IconChart,
      accent: "#5aa9e6",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[12.5px] font-medium text-[var(--text-muted)]">{c.label}</span>
            <c.icon size={16} className="text-[var(--text-faint)]" />
          </div>
          <p
            className="truncate text-[19px] font-semibold tabular-nums tracking-tight"
            style={{ color: c.accent }}
          >
            {c.value}
          </p>
          {c.sub && <p className="mt-0.5 truncate text-[12px] text-[var(--text-faint)]">{c.sub}</p>}
        </div>
      ))}
    </div>
  );
}
