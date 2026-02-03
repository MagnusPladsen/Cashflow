"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { supabaseQueryKeys } from "@/lib/supabase/queries";

interface CreateHouseholdInput {
  name: string;
  currency: string;
}

interface InviteMemberInput {
  householdId: string;
  email: string;
}

interface CreateTemplateInput {
  householdId: string;
  name: string;
}

interface CreateMonthlyBudgetInput {
  householdId: string;
  templateId: string | null;
  year: number;
  month: number;
}

export const useCreateHousehold = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, currency }: CreateHouseholdInput) => {
      const supabase = createClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not authenticated");

      const { data: household, error } = await supabase
        .from("households")
        .insert({ name, currency, created_by: user.id })
        .select("id, name, currency")
        .single();

      if (error) throw error;

      await supabase.from("household_members").insert({
        household_id: household.id,
        user_id: user.id,
        role: "owner",
        status: "active"
      });

      return household;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.household });
      queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.templates });
      queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.budgets });
    }
  });
};

export const useInviteMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ householdId, email }: InviteMemberInput) => {
      const supabase = createClient();
      const { error } = await supabase.from("household_members").insert({
        household_id: householdId,
        invited_email: email,
        role: "member",
        status: "invited"
      });
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.household });
    }
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ householdId, name }: CreateTemplateInput) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("budget_templates")
        .insert({ household_id: householdId, name })
        .select("id, name, created_at")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.templates });
    }
  });
};

export const useCreateMonthlyBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      householdId,
      templateId,
      year,
      month
    }: CreateMonthlyBudgetInput) => {
      const supabase = createClient();
      const { data: budget, error } = await supabase
        .from("monthly_budgets")
        .insert({
          household_id: householdId,
          template_id: templateId,
          year,
          month
        })
        .select("id, year, month, template_id")
        .single();

      if (error) throw error;
      return budget;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supabaseQueryKeys.budgets });
    }
  });
};
