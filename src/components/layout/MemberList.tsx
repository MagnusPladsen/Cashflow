"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useHouseholdMembersQuery } from "@/lib/supabase/queries-members";
import { createClient } from "@/lib/supabase/client";
import { removeMember, updateMemberRole } from "@/lib/supabase/members";
import { toast } from "sonner";
import MemberRemoveConfirm from "@/components/layout/MemberRemoveConfirm";
import InviteActions from "@/components/layout/InviteActions";
import { useHouseholdQuery } from "@/lib/supabase/queries";

interface MemberListProps {
  householdId?: string | null;
  canManage?: boolean;
}

export default function MemberList({ householdId, canManage }: MemberListProps) {
  const { t } = useTranslation();
  const { data = [], isLoading, refetch } = useHouseholdMembersQuery(
    householdId ?? null
  );
  const { data: household } = useHouseholdQuery();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data.user?.id ?? null);
    };
    load();
  }, []);

  if (!householdId) return null;
  if (isLoading) return <p className="text-sm text-muted-foreground">{t("common.loading")}</p>;

  const handlePromote = async (memberId: string) => {
    try {
      await updateMemberRole(memberId, "owner");
      toast.success(t("members.promoted"));
      refetch();
    } catch (error) {
      toast.error(t("members.updateError"));
    }
  };

  const handleDemote = async (memberId: string) => {
    try {
      await updateMemberRole(memberId, "member");
      toast.success(t("members.demoted"));
      refetch();
    } catch (error) {
      toast.error(t("members.updateError"));
    }
  };

  const handleRemove = async (memberId: string) => {
    try {
      await removeMember(memberId);
      toast.success(t("members.removed"));
      refetch();
    } catch (error) {
      toast.error(t("members.removeError"));
    }
  };

  return (
    <div className="space-y-3">
      {data.map((member) => {
        const name = member.name ?? member.invitedEmail ?? t("common.memberLabel");
        const initials = name.slice(0, 2).toUpperCase();
        const isSelf = member.userId && currentUserId && member.userId === currentUserId;
        const isInvited = member.status === "invited" && member.invitedEmail;
        return (
          <div key={member.id} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.role === "owner" ? t("settings.owner") : t("settings.member")}
                    {member.status === "invited" ? ` · ${t("settings.invited")}` : ""}
                  </p>
                </div>
              </div>
              {canManage && !isSelf && !isInvited ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {t("members.manage")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {member.role === "member" ? (
                      <DropdownMenuItem onClick={() => handlePromote(member.id)}>
                        {t("members.promote")}
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleDemote(member.id)}>
                        {t("members.demote")}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <MemberRemoveConfirm
                      trigger={
                        <DropdownMenuItem className="text-destructive">
                          {t("members.remove")}
                        </DropdownMenuItem>
                      }
                      onConfirm={() => handleRemove(member.id)}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
            {isInvited && canManage && householdId ? (
              <InviteActions
                householdId={householdId}
                memberId={member.id}
                invitedEmail={member.invitedEmail ?? ""}
                onChanged={refetch}
                householdName={household?.name}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
