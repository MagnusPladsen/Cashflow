import { createClient } from "@/lib/supabase/client";

export async function fetchActivityLogs(householdId: string, filter?: string) {
  const supabase = createClient();
  let query = supabase
    .from("activity_logs")
    .select(
      "id, action, table_name, description, created_at, actor_id, record_id, template_id, monthly_budget_id, year, month, profiles(full_name)"
    )
    .eq("household_id", householdId)
    .order("created_at", { ascending: false })
    .limit(12);

  if (filter && filter !== "all") {
    query = query.eq("table_name", filter);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}
