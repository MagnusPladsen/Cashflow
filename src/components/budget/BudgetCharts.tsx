"use client";

import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { useMemo } from "react";

interface BudgetChartsProps {
  expenses: Array<{ category: string; amount: number; type?: "expense" | "spending_transfer" }>;
  allocations: Array<{ amount: number; type: "savings" | "monthly_budget" }>;
  currency: string;
  labels: {
    emptyExpenses: string;
    transfers: string;
    monthly: string;
    savings: string;
  };
}

export default function BudgetCharts({
  expenses,
  allocations,
  currency,
  labels
}: BudgetChartsProps) {
  const pieData = useMemo(() => {
    const totals = expenses.reduce<Record<string, number>>((acc, item) => {
      if (item.type === "spending_transfer") return acc;
      acc[item.category] = (acc[item.category] ?? 0) + Number(item.amount ?? 0);
      return acc;
    }, {});
    return Object.entries(totals)
      .map(([id, value]) => ({ id, label: id, value }))
      .filter((item) => item.value > 0);
  }, [expenses]);

  const barData = useMemo(() => {
    const spendingTransfers = expenses.reduce(
      (sum, item) => sum + (item.type === "spending_transfer" ? Number(item.amount ?? 0) : 0),
      0
    );
    const savings = allocations.reduce(
      (sum, item) => sum + (item.type === "savings" ? Number(item.amount ?? 0) : 0),
      0
    );
    const monthly = allocations.reduce(
      (sum, item) => sum + (item.type === "monthly_budget" ? Number(item.amount ?? 0) : 0),
      0
    );
    return [
      {
        bucket: "Plan",
        [labels.transfers]: spendingTransfers,
        [labels.monthly]: monthly,
        [labels.savings]: savings
      }
    ];
  }, [expenses, allocations, labels]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="h-64 rounded-2xl border border-border/60 bg-card p-3">
        {pieData.length ? (
          <ResponsivePie
            data={pieData}
            margin={{ top: 10, right: 10, bottom: 40, left: 10 }}
            innerRadius={0.6}
            padAngle={0.7}
            cornerRadius={6}
            colors={{ scheme: "set3" }}
            enableArcLabels={false}
            enableArcLinkLabels={false}
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                translateY: 32,
                itemWidth: 80,
                itemHeight: 14,
                itemTextColor: "#6b7280",
                symbolSize: 10,
                symbolShape: "circle"
              }
            ]}
            tooltip={({ datum }) => (
              <div className="rounded-md border border-border/60 bg-background px-2 py-1 text-xs shadow">
                {datum.id}: {datum.formattedValue} {currency}
              </div>
            )}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {labels.emptyExpenses}
          </div>
        )}
      </div>
      <div className="h-64 rounded-2xl border border-border/60 bg-card p-3">
        <ResponsiveBar
          data={barData}
          keys={[labels.transfers, labels.monthly, labels.savings]}
          indexBy="bucket"
          margin={{ top: 10, right: 10, bottom: 40, left: 50 }}
          padding={0.6}
          colors={{ scheme: "pastel1" }}
          enableLabel={false}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8
          }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom",
              direction: "row",
              translateY: 32,
              itemWidth: 90,
              itemHeight: 14,
              itemTextColor: "#6b7280",
              symbolSize: 10,
              symbolShape: "circle"
            }
          ]}
          tooltip={({ id, value }) => (
            <div className="rounded-md border border-border/60 bg-background px-2 py-1 text-xs shadow">
              {String(id)}: {value} {currency}
            </div>
          )}
        />
      </div>
    </div>
  );
}
