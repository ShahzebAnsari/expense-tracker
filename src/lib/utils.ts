import {
  format,
  isToday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  subDays,
  parseISO,
  startOfDay,
} from "date-fns";
import { Expense, DateRangePreset } from "./types";
import { currencySymbol } from "./constants";

export function formatAmount(amount: number, currency: string): string {
  const symbol = currencySymbol(currency);
  const formatted = amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formatted}`;
}

export function formatDateDisplay(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "d MMM yyyy");
  } catch {
    return dateStr;
  }
}

export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function filterByPreset(
  expenses: Expense[],
  preset: DateRangePreset,
  customStart?: string,
  customEnd?: string
): Expense[] {
  if (preset === "all") return expenses;

  if (preset === "custom" && customStart && customEnd) {
    const start = startOfDay(parseISO(customStart)).getTime();
    const end = startOfDay(parseISO(customEnd)).getTime() + 86400000 - 1;
    return expenses.filter((e) => {
      const t = startOfDay(parseISO(e.date)).getTime();
      return t >= start && t <= end;
    });
  }

  return expenses.filter((e) => {
    const d = parseISO(e.date);
    switch (preset) {
      case "today":
        return isToday(d);
      case "week":
        return isThisWeek(d, { weekStartsOn: 1 });
      case "month":
        return isThisMonth(d);
      case "last30":
        return d.getTime() >= startOfDay(subDays(new Date(), 29)).getTime();
      case "year":
        return isThisYear(d);
      default:
        return true;
    }
  });
}

export function sumExpenses(expenses: Expense[]): number {
  return expenses.reduce((acc, e) => acc + e.amount, 0);
}

export function groupSum(
  expenses: Expense[],
  keyFn: (e: Expense) => string
): { key: string; total: number; count: number }[] {
  const map = new Map<string, { total: number; count: number }>();
  for (const e of expenses) {
    const key = keyFn(e);
    const existing = map.get(key) ?? { total: 0, count: 0 };
    existing.total += e.amount;
    existing.count += 1;
    map.set(key, existing);
  }
  return Array.from(map.entries())
    .map(([key, v]) => ({ key, ...v }))
    .sort((a, b) => b.total - a.total);
}

export function dailyTotals(
  expenses: Expense[]
): { date: string; total: number }[] {
  const map = new Map<string, number>();
  for (const e of expenses) {
    map.set(e.date, (map.get(e.date) ?? 0) + e.amount);
  }
  return Array.from(map.entries())
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function monthlyTotals(
  expenses: Expense[]
): { date: string; total: number }[] {
  const map = new Map<string, number>();
  for (const e of expenses) {
    const key = e.date.slice(0, 7); // yyyy-MM
    map.set(key, (map.get(key) ?? 0) + e.amount);
  }
  return Array.from(map.entries())
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function expensesToCSV(expenses: Expense[]): string {
  const header = ["Date", "Description", "Category", "Amount", "Payment Method", "Notes"];
  const rows = expenses.map((e) => [
    e.date,
    csvEscape(e.description),
    csvEscape(e.category),
    e.amount.toFixed(2),
    csvEscape(e.paymentMethod),
    csvEscape(e.notes ?? ""),
  ]);
  return [header, ...rows].map((r) => r.join(",")).join("\n");
}

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
