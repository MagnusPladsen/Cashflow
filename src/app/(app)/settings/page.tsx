"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useHouseholdQuery } from "@/lib/supabase/queries";
import InviteMember from "@/components/layout/InviteMember";
import MemberList from "@/components/layout/MemberList";
import NoHouseholdNotice from "@/components/layout/NoHouseholdNotice";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useHouseholdQuery();
  const householdId = data?.householdId;
  const isOwner = data?.role === "owner";

  if (!householdId && !isLoading) {
    return <NoHouseholdNotice />;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {t("settings.subtitle")}
        </p>
        <h1 className="text-3xl font-semibold font-display">{t("nav.settings")}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        <Card className="border border-border/60 bg-card/70">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{t("common.currency")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("settings.currencyHelp")}
                </p>
              </div>
              <Select defaultValue="nok">
                <SelectTrigger className="w-[140px] rounded-full">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nok">NOK</SelectItem>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="eur">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/70">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{t("common.members")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("settings.membersHelp")}
                </p>
              </div>
              <Button className="rounded-full" disabled={!isOwner}>
                {t("common.invite")}
              </Button>
            </div>
            <div className="space-y-3">
              {householdId && isOwner ? <InviteMember householdId={householdId} /> : null}
              <MemberList householdId={householdId} canManage={isOwner} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
