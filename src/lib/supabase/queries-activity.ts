"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchActivityLogs } from "@/lib/supabase/activity";

export const useActivityLogsQuery = (
  householdId?: string | null,
  filter?: string
) =>
  useQuery({
    queryKey: ["household", householdId, "activity", filter ?? "all"],
    queryFn: () => fetchActivityLogs(householdId ?? "", filter),
    enabled: Boolean(householdId)
  });
