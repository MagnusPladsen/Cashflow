"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { revokeInvite } from "@/lib/supabase/invites";
import { createClient } from "@/lib/supabase/client";

interface InviteActionsProps {
  householdId: string;
  memberId: string;
  invitedEmail: string;
  onChanged: () => void;
  householdName?: string | null;
}

export default function InviteActions({
  householdId,
  memberId,
  invitedEmail,
  onChanged,
  householdName
}: InviteActionsProps) {
  const { t } = useTranslation();

  const handleResend = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("create_invite_token", {
        hid: householdId,
        email: invitedEmail
      });

      if (error || !data) {
        toast.error(t("members.inviteResendError"));
        return;
      }

      const inviteUrl = `${window.location.origin}/invite?token=${data}`;

      const { error: invokeError } = await supabase.functions.invoke("send-invite", {
        body: {
          email: invitedEmail,
          householdName,
          inviteUrl
        }
      });

      if (invokeError) {
        toast.message(t("members.inviteEmailFailed"));
      } else {
        toast.success(t("members.inviteResent"));
      }

      onChanged();
    } catch (error) {
      toast.error(t("members.inviteResendError"));
    }
  };

  const handleRevoke = async () => {
    try {
      await revokeInvite(memberId);
      toast.success(t("members.inviteRevoked"));
      onChanged();
    } catch (error) {
      toast.error(t("members.inviteRevokeError"));
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={handleResend}>
        {t("members.inviteResend")}
      </Button>
      <Button variant="ghost" size="sm" onClick={handleRevoke}>
        {t("members.inviteRevoke")}
      </Button>
    </div>
  );
}
