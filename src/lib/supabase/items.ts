import { createClient } from "@/lib/supabase/client";

export async function createTemplateIncome(templateId: string, payload: {
  name: string;
  amount: number;
  frequency?: string;
  assigned_user_id?: string | null;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("template_incomes")
    .insert({
      template_id: templateId,
      name: payload.name,
      amount: payload.amount,
      frequency: payload.frequency ?? "monthly",
      assigned_user_id: payload.assigned_user_id ?? null
    })
    .select("id")
    .single();
  if (error) throw error;
  return data;
}

export async function updateTemplateIncome(id: string, payload: {
  name: string;
  amount: number;
  frequency?: string;
  assigned_user_id?: string | null;
}) {
  const supabase = createClient();
  const { error } = await supabase
    .from("template_incomes")
    .update({
      name: payload.name,
      amount: payload.amount,
      frequency: payload.frequency ?? "monthly",
      assigned_user_id: payload.assigned_user_id ?? null
    })
    .eq("id", id);
  if (error) throw error;
  return true;
}

export async function deleteTemplateIncome(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("template_incomes").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function createTemplateExpense(templateId: string, payload: {
  name: string;
  amount: number;
  category: string;
  type?: "expense" | "spending_transfer";
  spending_account?: string;
  frequency?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("template_expenses")
    .insert({
      template_id: templateId,
      name: payload.name,
      amount: payload.amount,
      category: payload.category,
      type: payload.type ?? "expense",
      spending_account: payload.spending_account ?? null,
      frequency: payload.frequency ?? "monthly"
    })
    .select("id")
    .single();
  if (error) throw error;
  return data;
}

export async function updateTemplateExpense(id: string, payload: {
  name: string;
  amount: number;
  category: string;
  type?: "expense" | "spending_transfer";
  spending_account?: string;
  frequency?: string;
}) {
  const supabase = createClient();
  const { error } = await supabase
    .from("template_expenses")
    .update({
      name: payload.name,
      amount: payload.amount,
      category: payload.category,
      type: payload.type ?? "expense",
      spending_account: payload.spending_account ?? null,
      frequency: payload.frequency ?? "monthly"
    })
    .eq("id", id);
  if (error) throw error;
  return true;
}

export async function deleteTemplateExpense(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("template_expenses").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function createTemplateAllocation(templateId: string, payload: {
  name: string;
  amount: number;
  type: "savings" | "monthly_budget";
  assigned_user_id?: string | null;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("template_allocations")
    .insert({
      template_id: templateId,
      name: payload.name,
      amount: payload.amount,
      type: payload.type,
      assigned_user_id: payload.assigned_user_id ?? null
    })
    .select("id")
    .single();
  if (error) throw error;
  return data;
}

export async function updateTemplateAllocation(id: string, payload: {
  name: string;
  amount: number;
  type: "savings" | "monthly_budget";
  assigned_user_id?: string | null;
}) {
  const supabase = createClient();
  const { error } = await supabase
    .from("template_allocations")
    .update({
      name: payload.name,
      amount: payload.amount,
      type: payload.type,
      assigned_user_id: payload.assigned_user_id ?? null
    })
    .eq("id", id);
  if (error) throw error;
  return true;
}

export async function deleteTemplateAllocation(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("template_allocations").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function createMonthlyIncome(budgetId: string, payload: {
  name: string;
  amount: number;
  frequency?: string;
  assigned_user_id?: string | null;
  template_income_id?: string | null;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("monthly_incomes")
    .insert({
      monthly_budget_id: budgetId,
      name: payload.name,
      amount: payload.amount,
      frequency: payload.frequency ?? "monthly",
      assigned_user_id: payload.assigned_user_id ?? null,
      template_income_id: payload.template_income_id ?? null
    })
    .select("id")
    .single();
  if (error) throw error;
  return data;
}

export async function updateMonthlyIncome(id: string, payload: {
  name: string;
  amount: number;
  frequency?: string;
  assigned_user_id?: string | null;
}) {
  const supabase = createClient();
  const { error } = await supabase
    .from("monthly_incomes")
    .update({
      name: payload.name,
      amount: payload.amount,
      frequency: payload.frequency ?? "monthly",
      assigned_user_id: payload.assigned_user_id ?? null
    })
    .eq("id", id);
  if (error) throw error;
  return true;
}

export async function deleteMonthlyIncome(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("monthly_incomes").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function createMonthlyExpense(budgetId: string, payload: {
  name: string;
  amount: number;
  category: string;
  type?: "expense" | "spending_transfer";
  spending_account?: string;
  frequency?: string;
  template_expense_id?: string | null;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("monthly_expenses")
    .insert({
      monthly_budget_id: budgetId,
      name: payload.name,
      amount: payload.amount,
      category: payload.category,
      type: payload.type ?? "expense",
      spending_account: payload.spending_account ?? null,
      frequency: payload.frequency ?? "monthly",
      template_expense_id: payload.template_expense_id ?? null
    })
    .select("id")
    .single();
  if (error) throw error;
  return data;
}

export async function updateMonthlyExpense(id: string, payload: {
  name: string;
  amount: number;
  category: string;
  type?: "expense" | "spending_transfer";
  spending_account?: string;
  frequency?: string;
}) {
  const supabase = createClient();
  const { error } = await supabase
    .from("monthly_expenses")
    .update({
      name: payload.name,
      amount: payload.amount,
      category: payload.category,
      type: payload.type ?? "expense",
      spending_account: payload.spending_account ?? null,
      frequency: payload.frequency ?? "monthly"
    })
    .eq("id", id);
  if (error) throw error;
  return true;
}

export async function deleteMonthlyExpense(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("monthly_expenses").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function createMonthlyAllocation(budgetId: string, payload: {
  name: string;
  amount: number;
  type: "savings" | "monthly_budget";
  assigned_user_id?: string | null;
  template_allocation_id?: string | null;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("monthly_allocations")
    .insert({
      monthly_budget_id: budgetId,
      name: payload.name,
      amount: payload.amount,
      type: payload.type,
      assigned_user_id: payload.assigned_user_id ?? null,
      template_allocation_id: payload.template_allocation_id ?? null
    })
    .select("id")
    .single();
  if (error) throw error;
  return data;
}

export async function updateMonthlyAllocation(id: string, payload: {
  name: string;
  amount: number;
  type: "savings" | "monthly_budget";
  assigned_user_id?: string | null;
}) {
  const supabase = createClient();
  const { error } = await supabase
    .from("monthly_allocations")
    .update({
      name: payload.name,
      amount: payload.amount,
      type: payload.type,
      assigned_user_id: payload.assigned_user_id ?? null
    })
    .eq("id", id);
  if (error) throw error;
  return true;
}

export async function deleteMonthlyAllocation(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("monthly_allocations").delete().eq("id", id);
  if (error) throw error;
  return true;
}
