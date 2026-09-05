export interface Expense {
  id: string;
  date: string; // yyyy-MM-dd
  description: string;
  category: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
  createdAt: string; // ISO timestamp
}

export interface Category {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
}

export interface AppSettings {
  userName: string;
  currency: string;
  paymentMethods: string[];
}

export type DateRangePreset =
  | "today"
  | "week"
  | "month"
  | "last30"
  | "year"
  | "all"
  | "custom";

export type GroupBy = "category" | "paymentMethod" | "day" | "week" | "month";

/**
 * Append this line to the bottom of your existing src/lib/types.ts so the
 * rest of the app can import Person/LendingTransaction alongside your
 * existing types from "@/lib/types" if you prefer a single import source.
 * (Optional — every new file already imports directly from "@/lib/lending-types".)
 */
export * from "./lending-types";

