"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import CardListSection from "@/components/budget/CardListSection";
import EntryCard from "@/components/budget/EntryCard";
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
  expenses: Array<{ id: string; name: string; amount: number; category: string }>;
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

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.template(templateId) });
  };

  const handleCreateIncome = async (values: { name: string; amount: number }) => {
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

  const handleCreateExpense = async (values: { name: string; amount: number; details: string }) => {
    setBusy(true);
    try {
      await createTemplateExpense(templateId, {
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
      await createTemplateAllocation(templateId, {
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
      await updateTemplateIncome(id, { name: values.name, amount: values.amount });
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
      await updateTemplateExpense(id, {
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
      await updateTemplateAllocation(id, {
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
      >
        {expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("templates.emptyItems")}</p>
        ) : (
          expenses.map((item) => (
            <EntryCard
              key={item.id}
              title={item.name}
              amount={formatCurrency(item.amount, currency, i18n.language)}
              meta={t("templates.monthlyCategory", { category: item.category })}
              onSave={canEdit ? (values) => handleUpdateExpense(item.id, values) : undefined}
              onDelete={canEdit ? () => handleDeleteExpense(item.id) : undefined}
              initialValues={{ name: item.name, amount: item.amount, details: item.category }}
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
            initialValues={{ name: item.name, amount: item.amount }}
          />
        ))
      )}
    </CardListSection>
  );
}
