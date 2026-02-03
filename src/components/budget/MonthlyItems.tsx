"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import CardListSection from "@/components/budget/CardListSection";
import EntryCard from "@/components/budget/EntryCard";
import ExpenseGroup from "@/components/budget/ExpenseGroup";
import { formatCurrency } from "@/lib/format";
import { supabaseQueryKeys } from "@/lib/supabase/queries";
import {
  createMonthlyIncome,
  createMonthlyExpense,
  createMonthlyAllocation,
  updateMonthlyIncome,
  updateMonthlyExpense,
  updateMonthlyAllocation,
  deleteMonthlyIncome,
  deleteMonthlyExpense,
  deleteMonthlyAllocation
} from "@/lib/supabase/items";

interface MonthlyItemsProps {
  budgetId: string;
  currency: string;
  mode: "income" | "expenses" | "allocations";
  canEdit?: boolean;
  incomes: Array<{ id: string; name: string; amount: number; template_income_id?: string | null }>;
  expenses: Array<{ id: string; name: string; amount: number; category: string; template_expense_id?: string | null }>;
  allocations: Array<{ id: string; name: string; amount: number; type: "savings" | "monthly_budget"; template_allocation_id?: string | null }>;
  templateIncomes: Array<{ id: string; amount: number }>;
  templateExpenses: Array<{ id: string; amount: number }>;
  templateAllocations: Array<{ id: string; amount: number }>;
  year: number;
  month: number;
}

function diffBadge(current: number, baseline?: number | null) {
  if (baseline === undefined || baseline === null) return undefined;
  const diff = current - baseline;
  if (diff === 0) return undefined;
  return {
    value: diff > 0 ? `+${diff}` : `${diff}`,
    tone: diff > 0 ? "over" : "under"
  } as { value: string; tone: "over" | "under" };
}

