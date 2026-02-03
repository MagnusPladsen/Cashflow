"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchBudgets,
  fetchDashboard,
  fetchMonthlyBudget,
  fetchTemplateDetail,
  fetchTemplates
} from "./api";

export const queryKeys = {
  dashboard: ["dashboard"],
  templates: ["templates"],
  template: (id: string) => ["templates", id],
  budgets: ["budgets"],
  monthlyBudget: (year: string, month: string) => ["budgets", year, month]
};

export const useDashboardQuery = () =>
  useQuery({ queryKey: queryKeys.dashboard, queryFn: fetchDashboard });

export const useTemplatesQuery = () =>
  useQuery({ queryKey: queryKeys.templates, queryFn: fetchTemplates });

export const useTemplateDetailQuery = (id: string) =>
  useQuery({ queryKey: queryKeys.template(id), queryFn: () => fetchTemplateDetail(id) });

export const useBudgetsQuery = () =>
  useQuery({ queryKey: queryKeys.budgets, queryFn: fetchBudgets });

export const useMonthlyBudgetQuery = (year: string, month: string) =>
  useQuery({
    queryKey: queryKeys.monthlyBudget(year, month),
    queryFn: () => fetchMonthlyBudget(year, month)
  });
