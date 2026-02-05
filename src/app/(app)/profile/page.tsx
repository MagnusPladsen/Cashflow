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
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {t("profile.subtitle")}
        </p>
        <h1 className="text-3xl font-semibold font-display">{t("nav.profile")}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border border-border/60 bg-card/70">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback>MP</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold font-display">Magnus Pladsen</p>
                <p className="text-sm text-muted-foreground">magnus@cashflow.app</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="rounded-full">{t("common.edit")}</Button>
              <Button variant="outline" className="rounded-full">
                {t("profile.manageAccount")}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/60 bg-card/70">
          <CardContent className="space-y-3 p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {t("profile.preferencesTitle")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("profile.preferencesDescription")}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-full">
                {t("profile.changeLanguage")}
              </Button>
              <Button variant="outline" className="rounded-full">
                {t("profile.updatePassword")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
