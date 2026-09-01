import { Category, AppSettings } from "./types";

export const STORAGE_KEYS = {
  expenses: "expense-tracker:expenses",
  categories: "expense-tracker:categories",
  settings: "expense-tracker:settings",
  version: "expense-tracker:version",
} as const;

export const CATEGORY_COLORS = [
  "var(--cat-1)",
  "var(--cat-2)",
  "var(--cat-3)",
  "var(--cat-4)",
  "var(--cat-5)",
  "var(--cat-6)",
  "var(--cat-7)",
  "var(--cat-8)",
  "var(--cat-9)",
  "var(--cat-10)",
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "food-dining", name: "Food & Dining", color: CATEGORY_COLORS[0], isDefault: true },
  { id: "transport", name: "Transport", color: CATEGORY_COLORS[1], isDefault: true },
  { id: "grocery", name: "Grocery", color: CATEGORY_COLORS[2], isDefault: true },
  { id: "personal-care", name: "Personal Care", color: CATEGORY_COLORS[3], isDefault: true },
  { id: "banking-finance", name: "Banking/Finance", color: CATEGORY_COLORS[4], isDefault: true },
  { id: "healthcare", name: "Healthcare", color: CATEGORY_COLORS[5], isDefault: true },
  { id: "bills", name: "Bills", color: CATEGORY_COLORS[6], isDefault: true },
  { id: "entertainment", name: "Entertainment", color: CATEGORY_COLORS[7], isDefault: true },
  { id: "others", name: "Others", color: CATEGORY_COLORS[9], isDefault: true },
];

export const DEFAULT_PAYMENT_METHODS = [
  "Cash",
  "Debit Card",
  "Credit Card",
  "UPI",
  "Net Banking",
  "Wallet",
];

export const DEFAULT_SETTINGS: AppSettings = {
  userName: "You",
  currency: "INR",
  paymentMethods: DEFAULT_PAYMENT_METHODS,
};

export const CURRENCIES: { code: string; symbol: string; label: string }[] = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
  { code: "SGD", symbol: "S$", label: "Singapore Dollar" },
];

export function currencySymbol(code: string): string {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}
