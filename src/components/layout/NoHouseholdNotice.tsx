"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NoHouseholdNotice() {
  const { t } = useTranslation();

  return (
    <Card className="border border-border/60 bg-card/70">
      <CardContent className="space-y-4 p-6">
        <div>
          <h2 className="text-lg font-semibold font-display">{t("household.noticeTitle")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("household.noticeBody")}
          </p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/dashboard">{t("household.noticeCta")}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
