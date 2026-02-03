import {
  budgets,
  dashboardData,
  monthlyBudget,
  templateDetail,
  templates
} from "./data";

const delay = async (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchDashboard() {
  await delay();
  return dashboardData;
}

export async function fetchTemplates() {
  await delay();
  return templates;
}

export async function fetchTemplateDetail(id: string) {
  await delay();
  return { ...templateDetail, id, name: `${templateDetail.name}` };
}

export async function fetchBudgets() {
  await delay();
  return budgets;
}

export async function fetchMonthlyBudget(year: string, month: string) {
  await delay();
  return { ...monthlyBudget, year, month };
}
