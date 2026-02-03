"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBudgetsQuery } from "@/lib/supabase/queries";
import { useCreateMonthlyBudget } from "@/lib/supabase/mutations";
import HouseholdSetup from "@/components/layout/HouseholdSetup";
import { formatMonthLabel } from "@/lib/format";
import { toast } from "sonner";
import { copyTemplateToMonthlyBudget } from "@/lib/supabase/copy";
import { useQueryClient } from "@tanstack/react-query";
import { supabaseQueryKeys } from "@/lib/supabase/queries";
import TemplatePicker from "@/components/budget/TemplatePicker";
import MonthPicker from "@/components/budget/MonthPicker";
import { duplicateMonthlyBudgetAction } from "@/app/actions/budgets";

export default function BudgetsPage() {
  const { t, i18n } = useTranslation();
  const { data, isLoading } = useBudgetsQuery();
  const budgets = data?.budgets ?? [];
  const createBudget = useCreateMonthlyBudget();
  const householdId = data?.household?.householdId;
  const isOwner = data?.household?.role === "owner";
  const templates = data?.templates ?? [];
  const queryClient = useQueryClient();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [duplicateSourceId, setDuplicateSourceId] = useState<string | null>(null);

  const handleCreateBudget = async () => {
    if (!householdId) return;
    const now = new Date();
    try {
      await createBudget.mutateAsync({
        householdId,
        templateId: null,
        year: now.getFullYear(),
        month: now.getMonth() + 1
      });
      toast.success(t("budgets.created"));
    } catch (error) {
      toast.error(t("budgets.createError"));
    }
  };

  const handleCopyFromTemplate = () => {
    if (!householdId) return;
    if (!templates.length) {
      toast.error(t("budgets.noTemplateError"));
      return;
    }
    setPickerOpen(true);
  };

  const handleTemplateSelected = async (templateId: string) => {
    if (!householdId) return;
    const now = new Date();
    try {
      await copyTemplateToMonthlyBudget(
        householdId,
        templateId,
        now.getFullYear(),
        now.getMonth() + 1
      );
      queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.budgets });
      toast.success(t("budgets.created"));
    } catch (error) {
      toast.error(t("budgets.createError"));
    }
  };

  const handleDuplicate = (sourceId: string) => {
    setDuplicateSourceId(sourceId);
    setDuplicateOpen(true);
  };

  const handleDuplicateConfirm = async (year: number, month: number) => {
    if (!householdId || !duplicateSourceId) return;
    try {
      const result = await duplicateMonthlyBudgetAction(
        duplicateSourceId,
        householdId,
        year,
        month
      );
      if (!result.ok) {
        toast.error(t("budgets.duplicateError"));
        return;
      }
      queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.budgets });
      toast.success(t("budgets.duplicateSuccess"));
    } catch (error) {
      toast.error(t("budgets.duplicateError"));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{t("budgets.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("budgets.pickMonth")}</p>
        </div>
        <Button
          className="rounded-full"
          onClick={handleCopyFromTemplate}
          disabled={!householdId || createBudget.isPending || !isOwner}
        >
          {t("budgets.copyFromTemplate")}
        </Button>
      </div>

      {!householdId && !isLoading ? <HouseholdSetup /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-44 w-full rounded-2xl" />
            ))
          : budgets.length === 0
            ? (
                <Card className="border border-dashed border-border/70">
                  <CardContent className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("budgets.emptyState")}
                    </p>
                    <Button
                      className="rounded-full"
                      onClick={handleCopyFromTemplate}
                      disabled={!householdId || createBudget.isPending || !isOwner}
                    >
                      {t("budgets.copyFromTemplate")}
                    </Button>
                  </CardContent>
                </Card>
              )
            : budgets.map((month) => (
              <Card key={month.id} className="border border-border/60">
                <CardContent className="flex flex-col gap-4 p-6">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {formatMonthLabel(month.year, month.month, i18n.language)}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t("budgets.current")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild className="rounded-full">
                      <Link
                        href={`/budgets/${month.year}/${String(month.month).padStart(2, "0")}`}
                      >
                        {t("budgets.open")}
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={() => handleDuplicate(month.id)}
                      disabled={!isOwner}
                    >
                      {t("budgets.duplicate")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <TemplatePicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        templates={templates}
        onSelect={handleTemplateSelected}
      />
      <MonthPicker
        open={duplicateOpen}
        onOpenChange={setDuplicateOpen}
        onConfirm={handleDuplicateConfirm}
      />
    </div>
  );
}
