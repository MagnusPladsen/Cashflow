"use server";

import { revalidatePath } from "next/cache";
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

export async function createTemplateAction(householdId: string, name: string) {
  try {
    await assertOwnerForHousehold(householdId);
    const supabase = await createClient();
    const { error } = await supabase
      .from("budget_templates")
      .insert({ household_id: householdId, name: name.trim() });

    if (error) throw error;

    revalidatePath("/templates");
    return { ok: true };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}
