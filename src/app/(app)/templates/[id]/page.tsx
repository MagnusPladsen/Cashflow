"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "next/navigation";
import BudgetTabs from "@/components/budget/BudgetTabs";
import SummaryCards from "@/components/budget/SummaryCards";
import { Skeleton } from "@/components/ui/skeleton";
import { useTemplateDetailQuery } from "@/lib/supabase/queries";
import { formatCurrency } from "@/lib/format";
import TemplateItems from "@/components/budget/TemplateItems";
import { useQueryClient } from "@tanstack/react-query";
import { supabaseQueryKeys } from "@/lib/supabase/queries";
import { subscribeToTableChanges } from "@/lib/supabase/realtime";
import PresenceBar from "@/components/layout/PresenceBar";
import TemplateHeaderActions from "@/components/budget/TemplateHeaderActions";
import { toast } from "sonner";
import { getUserDisplayName } from "@/lib/supabase/user-cache";

export default function TemplateDetailPage() {
  const { t, i18n } = useTranslation();
  const params = useParams<{ id: string }>();
  const templateId = params?.id ?? "family";
  const { data, isLoading } = useTemplateDetailQuery(templateId);
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
    if (!templateId) return;
    const notify = async (payload?: { table?: string; eventType?: string; new?: Record<string, any> | null }) => {
      const now = Date.now();
      if (now - lastToastRef.current > 1500) {
        const label = payload?.new?.name ?? t("presence.item");
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
      queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.template(templateId) });
    };
    const unsubscribeIncome = subscribeToTableChanges("template_incomes", (payload) => {
      void notify(payload);
    });
    const unsubscribeExpenses = subscribeToTableChanges("template_expenses", (payload) => {
      void notify(payload);
    });
    const unsubscribeAllocations = subscribeToTableChanges("template_allocations", (payload) => {
      void notify(payload);
    });
    return () => {
      unsubscribeIncome();
      unsubscribeExpenses();
      unsubscribeAllocations();
    };
  }, [templateId, queryClient, t]);
  const incomeTotal =
    data?.template?.template_incomes?.reduce(
      (sum, item) => sum + Number(item.amount ?? 0),
      0
    ) ?? 0;
  const expensesTotal =
    data?.template?.template_expenses?.reduce(
      (sum, item) => sum + Number(item.amount ?? 0),
      0
    ) ?? 0;
  const allocationsTotal =
    data?.template?.template_allocations?.reduce(
      (sum, item) => sum + Number(item.amount ?? 0),
      0
    ) ?? 0;
  const unallocatedTotal = incomeTotal - expensesTotal - allocationsTotal;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {isLoading || !data ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-3xl font-semibold">
                {data?.template?.name ?? t("templates.familyCoreTitle")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("templates.familyCoreSubtitle")}
              </p>
            </div>
            {data?.template && isOwner ? (
              <TemplateHeaderActions
                templateId={data.template.id}
                templateName={data.template.name}
              />
            ) : null}
          </>
        )}
        <PresenceBar room={`template-${templateId}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="order-2 space-y-6 lg:order-1">
          <BudgetTabs
            defaultValue="income"
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
                  <TemplateItems
                    templateId={data.template.id}
                    currency={householdCurrency}
                    mode="income"
                    canEdit={isOwner}
                    incomes={data.template.template_incomes ?? []}
                    expenses={[]}
                    allocations={[]}
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
                  <TemplateItems
                    templateId={data.template.id}
                    currency={householdCurrency}
                    mode="expenses"
                    canEdit={isOwner}
                    incomes={[]}
                    expenses={data.template.template_expenses ?? []}
                    allocations={[]}
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
                  <TemplateItems
                    templateId={data.template.id}
                    currency={householdCurrency}
                    mode="allocations"
                    canEdit={isOwner}
                    incomes={[]}
                    expenses={[]}
                    allocations={data.template.template_allocations ?? []}
                  />
                )
              }
            ]}
          />
        </div>
        <div className="order-1 space-y-4 lg:order-2 lg:sticky lg:top-24">
          {isLoading || !data ? (
            <div className="grid gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <SummaryCards
              variant="stack"
              items={[
                {
                  label: t("templates.income"),
                  value: formatCurrency(incomeTotal, householdCurrency, i18n.language)
                },
                {
                  label: t("templates.expenses"),
                  value: formatCurrency(expensesTotal, householdCurrency, i18n.language)
                },
                {
                  label: t("templates.allocations"),
                  value: formatCurrency(allocationsTotal, householdCurrency, i18n.language)
                },
                {
                  label: t("templates.unallocated"),
                  value: formatCurrency(unallocatedTotal, householdCurrency, i18n.language),
                  tone: unallocatedTotal >= 0 ? "good" : "warn"
                }
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
