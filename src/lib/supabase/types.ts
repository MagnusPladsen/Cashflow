export type TemplateIncome = {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  assigned_user_id: string | null;
};

export type TemplateExpense = {
  id: string;
  name: string;
  amount: number;
  category: string;
  frequency: string;
};

export type TemplateAllocation = {
  id: string;
  name: string;
  amount: number;
  type: "savings" | "monthly_budget";
  assigned_user_id: string | null;
};

export type MonthlyIncome = {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  assigned_user_id: string | null;
  template_income_id: string | null;
};

export type MonthlyExpense = {
  id: string;
  name: string;
  amount: number;
  category: string;
  frequency: string;
  template_expense_id: string | null;
};

export type MonthlyAllocation = {
  id: string;
  name: string;
  amount: number;
  type: "savings" | "monthly_budget";
  assigned_user_id: string | null;
  template_allocation_id: string | null;
};
