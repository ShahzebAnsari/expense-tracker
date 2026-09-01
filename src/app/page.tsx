"use client";

import { useState } from "react";
import Nav, { Tab } from "@/components/Nav";
import Modal from "@/components/Modal";
import ExpenseForm from "@/components/ExpenseForm";
import DashboardView from "@/components/DashboardView";
import ExpensesView from "@/components/ExpensesView";
import ReportsView from "@/components/ReportsView";
import SettingsView from "@/components/SettingsView";
import { useExpenses, useCategories, useSettings } from "@/hooks/useAppData";
import { Expense } from "@/lib/types";

export default function Home() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const { expenses, addExpense, updateExpense, deleteExpense, hydrated: expensesReady } =
    useExpenses();
  const {
    categories,
    addCategory,
    renameCategory,
    deleteCategory,
    resetCategories,
    hydrated: categoriesReady,
  } = useCategories();
  const {
    settings,
    updateSettings,
    addPaymentMethod,
    removePaymentMethod,
    hydrated: settingsReady,
  } = useSettings();

  const ready = expensesReady && categoriesReady && settingsReady;

  function openAddForm() {
    setEditingExpense(null);
    setFormOpen(true);
  }

  function openEditForm(expense: Expense) {
    setEditingExpense(expense);
    setFormOpen(true);
  }

  function handleFormSubmit(data: Omit<Expense, "id" | "createdAt">) {
    if (editingExpense) {
      updateExpense(editingExpense.id, data);
    } else {
      addExpense(data);
    }
    setFormOpen(false);
    setEditingExpense(null);
  }

  function handleDelete(id: string) {
    if (window.confirm("Delete this expense? This can't be undone.")) {
      deleteExpense(id);
    }
  }

  function expenseCountByCategory(name: string) {
    return expenses.filter((e) => e.category === name).length;
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)]">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--border-strong)] border-t-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Nav active={tab} onChange={setTab} onAdd={openAddForm} userName={settings.userName} />

      <main className="flex-1 overflow-x-hidden pb-20 sm:pb-0">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-8">
          {tab === "dashboard" && (
            <DashboardView
              expenses={expenses}
              categories={categories}
              settings={settings}
              onEdit={openEditForm}
              onDelete={handleDelete}
              onAdd={openAddForm}
            />
          )}
          {tab === "expenses" && (
            <ExpensesView
              expenses={expenses}
              categories={categories}
              settings={settings}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          )}
          {tab === "reports" && (
            <ReportsView expenses={expenses} categories={categories} settings={settings} />
          )}
          {tab === "settings" && (
            <SettingsView
              settings={settings}
              onUpdateSettings={updateSettings}
              categories={categories}
              onAddCategory={addCategory}
              onRenameCategory={renameCategory}
              onDeleteCategory={deleteCategory}
              onResetCategories={resetCategories}
              onAddPaymentMethod={addPaymentMethod}
              onRemovePaymentMethod={removePaymentMethod}
              expenseCountByCategory={expenseCountByCategory}
            />
          )}
        </div>
      </main>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingExpense ? "Edit expense" : "Add expense"}
      >
        <ExpenseForm
          categories={categories}
          paymentMethods={settings.paymentMethods}
          initial={editingExpense}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>
    </div>
  );
}