export default function MonthlyItems({
  budgetId,
  currency,
  mode,
  canEdit = true,
  incomes,
  expenses,
  allocations,
  templateIncomes,
  templateExpenses,
  templateAllocations,
  year,
  month
}: MonthlyItemsProps) {
  const { t, i18n } = useTranslation();
  const [busy, setBusy] = useState(false);
  const queryClient = useQueryClient();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.monthlyBudget(year, month) });
  };

  const handleCreateIncome = async (values: { name: string; amount: number }) => {
    setBusy(true);
    try {
      await createMonthlyIncome(budgetId, {
        name: values.name,
        amount: values.amount
      });
      toast.success(t("common.saved"));
      refresh();
    } catch (error) {
      toast.error(t("common.saveError"));
    } finally {
      setBusy(false);
    }
  };

  const handleCreateExpense = async (values: { name: string; amount: number; details: string }) => {
    setBusy(true);
    try {
      await createMonthlyExpense(budgetId, {
        name: values.name,
        amount: values.amount,
        category: values.details || "General"
      });
      toast.success(t("common.saved"));
      refresh();
    } catch (error) {
      toast.error(t("common.saveError"));
    } finally {
      setBusy(false);
    }
  };

  const handleCreateAllocation = async (values: { name: string; amount: number }) => {
    setBusy(true);
    try {
      await createMonthlyAllocation(budgetId, {
        name: values.name,
        amount: values.amount,
        type: "monthly_budget"
      });
      toast.success(t("common.saved"));
      refresh();
    } catch (error) {
      toast.error(t("common.saveError"));
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateIncome = async (id: string, values: { name: string; amount: number }) => {
    setBusy(true);
    try {
      await updateMonthlyIncome(id, { name: values.name, amount: values.amount });
      toast.success(t("common.saved"));
      refresh();
    } catch (error) {
      toast.error(t("common.saveError"));
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateExpense = async (id: string, values: { name: string; amount: number; details: string }) => {
    setBusy(true);
    try {
      await updateMonthlyExpense(id, {
        name: values.name,
        amount: values.amount,
        category: values.details || "General"
      });
      toast.success(t("common.saved"));
      refresh();
    } catch (error) {
      toast.error(t("common.saveError"));
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateAllocation = async (id: string, values: { name: string; amount: number }) => {
    setBusy(true);
    try {
      await updateMonthlyAllocation(id, {
        name: values.name,
        amount: values.amount,
        type: "monthly_budget"
      });
      toast.success(t("common.saved"));
      refresh();
    } catch (error) {
      toast.error(t("common.saveError"));
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteIncome = async (id: string) => {
    setBusy(true);
    try {
      await deleteMonthlyIncome(id);
      toast.success(t("common.deleted"));
      refresh();
    } catch (error) {
      toast.error(t("common.deleteError"));
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    setBusy(true);
    try {
      await deleteMonthlyExpense(id);
      toast.success(t("common.deleted"));
      refresh();
    } catch (error) {
      toast.error(t("common.deleteError"));
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteAllocation = async (id: string) => {
    setBusy(true);
    try {
      await deleteMonthlyAllocation(id);
      toast.success(t("common.deleted"));
      refresh();
    } catch (error) {
      toast.error(t("common.deleteError"));
    } finally {
      setBusy(false);
    }
  };

  if (mode === "income") {
    return (
      <CardListSection
        title={t("templates.income")}
        actionLabel={t("templates.addIncome")}
        disabled={busy || !canEdit}
        onCreate={canEdit ? handleCreateIncome : undefined}
      >
        {incomes.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("budgets.emptyItems")}</p>
        ) : (
          incomes.map((item) => {
            const baseline = templateIncomes.find((tItem) => tItem.id === item.template_income_id)?.amount;
            return (
              <EntryCard
                key={item.id}
                title={item.name}
                amount={formatCurrency(item.amount, currency, i18n.language)}
                meta={t("templates.monthlyAssigned", { name: t("common.memberLabel") })}
                diff={diffBadge(item.amount, baseline)}
                onSave={canEdit ? (values) => handleUpdateIncome(item.id, values) : undefined}
                onDelete={canEdit ? () => handleDeleteIncome(item.id) : undefined}
                initialValues={{ name: item.name, amount: item.amount }}
              />
            );
          })
        )}
      </CardListSection>
    );
  }

  if (mode === "expenses") {
    return (
      <CardListSection
        title={t("templates.expenses")}
        actionLabel={t("templates.addExpense")}
        disabled={busy || !canEdit}
        onCreate={canEdit ? handleCreateExpense : undefined}
      >
        {expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("budgets.emptyItems")}</p>
        ) : (
          <ExpenseGroup
            items={expenses}
            currency={currency}
            onSave={canEdit ? (id, values) => handleUpdateExpense(id, values) : undefined}
            onDelete={canEdit ? (id) => handleDeleteExpense(id) : undefined}
          />
        )}
      </CardListSection>
    );
  }

  return (
    <CardListSection
      title={t("templates.allocations")}
      actionLabel={t("templates.addAllocation")}
      disabled={busy || !canEdit}
      onCreate={canEdit ? handleCreateAllocation : undefined}
    >
      {allocations.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("budgets.emptyItems")}</p>
      ) : (
        allocations.map((item) => {
          const baseline = templateAllocations.find((tItem) => tItem.id === item.template_allocation_id)?.amount;
          return (
            <EntryCard
              key={item.id}
              title={item.name}
              amount={formatCurrency(item.amount, currency, i18n.language)}
              meta={
                item.type === "savings"
                  ? t("templates.savingsHousehold")
                  : t("templates.monthlyBudgetHousehold")
              }
              badge={
                item.type === "savings"
                  ? t("templates.labels.savings")
                  : t("templates.labels.monthlyBudget")
              }
              diff={diffBadge(item.amount, baseline)}
              onSave={canEdit ? (values) => handleUpdateAllocation(item.id, values) : undefined}
              onDelete={canEdit ? () => handleDeleteAllocation(item.id) : undefined}
              initialValues={{ name: item.name, amount: item.amount }}
            />
          );
        })
      )}
    </CardListSection>
  );
}
