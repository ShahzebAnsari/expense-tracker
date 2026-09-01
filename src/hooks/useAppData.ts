"use client";

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { Expense, Category, AppSettings } from "@/lib/types";
import {
  STORAGE_KEYS,
  DEFAULT_CATEGORIES,
  DEFAULT_SETTINGS,
  CATEGORY_COLORS,
} from "@/lib/constants";
import { uid } from "@/lib/utils";

export function useExpenses() {
  const [expenses, setExpenses, hydrated] = useLocalStorage<Expense[]>(
    STORAGE_KEYS.expenses,
    []
  );

  const addExpense = useCallback(
    (input: Omit<Expense, "id" | "createdAt">) => {
      const expense: Expense = {
        ...input,
        id: uid(),
        createdAt: new Date().toISOString(),
      };
      setExpenses((prev) => [expense, ...prev]);
      return expense;
    },
    [setExpenses]
  );

  const updateExpense = useCallback(
    (id: string, patch: Partial<Omit<Expense, "id" | "createdAt">>) => {
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
      );
    },
    [setExpenses]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    },
    [setExpenses]
  );

  return { expenses, addExpense, updateExpense, deleteExpense, hydrated };
}

export function useCategories() {
  const [categories, setCategories, hydrated] = useLocalStorage<Category[]>(
    STORAGE_KEYS.categories,
    DEFAULT_CATEGORIES
  );

  const addCategory = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      setCategories((prev) => {
        if (prev.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
          return prev;
        }
        const color = CATEGORY_COLORS[prev.length % CATEGORY_COLORS.length];
        return [
          ...prev,
          { id: uid(), name: trimmed, color, isDefault: false },
        ];
      });
    },
    [setCategories]
  );

  const renameCategory = useCallback(
    (id: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: trimmed } : c))
      );
    },
    [setCategories]
  );

  const deleteCategory = useCallback(
    (id: string) => {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    },
    [setCategories]
  );

  const resetCategories = useCallback(() => {
    setCategories(DEFAULT_CATEGORIES);
  }, [setCategories]);

  return {
    categories,
    addCategory,
    renameCategory,
    deleteCategory,
    resetCategories,
    hydrated,
  };
}

export function useSettings() {
  const [settings, setSettings, hydrated] = useLocalStorage<AppSettings>(
    STORAGE_KEYS.settings,
    DEFAULT_SETTINGS
  );

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      setSettings((prev) => ({ ...prev, ...patch }));
    },
    [setSettings]
  );

  const addPaymentMethod = useCallback(
    (method: string) => {
      const trimmed = method.trim();
      if (!trimmed) return;
      setSettings((prev) => {
        if (prev.paymentMethods.some((m) => m.toLowerCase() === trimmed.toLowerCase())) {
          return prev;
        }
        return { ...prev, paymentMethods: [...prev.paymentMethods, trimmed] };
      });
    },
    [setSettings]
  );

  const removePaymentMethod = useCallback(
    (method: string) => {
      setSettings((prev) => ({
        ...prev,
        paymentMethods: prev.paymentMethods.filter((m) => m !== method),
      }));
    },
    [setSettings]
  );

  return {
    settings,
    updateSettings,
    addPaymentMethod,
    removePaymentMethod,
    hydrated,
  };
}
