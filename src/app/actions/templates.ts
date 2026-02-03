"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function assertOwnerForTemplate(templateId: string) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: template, error: templateError } = await supabase
    .from("budget_templates")
    .select("household_id")
    .eq("id", templateId)
    .single();

  if (templateError || !template) {
    throw new Error("Template not found");
  }

  const { data: membership, error: membershipError } = await supabase
    .from("household_members")
    .select("id")
    .eq("household_id", template.household_id)
    .eq("user_id", user.id)
    .eq("role", "owner")
    .eq("status", "active")
    .maybeSingle();

  if (membershipError || !membership) {
    throw new Error("Forbidden");
  }
}

export async function renameTemplateAction(templateId: string, name: string) {
  try {
    await assertOwnerForTemplate(templateId);
    const supabase = await createClient();
    const { error } = await supabase
      .from("budget_templates")
      .update({ name: name.trim() })
      .eq("id", templateId);

    if (error) throw error;

    revalidatePath(`/templates/${templateId}`);
    revalidatePath("/templates");
    return { ok: true };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}

export async function deleteTemplateAction(templateId: string) {
  try {
    await assertOwnerForTemplate(templateId);
    const supabase = await createClient();
    const { error } = await supabase
      .from("budget_templates")
      .delete()
      .eq("id", templateId);

    if (error) throw error;

    revalidatePath("/templates");
    return { ok: true };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}
