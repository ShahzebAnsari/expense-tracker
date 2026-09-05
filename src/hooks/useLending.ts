"use client";

import { useLocalStorage } from "./useLocalStorage";
import type { Person, LendingTransaction } from "@/lib/lending-types";

const PEOPLE_KEY = "expense-tracker:people";
const TRANSACTIONS_KEY = "expense-tracker:lending-transactions";

function generateId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function usePeople() {
  const [people, setPeople] = useLocalStorage<Person[]>(PEOPLE_KEY, []);

  const addPerson = (data: { name: string; contact?: string; notes?: string }) => {
    const person: Person = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    setPeople((prev) => [...prev, person]);
    return person;
  };

  const updatePerson = (id: string, data: Partial<Omit<Person, "id" | "createdAt">>) => {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const deletePerson = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  return { people, addPerson, updatePerson, deletePerson };
}

export function useLendingTransactions() {
  const [transactions, setTransactions] = useLocalStorage<LendingTransaction[]>(TRANSACTIONS_KEY, []);

  const addTransaction = (data: Omit<LendingTransaction, "id" | "createdAt">) => {
    const txn: LendingTransaction = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    setTransactions((prev) => [...prev, txn]);
    return txn;
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTransaction = (
    id: string,
    data: Partial<Omit<LendingTransaction, "id" | "createdAt" | "personId">>
  ) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  };

  // Call this when a person is deleted so their history doesn't linger orphaned.
  const deleteTransactionsForPerson = (personId: string) => {
    setTransactions((prev) => prev.filter((t) => t.personId !== personId));
  };

  return { transactions, addTransaction, updateTransaction, deleteTransaction, deleteTransactionsForPerson };
}
