"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInviteMember } from "@/lib/supabase/mutations";
import { toast } from "sonner";

interface InviteMemberProps {
  householdId: string;
}

export default function InviteMember({ householdId }: InviteMemberProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const { mutateAsync, isPending } = useInviteMember();

  const handleInvite = async () => {
    try {
      await mutateAsync({ householdId, email: email.trim() });
      toast.success(t("household.inviteSent"));
      setEmail("");
    } catch (error) {
      toast.error(t("household.inviteError"));
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="invite-email">{t("household.inviteLabel")}</Label>
        <Input
          id="invite-email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("household.invitePlaceholder")}
        />
      </div>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={handleInvite}
          disabled={isPending || !email.trim()}
        >
        {t("household.inviteAction")}
      </Button>
    </div>
  );
}
