"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useCreateHousehold } from "@/lib/supabase/mutations";
import { toast } from "sonner";

export default function HouseholdSetup() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("NOK");
  const { mutateAsync, isPending } = useCreateHousehold();

  const handleCreate = async () => {
    try {
      await mutateAsync({ name: name.trim(), currency });
      toast.success(t("household.created"));
    } catch (error) {
      toast.error(t("household.createError"));
    }
  };

  return (
    <Card className="border border-border/60">
      <CardContent className="space-y-5 p-6">
        <div>
          <h2 className="text-xl font-semibold">{t("household.setupTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("household.setupSubtitle")}</p>
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="household-name">{t("household.name")}</Label>
            <Input
              id="household-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t("household.namePlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("common.currency")}</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-full rounded-full">
                <SelectValue placeholder={t("common.currency")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOK">NOK</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          className="w-full rounded-full"
          onClick={handleCreate}
          disabled={isPending || !name.trim()}
        >
          {t("household.create")}
        </Button>
      </CardContent>
    </Card>
  );
}
