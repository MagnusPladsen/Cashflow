"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import CardListSection from "@/components/budget/CardListSection";
import EntryCard from "@/components/budget/EntryCard";
import type { EntryEditorConfig } from "@/components/budget/EntryEditor";
import { formatCurrency } from "@/lib/format";
import {
  createTemplateIncome,
  createTemplateExpense,
  createTemplateAllocation,
  updateTemplateIncome,
  updateTemplateExpense,
  updateTemplateAllocation,
  deleteTemplateIncome,
  deleteTemplateExpense,
  deleteTemplateAllocation
} from "@/lib/supabase/items";
import { supabaseQueryKeys } from "@/lib/supabase/queries";

interface TemplateItemsProps {
  templateId: string;
  currency: string;
  mode: "income" | "expenses" | "allocations";
  canEdit?: boolean;
  incomes: Array<{ id: string; name: string; amount: number }>;
  expenses: Array<{
    id: string;
    name: string;
    amount: number;
    category: string;
    type?: "expense" | "spending_transfer";
    spending_account?: string | null;
  }>;
  allocations: Array<{ id: string; name: string; amount: number; type: "savings" | "monthly_budget" }>;
}

export default function TemplateItems({
  templateId,
  currency,
  mode,
  canEdit = true,
  incomes,
  expenses,
  allocations
}: TemplateItemsProps) {
  const { t, i18n } = useTranslation();
  const [busy, setBusy] = useState(false);
  const queryClient = useQueryClient();

  const expenseEditorConfig: EntryEditorConfig = {
    detailsLabel: t("budgets.expenseCategoryLabel"),
    detailsPlaceholder: t("budgets.expenseCategoryPlaceholder"),
    detailsHint: t("budgets.expenseCategoryHint"),
    typeLabel: t("budgets.expenseTypeLabel"),
    typeHint: t("budgets.expenseTypeHint"),
    typeOptions: [
      { value: "expense", label: t("budgets.expenseTypeExpense") },
      { value: "spending_transfer", label: t("budgets.expenseTypeTransfer") }
    ],
    accountLabel: t("budgets.spendingAccountLabel"),
    accountPlaceholder: t("budgets.spendingAccountPlaceholder"),
    accountHint: t("budgets.spendingAccountHint"),
    showAccountWhenType: "spending_transfer"
  };

  const allocationEditorConfig: EntryEditorConfig = {
    typeLabel: t("budgets.allocationTypeLabel"),
    typeHint: t("budgets.allocationTypeHint"),
    typeOptions: [
      { value: "monthly_budget", label: t("budgets.allocationTypeMonthly") },
      { value: "savings", label: t("budgets.allocationTypeSavings") }
    ]
  };

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.template(templateId) });
  };

  const handleCreateIncome = async (values: { name: string; amount: number; details?: string; type?: string; account?: string }) => {
    setBusy(true);
    try {
      await createTemplateIncome(templateId, {
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

  const handleCreateExpense = async (values: { name: string; amount: number; details: string; type?: string; account?: string }) => {
    setBusy(true);
    try {
      await createTemplateExpense(templateId, {
        name: values.name,
        amount: values.amount,
        category: values.details || "General",
        type: values.type === "spending_transfer" ? "spending_transfer" : "expense",
        spending_account: values.account
      });
      toast.success(t("common.saved"));
      refresh();
    } catch (error) {
      toast.error(t("common.saveError"));
    } finally {
      setBusy(false);
    }
  };

  const handleCreateAllocation = async (values: { name: string; amount: number; type?: string }) => {
    setBusy(true);
    try {
      await createTemplateAllocation(templateId, {
        name: values.name,
        amount: values.amount,
        type: values.type === "savings" ? "savings" : "monthly_budget"
      });
      toast.success(t("common.saved"));
      refresh();
    } catch (error) {
      toast.error(t("common.saveError"));
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateIncome = async (id: string, values: { name: string; amount: number; details?: string; type?: string; account?: string }) => {
    setBusy(true);
    try {
      await updateTemplateIncome(id, { name: values.name, amount: values.amount });
      toast.success(t("common.saved"));
      refresh();
    } catch (error) {
      toast.error(t("common.saveError"));
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateExpense = async (id: string, values: { name: string; amount: number; details: string; type?: string; account?: string }) => {
    setBusy(true);
    try {
      await updateTemplateExpense(id, {
        name: values.name,
        amount: values.amount,
        category: values.details || "General",
        type: values.type === "spending_transfer" ? "spending_transfer" : "expense",
        spending_account: values.account
      });
      toast.success(t("common.saved"));
      refresh();
    } catch (error) {
      toast.error(t("common.saveError"));
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateAllocation = async (id: string, values: { name: string; amount: number; type?: string }) => {
    setBusy(true);
    try {
      await updateTemplateAllocation(id, {
        name: values.name,
        amount: values.amount,
        type: values.type === "savings" ? "savings" : "monthly_budget"
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
      await deleteTemplateIncome(id);
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
      await deleteTemplateExpense(id);
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
      await deleteTemplateAllocation(id);
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
          <p className="text-sm text-muted-foreground">{t("templates.emptyItems")}</p>
        ) : (
          incomes.map((item) => (
            <EntryCard
              key={item.id}
              title={item.name}
              amount={formatCurrency(item.amount, currency, i18n.language)}
              meta={t("templates.monthlyAssigned", { name: t("common.memberLabel") })}
              onSave={canEdit ? (values) => handleUpdateIncome(item.id, values) : undefined}
              onDelete={canEdit ? () => handleDeleteIncome(item.id) : undefined}
              initialValues={{ name: item.name, amount: item.amount }}
            />
          ))
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
        description={t("budgets.expensesDescription")}
        tip={t("budgets.expensesTip")}
        tooltip={t("budgets.expensesTooltip")}
        editorConfig={expenseEditorConfig}
      >
        {expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("templates.emptyItems")}</p>
        ) : (
          expenses.map((item) => (
            <EntryCard
              key={item.id}
              title={item.name}
              amount={formatCurrency(item.amount, currency, i18n.language)}
              meta={
                item.type === "spending_transfer"
                  ? t("budgets.spendingTransferMeta", {
                      account: item.spending_account || t("budgets.spendingAccountDefault")
                    })
                  : t("templates.monthlyCategory", { category: item.category })
              }
              onSave={canEdit ? (values) => handleUpdateExpense(item.id, values) : undefined}
              onDelete={canEdit ? () => handleDeleteExpense(item.id) : undefined}
              initialValues={{
                name: item.name,
                amount: item.amount,
                details: item.category,
                type: item.type ?? "expense",
                account: item.spending_account ?? ""
              }}
              editorConfig={expenseEditorConfig}
            />
          ))
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
      description={t("budgets.allocationsDescription")}
      tip={t("budgets.allocationsTip")}
      tooltip={t("budgets.allocationsTooltip")}
      editorConfig={allocationEditorConfig}
    >
      {allocations.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("templates.emptyItems")}</p>
      ) : (
        allocations.map((item) => (
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
            onSave={canEdit ? (values) => handleUpdateAllocation(item.id, values) : undefined}
            onDelete={canEdit ? () => handleDeleteAllocation(item.id) : undefined}
            initialValues={{ name: item.name, amount: item.amount, type: item.type }}
            editorConfig={allocationEditorConfig}
          />
        ))
      )}
    </CardListSection>
  );
}
