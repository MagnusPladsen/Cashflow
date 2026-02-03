"use client";

import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import BudgetTabs from "@/components/budget/BudgetTabs";
import SummaryCards from "@/components/budget/SummaryCards";
import { Skeleton } from "@/components/ui/skeleton";
import { useMonthlyBudgetQuery } from "@/lib/supabase/queries";
import { formatCurrency } from "@/lib/format";
import MonthlyItems from "@/components/budget/MonthlyItems";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabaseQueryKeys } from "@/lib/supabase/queries";
import { subscribeToTableChanges } from "@/lib/supabase/realtime";
import PresenceBar from "@/components/layout/PresenceBar";
import { toast } from "sonner";
import { getUserDisplayName } from "@/lib/supabase/user-cache";

export default function MonthlyBudgetPage() {
  const { t, i18n } = useTranslation();
  const params = useParams<{ year: string; month: string }>();
  const year = Number(params?.year ?? "2026");
  const month = Number(params?.month ?? "2");
  const { data, isLoading } = useMonthlyBudgetQuery(year, month);
  const householdCurrency = data?.household?.currency ?? "NOK";
  const isOwner = data?.household?.role === "owner";
  const queryClient = useQueryClient();
  const lastToastRef = useRef(0);
  const currentUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchUser = async () => {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { data } = await supabase.auth.getUser();
      if (active) currentUserIdRef.current = data.user?.id ?? null;
    };
    fetchUser();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const notify = async (payload?: { table?: string; eventType?: string; new?: Record<string, any> | null }) => {
      const now = Date.now();
      if (now - lastToastRef.current > 1500) {
        const label = payload?.new?.name ?? payload?.new?.category ?? t("presence.item");
        const updatedBy = payload?.new?.updated_by as string | undefined;
        let name = "";
        if (updatedBy) {
          if (updatedBy === currentUserIdRef.current) {
            name = t("presence.you");
          } else {
            name = (await getUserDisplayName(updatedBy)) || t("common.memberLabel");
          }
        }
        toast.message(
          name
            ? t("presence.updatedDetailBy", { item: label, name })
            : t("presence.updatedDetail", { item: label })
        );
        lastToastRef.current = now;
      }
      queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.monthlyBudget(year, month) });
    };
    const unsubscribeIncome = subscribeToTableChanges("monthly_incomes", (payload) => {
      void notify(payload);
    });
    const unsubscribeExpenses = subscribeToTableChanges("monthly_expenses", (payload) => {
      void notify(payload);
    });
    const unsubscribeAllocations = subscribeToTableChanges("monthly_allocations", (payload) => {
      void notify(payload);
    });
    return () => {
      unsubscribeIncome();
      unsubscribeExpenses();
      unsubscribeAllocations();
    };
  }, [year, month, queryClient, t]);

  const incomeTotal =
    data?.budget?.monthly_incomes?.reduce(
      (sum, item) => sum + Number(item.amount ?? 0),
      0
    ) ?? 0;
  const expensesTotal =
    data?.budget?.monthly_expenses?.reduce(
      (sum, item) => sum + Number(item.amount ?? 0),
      0
    ) ?? 0;
  const allocationsTotal =
    data?.budget?.monthly_allocations?.reduce(
      (sum, item) => sum + Number(item.amount ?? 0),
      0
    ) ?? 0;
  const unallocatedTotal = incomeTotal - expensesTotal - allocationsTotal;
  const templateIncomeTotal =
    data?.template?.template_incomes?.reduce(
      (sum, item) => sum + Number(item.amount ?? 0),
      0
    ) ?? 0;
  const templateExpensesTotal =
    data?.template?.template_expenses?.reduce(
      (sum, item) => sum + Number(item.amount ?? 0),
      0
    ) ?? 0;
  const templateAllocationsTotal =
    data?.template?.template_allocations?.reduce(
      (sum, item) => sum + Number(item.amount ?? 0),
      0
    ) ?? 0;
  const templateUnallocatedTotal =
    templateIncomeTotal - templateExpensesTotal - templateAllocationsTotal;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {isLoading || !data ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-3xl font-semibold">
                {t("budgets.monthTitle", {
                  month: new Date(year, month - 1, 1).toLocaleString(
                    i18n.language === "no" ? "nb-NO" : "en-US",
                    { month: "long" }
                  ),
                  year
                })}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("budgets.basedOnTemplate", {
                  name: t("templates.familyCoreTitle")
                })}
              </p>
            </div>
          </>
        )}
        <PresenceBar room={`budget-${year}-${month}`} />
      </div>

      {isLoading || !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <SummaryCards
          items={[
            {
              label: t("templates.income"),
              value: formatCurrency(incomeTotal, householdCurrency, i18n.language),
              sub: data?.template
                ? `${t("budgets.templateValue")}: ${formatCurrency(
                    templateIncomeTotal,
                    householdCurrency,
                    i18n.language
                  )}`
                : undefined
            },
            {
              label: t("templates.expenses"),
              value: formatCurrency(expensesTotal, householdCurrency, i18n.language),
              sub: data?.template
                ? `${t("budgets.templateValue")}: ${formatCurrency(
                    templateExpensesTotal,
                    householdCurrency,
                    i18n.language
                  )}`
                : undefined
            },
            {
              label: t("templates.allocations"),
              value: formatCurrency(
                allocationsTotal,
                householdCurrency,
                i18n.language
              ),
              sub: data?.template
                ? `${t("budgets.templateValue")}: ${formatCurrency(
                    templateAllocationsTotal,
                    householdCurrency,
                    i18n.language
                  )}`
                : undefined
            },
            {
              label: t("templates.unallocated"),
              value: formatCurrency(
                unallocatedTotal,
                householdCurrency,
                i18n.language
              ),
              tone: unallocatedTotal >= 0 ? "good" : "warn",
              sub: data?.template
                ? `${t("budgets.templateValue")}: ${formatCurrency(
                    templateUnallocatedTotal,
                    householdCurrency,
                    i18n.language
                  )}`
                : undefined
            }
          ]}
        />
      )}

      <BudgetTabs
        defaultValue="expenses"
        tabs={[
          {
            value: "income",
            label: t("templates.income"),
            content: isLoading || !data ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
              </div>
            ) : (
              <MonthlyItems
                budgetId={data.budget?.id ?? ""}
                currency={householdCurrency}
                mode="income"
                canEdit={isOwner}
                incomes={data.budget?.monthly_incomes ?? []}
                expenses={[]}
                allocations={[]}
                templateIncomes={data.template?.template_incomes ?? []}
                templateExpenses={[]}
                templateAllocations={[]}
                year={year}
                month={month}
              />
            )
          },
          {
            value: "expenses",
            label: t("templates.expenses"),
            content: isLoading || !data ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
              </div>
            ) : (
              <MonthlyItems
                budgetId={data.budget?.id ?? ""}
                currency={householdCurrency}
                mode="expenses"
                canEdit={isOwner}
                incomes={[]}
                expenses={data.budget?.monthly_expenses ?? []}
                allocations={[]}
                templateIncomes={[]}
                templateExpenses={data.template?.template_expenses ?? []}
                templateAllocations={[]}
                year={year}
                month={month}
              />
            )
          },
          {
            value: "allocations",
            label: t("templates.allocations"),
            content: isLoading || !data ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
              </div>
            ) : (
              <MonthlyItems
                budgetId={data.budget?.id ?? ""}
                currency={householdCurrency}
                mode="allocations"
                canEdit={isOwner}
                incomes={[]}
                expenses={[]}
                allocations={data.budget?.monthly_allocations ?? []}
                templateIncomes={[]}
                templateExpenses={[]}
                templateAllocations={data.template?.template_allocations ?? []}
                year={year}
                month={month}
              />
            )
          }
        ]}
      />
    </div>
  );
}
