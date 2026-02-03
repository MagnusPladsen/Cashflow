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

export async function duplicateMonthlyBudgetAction(
  sourceBudgetId: string,
  householdId: string,
  year: number,
  month: number
) {
  try {
    await assertOwnerForHousehold(householdId);
    const supabase = await createClient();

    const { data: source, error: sourceError } = await supabase
      .from("monthly_budgets")
      .select(
        "id, template_id, monthly_incomes(id, name, amount, frequency, assigned_user_id, template_income_id), monthly_expenses(id, name, amount, category, frequency, template_expense_id), monthly_allocations(id, name, amount, type, assigned_user_id, template_allocation_id)"
      )
      .eq("id", sourceBudgetId)
      .single();

    if (sourceError) throw sourceError;

    const { data: newBudget, error: budgetError } = await supabase
      .from("monthly_budgets")
      .insert({
        household_id: householdId,
        template_id: source.template_id,
        year,
        month
      })
      .select("id")
      .single();

    if (budgetError) throw budgetError;

    const budgetId = newBudget.id as string;

    const incomes =
      source.monthly_incomes?.map((income: any) => ({
        monthly_budget_id: budgetId,
        name: income.name,
        amount: income.amount,
        frequency: income.frequency,
        assigned_user_id: income.assigned_user_id,
        template_income_id: income.template_income_id
      })) ?? [];

    const expenses =
      source.monthly_expenses?.map((expense: any) => ({
        monthly_budget_id: budgetId,
        name: expense.name,
        amount: expense.amount,
        category: expense.category,
        frequency: expense.frequency,
        template_expense_id: expense.template_expense_id
      })) ?? [];

    const allocations =
      source.monthly_allocations?.map((allocation: any) => ({
        monthly_budget_id: budgetId,
        name: allocation.name,
        amount: allocation.amount,
        type: allocation.type,
        assigned_user_id: allocation.assigned_user_id,
        template_allocation_id: allocation.template_allocation_id
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
