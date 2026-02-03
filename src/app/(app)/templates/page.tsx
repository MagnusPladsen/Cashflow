"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTemplatesQuery } from "@/lib/supabase/queries";
import HouseholdSetup from "@/components/layout/HouseholdSetup";
import { toast } from "sonner";
import { createTemplateAction } from "@/app/actions/templates-create";
import { getLocaleFromLang } from "@/lib/format";

export default function TemplatesPage() {
  const { t, i18n } = useTranslation();
  const { data, isLoading } = useTemplatesQuery();
  const templates = data?.templates ?? [];
  const isOwner = data?.household?.role === "owner";
  const [isPending, startTransition] = useTransition();

  const handleCreateTemplate = async () => {
    if (!data?.household?.householdId) return;
    startTransition(async () => {
      try {
        const result = await createTemplateAction(
          data.household.householdId,
          t("templates.newTemplateTitle")
        );
        if (!result.ok) {
          toast.error(t("templates.createError"));
          return;
        }
        toast.success(t("templates.created"));
      } catch (error) {
        toast.error(t("templates.createError"));
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{t("templates.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("templates.subtitle")}
          </p>
        </div>
        <Button
          className="rounded-full"
          onClick={handleCreateTemplate}
          disabled={!data?.household?.householdId || isPending || !isOwner}
        >
          {t("templates.newTemplate")}
        </Button>
      </div>

      {!data?.household?.householdId && !isLoading ? <HouseholdSetup /> : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-48 w-full rounded-2xl" />
            ))
          : templates.length === 0
            ? (
                <Card className="border border-dashed border-border/70">
                  <CardContent className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("templates.emptyState")}
                    </p>
                    <Button
                      className="rounded-full"
                      onClick={handleCreateTemplate}
                      disabled={!data?.household?.householdId || isPending || !isOwner}
                    >
                      {t("templates.newTemplate")}
                    </Button>
                  </CardContent>
                </Card>
              )
            : templates.map((template) => (
              <Card key={template.id} className="border border-border/60">
                <CardContent className="flex h-full flex-col gap-6 p-6">
                  <div>
                    <h2 className="text-lg font-semibold">{template.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {t("templates.updated", {
                        time: new Date(template.created_at).toLocaleDateString(
                          getLocaleFromLang(i18n.language)
                        )
                      })}
                    </p>
                  </div>
                  <div className="mt-auto flex gap-2">
                    <Button asChild className="w-full rounded-full">
                      <Link href={`/templates/${template.id}`}>
                        {t("templates.open")}
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full rounded-full">
                      {t("templates.duplicate")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
