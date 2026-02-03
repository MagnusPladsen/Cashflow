"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "react-i18next";

interface PresenceUser {
  id: string;
  initials: string;
  name: string;
}

interface PresenceBarProps {
  room: string;
}

export default function PresenceBar({ room }: PresenceBarProps) {
  const { t } = useTranslation();
  const [users, setUsers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`presence-${room}`, {
      config: {
        presence: { key: room }
      }
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const flattened: PresenceUser[] = [];
      Object.values(state).forEach((entries) => {
        (entries as any[]).forEach((entry) => {
          flattened.push({
            id: entry.user_id,
            initials: entry.initials ?? "U",
            name: entry.name ?? t("common.memberLabel")
          });
        });
      });
      setUsers(flattened);
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        const { data } = await supabase.auth.getUser();
        const user = data.user;
        const initials = user?.email?.slice(0, 2)?.toUpperCase() ?? "U";
        channel.track({
          user_id: user?.id ?? "anonymous",
          initials,
          name: user?.user_metadata?.full_name ?? user?.email ?? "User"
        });
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room, t]);

  if (!users.length) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {users.slice(0, 4).map((user) => (
          <Avatar key={user.id} className="h-9 w-9 border-2 border-background">
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {t("presence.viewing", { count: users.length })}
      </p>
    </div>
  );
}
