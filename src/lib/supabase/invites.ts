import { createClient } from "@/lib/supabase/client";

export async function resendInvite(householdId: string, email: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("household_members")
    .update({ status: "invited" })
    .eq("household_id", householdId)
    .eq("invited_email", email)
    .eq("status", "invited");
  if (error) throw error;
  return true;
}

export async function revokeInvite(memberId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("household_members").delete().eq("id", memberId);
  if (error) throw error;
  return true;
}
