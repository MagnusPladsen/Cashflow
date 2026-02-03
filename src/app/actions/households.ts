"use server";

import { createClient } from "@/lib/supabase/server";

export async function createHouseholdAction(name: string, currency: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return { ok: false, message: "Not authenticated" };
    }

    const { data: household, error: householdError } = await supabase
      .from("households")
      .insert({ name, currency, created_by: user.id })
      .select("id, name, currency")
      .single();

    if (householdError || !household) {
      throw householdError ?? new Error("Household create failed");
    }

    const { error: memberError } = await supabase.from("household_members").insert({
      household_id: household.id,
      user_id: user.id,
      role: "owner",
      status: "active"
    });

    if (memberError) {
      await supabase.from("households").delete().eq("id", household.id);
      throw memberError;
    }

    return { ok: true, household };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}
