"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Category } from "@/lib/types";
import { formatAmount, formatDateDisplay } from "@/lib/utils";

interface TooltipPayloadItem {
  name?: string;
  value?: number;
  payload?: Record<string, unknown>;
}

function ChartTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  currency: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-[12.5px] shadow-xl">
      <p className="font-medium text-[var(--text)]">{item.name}</p>
      <p className="tabular-nums text-[var(--text-muted)]">
        {formatAmount(Number(item.value ?? 0), currency)}
      </p>
    </div>
  );
}

export function CategoryPieChart({
  data,
  categories,
  currency,
}: {
  data: { key: string; total: number }[];
  categories: Category[];
  currency: string;
}) {
  const colorFor = (name: string) =>
    categories.find((c) => c.name === name)?.color ?? "var(--cat-10)";

  if (data.length === 0) {
    return <EmptyChart label="Add expenses to see the category breakdown." />;
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <ResponsiveContainer width="100%" height={220} className="sm:w-1/2">
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="key"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((d) => (
              <Cell key={d.key} fill={colorFor(d.key)} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip currency={currency} />} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="flex w-full flex-col gap-2 sm:w-1/2">
        {data.slice(0, 8).map((d) => (
          <li key={d.key} className="flex items-center justify-between gap-2 text-[13px]">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: colorFor(d.key) }}
              />
              <span className="truncate text-[var(--text-muted)]">{d.key}</span>
            </span>
            <span className="shrink-0 tabular-nums font-medium text-[var(--text)]">
              {formatAmount(d.total, currency)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TrendBarChart({
  data,
  currency,
  dateKey = "date",
}: {
  data: { date: string; total: number }[];
  currency: string;
  dateKey?: string;
}) {
  if (data.length === 0) {
    return <EmptyChart label="Add expenses to see spending over time." />;
  }

  const formatted = data.map((d) => ({
    ...d,
    label:
      dateKey === "date"
        ? formatDateDisplay(d.date).replace(/\s\d{4}$/, "")
        : formatMonthLabel(d.date),
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--text-faint)", fontSize: 11 }}
          axisLine={{ stroke: "var(--border)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--text-faint)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip content={<ChartTooltip currency={currency} />} cursor={{ fill: "var(--surface-hover)" }} />
        <Bar dataKey="total" fill="var(--accent)" radius={[4, 4, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PaymentMethodChart({
  data,
  currency,
}: {
  data: { key: string; total: number }[];
  currency: string;
}) {
  if (data.length === 0) {
    return <EmptyChart label="Add expenses to compare payment methods." />;
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(180, data.length * 42)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
      >
        <CartesianGrid stroke="var(--border)" horizontal={false} />
        <XAxis type="number" tick={{ fill: "var(--text-faint)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="key"
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={110}
        />
        <Tooltip content={<ChartTooltip currency={currency} />} cursor={{ fill: "var(--surface-hover)" }} />
        <Bar dataKey="total" fill="#5aa9e6" radius={[0, 4, 4, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function formatMonthLabel(yyyyMM: string): string {
  const [y, m] = yyyyMM.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-[180px] items-center justify-center text-center text-[13px] text-[var(--text-faint)]">
      {label}
    </div>
  );
}
