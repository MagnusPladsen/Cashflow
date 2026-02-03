import { createClient } from "@/lib/supabase/client";

export async function fetchHouseholdMembers(householdId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("household_members")
    .select("id, role, status, invited_email, user_id, profiles(full_name, avatar_url)")
    .eq("household_id", householdId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (
    data?.map((member) => ({
      id: member.id,
      role: member.role as string,
      status: member.status as string,
      invitedEmail: member.invited_email as string | null,
      userId: member.user_id as string | null,
      name: (member.profiles as { full_name?: string | null })?.full_name ?? null,
      avatarUrl: (member.profiles as { avatar_url?: string | null })?.avatar_url ?? null
    })) ?? []
  );
}

export async function updateMemberRole(memberId: string, role: "owner" | "member") {
  const supabase = createClient();
  const { error } = await supabase
    .from("household_members")
    .update({ role })
    .eq("id", memberId);
  if (error) throw error;
  return true;
}

export async function removeMember(memberId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("household_members").delete().eq("id", memberId);
  if (error) throw error;
  return true;
}
