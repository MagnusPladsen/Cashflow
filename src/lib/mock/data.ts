export const dashboardData = {
  summary: [
    { labelKey: "dashboard.currentMonth", value: "NOK 42,500", subKey: "common.remaining", tone: "good" },
    { labelKey: "dashboard.incomeVsExpenses", value: "74%", sub: "+3%" },
    { labelKey: "dashboard.savingsRate", value: "18%", sub: "+1.2%" },
    { labelKey: "dashboard.budgetHealth", valueKey: "dashboard.healthLabel", subKey: "dashboard.alertsLabel", subParams: { count: 3 } }
  ],
  focus: {
    groceriesOver: "500 NOK",
    transportUsed: "80%",
    updatesCount: 2
  }
};

export const templates = [
  { id: "family", name: "Family core", updated: "2 days ago" },
  { id: "couple", name: "Couple budget", updated: "1 week ago" },
  { id: "solo", name: "Solo plan", updated: "2 weeks ago" }
];

export const templateDetail = {
  id: "family",
  name: "Family core template",
  subtitle: "Shared baseline for the household.",
  summary: [
    { labelKey: "templates.income", value: "NOK 68,000" },
    { labelKey: "templates.expenses", value: "NOK 42,500" },
    { labelKey: "templates.allocations", value: "NOK 18,500" },
    { labelKey: "templates.unallocated", value: "NOK 7,000", tone: "good" }
  ],
  income: [
    { title: "Salary Magnus", amount: "NOK 42,000", metaKey: "templates.monthlyAssigned", metaParams: { name: "Magnus" } },
    { title: "Salary Ingrid", amount: "NOK 24,000", metaKey: "templates.monthlyAssigned", metaParams: { name: "Ingrid" } }
  ],
  expenses: [
    { title: "Mortgage", amount: "NOK 14,000", metaKey: "templates.monthlyCategory", metaParams: { category: "Housing" } },
    { title: "Groceries", amount: "NOK 5,000", metaKey: "templates.monthlyCategory", metaParams: { category: "Food" } },
    { title: "Transport", amount: "NOK 3,200", metaKey: "templates.monthlyCategory", metaParams: { category: "Car" } }
  ],
  allocations: [
    { title: "Emergency fund", amount: "NOK 6,000", metaKey: "templates.savingsHousehold", badgeKey: "templates.labels.savings" },
    { title: "Groceries envelope", amount: "NOK 4,500", metaKey: "templates.monthlyBudgetHousehold", badgeKey: "templates.labels.monthlyBudget" },
    { title: "Personal spending Ingrid", amount: "NOK 2,000", metaKey: "templates.monthlyBudgetPersonal", badgeKey: "templates.labels.monthlyBudget" }
  ]
};

export const budgets = [
  { id: "2025-12", label: "December 2025", statusKey: "budgets.onTrack" },
  { id: "2026-01", label: "January 2026", statusKey: "budgets.overBy", statusValue: "1,200 NOK" },
  { id: "2026-02", label: "February 2026", statusKey: "budgets.current" }
];

export const monthlyBudget = {
  monthName: "February",
  year: "2026",
  templateNameKey: "templates.familyCoreTitle",
  summary: [
    { labelKey: "templates.income", value: "NOK 68,000" },
    { labelKey: "templates.expenses", value: "NOK 43,200" },
    { labelKey: "templates.allocations", value: "NOK 18,500" },
    { labelKey: "templates.unallocated", value: "NOK 6,300", tone: "warn" }
  ],
  income: [
    { title: "Salary Magnus", amount: "NOK 42,000", metaKey: "templates.monthlyAssigned", metaParams: { name: "Magnus" }, diff: { value: "+1,000", tone: "over" } },
    { title: "Salary Ingrid", amount: "NOK 24,000", metaKey: "templates.monthlyAssigned", metaParams: { name: "Ingrid" }, diff: { value: "-1,000", tone: "under" } }
  ],
  expenses: [
    { title: "Mortgage", amount: "NOK 14,000", metaKey: "templates.monthlyCategory", metaParams: { category: "Housing" } },
    { title: "Groceries", amount: "NOK 5,500", metaKey: "budgets.categoryOver", metaParams: { category: "Food", amount: "500" }, diff: { value: "+500", tone: "over" } },
    { title: "Transport", amount: "NOK 2,700", metaKey: "budgets.categoryUnder", metaParams: { category: "Car", amount: "500" }, diff: { value: "-500", tone: "under" } }
  ],
  allocations: [
    { title: "Emergency fund", amount: "NOK 6,000", metaKey: "templates.savingsHousehold", badgeKey: "templates.labels.savings" },
    { title: "Groceries envelope", amount: "NOK 4,500", metaKey: "templates.monthlyBudgetHousehold", badgeKey: "templates.labels.monthlyBudget" },
    { title: "Personal spending Ingrid", amount: "NOK 2,000", metaKey: "templates.monthlyBudgetPersonal", badgeKey: "templates.labels.monthlyBudget" }
  ]
};
