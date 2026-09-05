export interface Person {
  id: string;
  name: string;
  contact?: string;
  notes?: string;
  createdAt: string; // ISO timestamp
}

export type LendingTransactionType = "lend" | "receive" | "borrow" | "repay";
// lend    -> money you gave out (increases what they owe you)
// receive -> repayment you collected from them (decreases what they owe you)
// borrow  -> money you took from them (increases what you owe them)
// repay   -> money you paid back to them (decreases what you owe them)

export interface LendingTransaction {
  id: string;
  personId: string;
  type: LendingTransactionType;
  date: string; // yyyy-mm-dd
  amount: number;
  dueDate?: string; // only meaningful for "lend" / "borrow"
  note?: string;
  createdAt: string; // ISO timestamp
}

export type LedgerDirection = "they_owe_me" | "i_owe_them" | "settled";

export interface PersonLedger {
  transactions: LendingTransaction[]; // sorted oldest -> newest
  lentTotal: number;
  receivedTotal: number;
  borrowedTotal: number;
  repaidTotal: number;
  outstanding: number; // always >= 0
  direction: LedgerDirection;
}
