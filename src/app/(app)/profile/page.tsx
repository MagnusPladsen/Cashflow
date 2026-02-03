"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">{t("nav.profile")}</h1>
        <p className="text-sm text-muted-foreground">{t("profile.subtitle")}</p>
      </div>

      <Card className="border border-border/60">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback>MP</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">Magnus Pladsen</p>
              <p className="text-sm text-muted-foreground">magnus@cashflow.app</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="rounded-full">{t("common.edit")}</Button>
            <Button variant="outline" className="rounded-full">
              {t("profile.manageAccount")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
