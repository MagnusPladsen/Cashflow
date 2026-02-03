"use server";

import { createClient } from "@/lib/supabase/server";

async function assertOwnerForHousehold(householdId: string) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: membership, error } = await supabase
    .from("household_members")
    .select("id")
    .eq("household_id", householdId)
    .eq("user_id", user.id)
    .eq("role", "owner")
    .eq("status", "active")
    .maybeSingle();

  if (error || !membership) {
    throw new Error("Forbidden");
  }
}

export async function createInviteTokenAction(householdId: string, email: string) {
  try {
    await assertOwnerForHousehold(householdId);
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("create_invite_token", {
      hid: householdId,
      email
    });

    if (error || !data) {
      throw error ?? new Error("Invite failed");
    }

    return { ok: true, token: data as string };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}

export async function revokeInviteAction(memberId: string, householdId: string) {
  try {
    await assertOwnerForHousehold(householdId);
    const supabase = await createClient();
    const { error } = await supabase
      .from("household_members")
      .delete()
      .eq("id", memberId);

    if (error) throw error;
    return { ok: true };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}
