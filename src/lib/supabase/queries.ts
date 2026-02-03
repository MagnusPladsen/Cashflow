"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export const supabaseQueryKeys = {
  household: ["household"],
  templates: ["templates"],
  template: (id: string) => ["templates", id],
  budgets: ["budgets"],
  monthlyBudget: (year: number, month: number) => ["budgets", year, month]
};

async function fetchActiveHousehold() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("household_members")
    .select("household_id, role, status, households(name, currency)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    householdId: data.household_id as string,
    role: data.role as string,
    name: (data.households as { name: string })?.name ?? "",
    currency: (data.households as { currency: string })?.currency ?? "NOK"
  };
}

async function fetchTemplates() {
  const supabase = createClient();
  const household = await fetchActiveHousehold();
  if (!household) return { household: null, templates: [] };

  const { data, error } = await supabase
    .from("budget_templates")
    .select("id, name, created_at")
    .eq("household_id", household.householdId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return { household, templates: data ?? [] };
}

async function fetchTemplateDetail(id: string) {
  const supabase = createClient();
  const household = await fetchActiveHousehold();
  if (!household) return null;

  const { data, error } = await supabase
    .from("budget_templates")
    .select(
      "id, name, template_incomes(id, name, amount, frequency, assigned_user_id), template_expenses(id, name, amount, category, frequency), template_allocations(id, name, amount, type, assigned_user_id)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return { household, template: data };
}

async function fetchBudgets() {
  const supabase = createClient();
  const household = await fetchActiveHousehold();
  if (!household) return { household: null, budgets: [] };

  const { data, error } = await supabase
    .from("monthly_budgets")
    .select("id, year, month, created_at, template_id")
    .eq("household_id", household.householdId)
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  if (error) throw error;

  const { data: templates, error: templatesError } = await supabase
    .from("budget_templates")
    .select("id, name")
    .eq("household_id", household.householdId)
    .order("created_at", { ascending: false });

  if (templatesError) throw templatesError;

  return { household, budgets: data ?? [], templates: templates ?? [] };
}

async function fetchMonthlyBudget(year: number, month: number) {
  const supabase = createClient();
  const household = await fetchActiveHousehold();
  if (!household) return null;

  const { data, error } = await supabase
    .from("monthly_budgets")
    .select(
      "id, year, month, template_id, monthly_incomes(id, name, amount, frequency, assigned_user_id, template_income_id), monthly_expenses(id, name, amount, category, frequency, template_expense_id), monthly_allocations(id, name, amount, type, assigned_user_id, template_allocation_id)"
    )
    .eq("household_id", household.householdId)
    .eq("year", year)
    .eq("month", month)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  let template = null;
  if (data.template_id) {
    const { data: templateData, error: templateError } = await supabase
      .from("budget_templates")
      .select(
        "id, name, template_incomes(id, name, amount), template_expenses(id, name, amount, category), template_allocations(id, name, amount, type)"
      )
      .eq("id", data.template_id)
      .maybeSingle();
    if (templateError) throw templateError;
    template = templateData ?? null;
  }

  return { household, budget: data, template };
}

export const useHouseholdQuery = () =>
  useQuery({ queryKey: supabaseQueryKeys.household, queryFn: fetchActiveHousehold });

export const useTemplatesQuery = () =>
  useQuery({ queryKey: supabaseQueryKeys.templates, queryFn: fetchTemplates });

export const useTemplateDetailQuery = (id: string) =>
  useQuery({ queryKey: supabaseQueryKeys.template(id), queryFn: () => fetchTemplateDetail(id) });

export const useBudgetsQuery = () =>
  useQuery({ queryKey: supabaseQueryKeys.budgets, queryFn: fetchBudgets });

export const useMonthlyBudgetQuery = (year: number, month: number) =>
  useQuery({
    queryKey: supabaseQueryKeys.monthlyBudget(year, month),
    queryFn: () => fetchMonthlyBudget(year, month)
  });
