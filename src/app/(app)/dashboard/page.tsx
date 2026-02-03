"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import SummaryCards from "@/components/budget/SummaryCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHouseholdQuery, useMonthlyBudgetQuery } from "@/lib/supabase/queries";
import HouseholdSetup from "@/components/layout/HouseholdSetup";
import { formatCurrency } from "@/lib/format";
import ActivityFeed from "@/components/layout/ActivityFeed";

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const { data, isLoading } = useHouseholdQuery();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const { data: monthlyData } = useMonthlyBudgetQuery(year, month);
  const currency = data?.currency ?? "NOK";
  const budget = monthlyData?.budget ?? null;

  const incomeTotal =
    budget?.monthly_incomes?.reduce((sum, item) => sum + Number(item.amount ?? 0), 0) ??
    0;
  const expensesTotal =
    budget?.monthly_expenses?.reduce((sum, item) => sum + Number(item.amount ?? 0), 0) ??
    0;
  const allocationsTotal =
    budget?.monthly_allocations?.reduce((sum, item) => sum + Number(item.amount ?? 0), 0) ??
    0;
  const remainingTotal = incomeTotal - expensesTotal - allocationsTotal;

  const topExpenseCategory = budget?.monthly_expenses?.reduce<Record<string, number>>(
    (acc, item) => {
      const key = item.category || t("budgets.expenseCategoryLabel");
      acc[key] = (acc[key] ?? 0) + Number(item.amount ?? 0);
      return acc;
    },
    {}
  );
  const topExpenseEntry = topExpenseCategory
    ? Object.entries(topExpenseCategory).sort((a, b) => b[1] - a[1])[0]
    : undefined;
  const spentPercent =
    incomeTotal > 0 ? Math.round(((expensesTotal + allocationsTotal) / incomeTotal) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{t("dashboard.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link
              href={
                budget
                  ? `/budgets/${year}/${String(month).padStart(2, "0")}`
                  : "/budgets"
              }
            >
              {budget ? t("dashboard.openBudget") : t("dashboard.openBudgets")}
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/templates">{t("dashboard.createTemplate")}</Link>
          </Button>
        </div>
      </div>

      {!data && !isLoading ? <HouseholdSetup /> : null}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <SummaryCards
          items={[
            {
              label: t("dashboard.currentMonth"),
              value: budget
                ? formatCurrency(remainingTotal, currency, i18n.language)
                : t("dashboard.noBudget"),
              sub: t("common.remaining"),
              tone: remainingTotal >= 0 ? "good" : "warn"
            },
            {
              label: t("dashboard.incomeVsExpenses"),
              value: budget ? `${spentPercent}%` : "—",
              sub: budget ? t("dashboard.spentLabel") : undefined
            },
            {
              label: t("dashboard.savingsRate"),
              value: budget
                ? formatCurrency(
                    budget.monthly_allocations?.reduce(
                      (sum, item) =>
                        sum + (item.type === "savings" ? Number(item.amount ?? 0) : 0),
                      0
                    ) ?? 0,
                    currency,
                    i18n.language
                  )
                : "—",
              sub: budget ? t("dashboard.savingsLabel") : undefined
            },
            {
              label: t("dashboard.budgetHealth"),
              value: budget
                ? remainingTotal >= 0
                  ? t("dashboard.healthGood")
                  : t("dashboard.healthWarn")
                : t("dashboard.healthNeutral"),
              sub: budget
                ? remainingTotal >= 0
                  ? t("dashboard.alertsLabel", { count: 0 })
                  : t("dashboard.alertsLabel", { count: 1 })
                : undefined
            }
          ]}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="border border-border/60">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">{t("dashboard.focusTitle")}</h2>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-3/6" />
              </div>
            ) : (
              <div className="space-y-2 text-sm text-muted-foreground">
                {budget && topExpenseEntry ? (
                  <p>
                    {t("dashboard.focusTopCategory", {
                      category: topExpenseEntry[0],
                      amount: formatCurrency(topExpenseEntry[1], currency, i18n.language)
                    })}
                  </p>
                ) : (
                  <p>{t("dashboard.focusEmpty")}</p>
                )}
                {budget ? (
                  <p>{t("dashboard.focusSpendRate", { percent: `${spentPercent}%` })}</p>
                ) : null}
                {budget ? (
                  <p>
                    {t("dashboard.focusRemaining", {
                      amount: formatCurrency(remainingTotal, currency, i18n.language)
                    })}
                  </p>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="border border-border/60">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">{t("dashboard.quickLinks")}</h2>
            <div className="space-y-3">
              <Button asChild className="w-full rounded-full">
                <Link href="/budgets">{t("dashboard.openBudgets")}</Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-full">
                <Link href="/templates">{t("dashboard.reviewTemplates")}</Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-full">
                <Link href="/settings">{t("dashboard.inviteMember")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ActivityFeed householdId={data?.householdId} />
    </div>
  );
}
