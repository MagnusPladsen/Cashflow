import { createClient } from "@/lib/supabase/client";

interface ChangePayload {
  table: string;
  eventType: string;
  new: Record<string, any> | null;
  old: Record<string, any> | null;
}

export function subscribeToTable(table: string, callback: () => void) {
  const supabase = createClient();
  const channel = supabase
    .channel(`realtime-${table}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      () => callback()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToTableChanges(
  table: string,
  callback: (payload: ChangePayload) => void
) {
  const supabase = createClient();
  const channel = supabase
    .channel(`realtime-${table}-changes`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      (payload) => callback(payload as ChangePayload)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
