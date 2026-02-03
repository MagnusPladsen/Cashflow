"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { useActivityLogsQuery } from "@/lib/supabase/queries-activity";
import { formatDistanceToNow } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ActivityFeedProps {
  householdId?: string | null;
}

const filters = [
  { value: "all", labelKey: "activity.filters.all" },
  { value: "template_incomes", labelKey: "activity.filters.templateIncome" },
  { value: "template_expenses", labelKey: "activity.filters.templateExpense" },
  { value: "template_allocations", labelKey: "activity.filters.templateAllocation" },
  { value: "monthly_incomes", labelKey: "activity.filters.monthlyIncome" },
  { value: "monthly_expenses", labelKey: "activity.filters.monthlyExpense" },
  { value: "monthly_allocations", labelKey: "activity.filters.monthlyAllocation" }
];

function buildLink(item: {
  table_name: string;
  template_id?: string | null;
  year?: number | null;
  month?: number | null;
}) {
  if (item.template_id && item.table_name.startsWith("template_")) {
    return `/templates/${item.template_id}`;
  }
  if (item.year && item.month && item.table_name.startsWith("monthly_")) {
    return `/budgets/${item.year}/${String(item.month).padStart(2, "0")}`;
  }
  return null;
}

export default function ActivityFeed({ householdId }: ActivityFeedProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");
  const { data = [], isLoading } = useActivityLogsQuery(householdId ?? null, filter);

  return (
    <Card className="border border-border/60">
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">{t("activity.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("activity.subtitle")}</p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full max-w-[220px] rounded-full">
              <SelectValue placeholder={t("activity.filterPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {filters.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {t(item.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : data.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("activity.empty")}</p>
        ) : (
          <div className="space-y-3">
            {data.map((item) => {
              const link = buildLink(item);
              return (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div>
                    {link ? (
                      <Link href={link} className="text-sm font-medium hover:underline">
                        {t("activity.entry", {
                          action: t(`activity.actions.${item.action}`),
                          item: item.description
                        })}
                      </Link>
                    ) : (
                      <p className="text-sm font-medium">
                        {t("activity.entry", {
                          action: t(`activity.actions.${item.action}`),
                          item: item.description
                        })}
                      </p>
                    )}
                    {item.profiles?.full_name ? (
                      <p className="text-xs text-muted-foreground">
                        {t("activity.by", { name: item.profiles.full_name })}
                      </p>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
