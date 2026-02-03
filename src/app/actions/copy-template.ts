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

export async function copyTemplateToMonthlyAction(
  householdId: string,
  templateId: string,
  year: number,
  month: number
) {
  try {
    await assertOwnerForHousehold(householdId);
    const supabase = await createClient();

    const { data: budget, error: budgetError } = await supabase
      .from("monthly_budgets")
      .insert({ household_id: householdId, template_id: templateId, year, month })
      .select("id")
      .single();

    if (budgetError) throw budgetError;

    const budgetId = budget.id as string;

    const { data: template, error: templateError } = await supabase
      .from("budget_templates")
      .select(
        "id, template_incomes(id, name, amount, frequency, assigned_user_id), template_expenses(id, name, amount, category, frequency), template_allocations(id, name, amount, type, assigned_user_id)"
      )
      .eq("id", templateId)
      .single();

    if (templateError) throw templateError;

    const incomes =
      template.template_incomes?.map((income: any) => ({
        monthly_budget_id: budgetId,
        name: income.name,
        amount: income.amount,
        frequency: income.frequency,
        assigned_user_id: income.assigned_user_id,
        template_income_id: income.id
      })) ?? [];

    const expenses =
      template.template_expenses?.map((expense: any) => ({
        monthly_budget_id: budgetId,
        name: expense.name,
        amount: expense.amount,
        category: expense.category,
        frequency: expense.frequency,
        template_expense_id: expense.id
      })) ?? [];

    const allocations =
      template.template_allocations?.map((allocation: any) => ({
        monthly_budget_id: budgetId,
        name: allocation.name,
        amount: allocation.amount,
        type: allocation.type,
        assigned_user_id: allocation.assigned_user_id,
        template_allocation_id: allocation.id
      })) ?? [];

    if (incomes.length) {
      const { error } = await supabase.from("monthly_incomes").insert(incomes);
      if (error) throw error;
    }

    if (expenses.length) {
      const { error } = await supabase.from("monthly_expenses").insert(expenses);
      if (error) throw error;
    }

    if (allocations.length) {
      const { error } = await supabase.from("monthly_allocations").insert(allocations);
      if (error) throw error;
    }

    revalidatePath("/budgets");
    return { ok: true };
  } catch (error) {
    return { ok: false, message: (error as Error).message };
  }
}
