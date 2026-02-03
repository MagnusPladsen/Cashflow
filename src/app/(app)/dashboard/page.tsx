"use client";

import { useTranslation } from "react-i18next";
import SummaryCards from "@/components/budget/SummaryCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHouseholdQuery } from "@/lib/supabase/queries";
import HouseholdSetup from "@/components/layout/HouseholdSetup";
import { formatCurrency } from "@/lib/format";
import ActivityFeed from "@/components/layout/ActivityFeed";

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const { data, isLoading } = useHouseholdQuery();
  const currency = data?.currency ?? "NOK";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{t("dashboard.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="rounded-full">{t("dashboard.openBudget")}</Button>
          <Button variant="outline" className="rounded-full">
            {t("dashboard.createTemplate")}
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
              value: formatCurrency(42500, currency, i18n.language),
              sub: t("common.remaining"),
              tone: "good"
            },
            { label: t("dashboard.incomeVsExpenses"), value: "74%", sub: "+3%" },
            { label: t("dashboard.savingsRate"), value: "18%", sub: "+1.2%" },
            {
              label: t("dashboard.budgetHealth"),
              value: t("dashboard.healthLabel"),
              sub: t("dashboard.alertsLabel", { count: 3 })
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
                <p>
                  {t("dashboard.focusGroceries", {
                    amount: formatCurrency(500, currency, i18n.language)
                  })}
                </p>
                <p>
                  {t("dashboard.focusTransport", {
                    percent: "80%"
                  })}
                </p>
                <p>
                  {t("dashboard.focusUpdates", {
                    count: 2
                  })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="border border-border/60">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">{t("dashboard.quickLinks")}</h2>
            <div className="space-y-3">
              <Button className="w-full rounded-full">
                {t("dashboard.openFebruary")}
              </Button>
              <Button variant="outline" className="w-full rounded-full">
                {t("dashboard.reviewTemplates")}
              </Button>
              <Button variant="outline" className="w-full rounded-full">
                {t("dashboard.inviteMember")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <ActivityFeed householdId={data?.householdId} />
    </div>
  );
}
