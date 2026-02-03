"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { supabaseQueryKeys } from "@/lib/supabase/queries";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function InviteAcceptance() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  useEffect(() => {
    const accept = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("accept_household_invites");
      if (error) return;
      if (data && data > 0) {
        toast.success(t("household.inviteAccepted"));
        queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.household });
        queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.templates });
        queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.budgets });
      }
    };
    accept();
  }, [queryClient, t]);

  return null;
}
