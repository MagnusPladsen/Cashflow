"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchHouseholdMembers } from "@/lib/supabase/members";

export const useHouseholdMembersQuery = (householdId?: string | null) =>
  useQuery({
    queryKey: ["household", householdId, "members"],
    queryFn: () => fetchHouseholdMembers(householdId ?? ""),
    enabled: Boolean(householdId)
  });
