"use client";

import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { useMemo } from "react";
import { formatCurrency } from "@/lib/format";

interface BudgetChartsProps {
  expenses: Array<{ category: string; amount: number; type?: "expense" | "spending_transfer" }>;
  allocations: Array<{ amount: number; type: "savings" | "monthly_budget" }>;
  currency: string;
  locale?: string;
  labels: {
    emptyExpenses: string;
    transfers: string;
    monthly: string;
    savings: string;
    insightTopCategory: string;
    insightTransfers: string;
    insightSavings: string;
  };
}

export default function BudgetCharts({
  expenses,
  allocations,
  currency,
  locale,
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

  const insights = useMemo(() => {
    const totals = expenses.reduce<Record<string, number>>((acc, item) => {
      if (item.type === "spending_transfer") return acc;
      acc[item.category] = (acc[item.category] ?? 0) + Number(item.amount ?? 0);
      return acc;
    }, {});
    const top = Object.entries(totals).sort((a, b) => b[1] - a[1])[0];
    const transferTotal = expenses.reduce(
      (sum, item) => sum + (item.type === "spending_transfer" ? Number(item.amount ?? 0) : 0),
      0
    );
    const savingsTotal = allocations.reduce(
      (sum, item) => sum + (item.type === "savings" ? Number(item.amount ?? 0) : 0),
      0
    );
    return { top, transferTotal, savingsTotal };
  }, [expenses, allocations]);

  const format = (value: number) => formatCurrency(value, currency, locale);
  const chartTheme = {
    text: {
      fill: "var(--muted-foreground)",
      fontFamily: "var(--font-manrope)"
    },
    tooltip: {
      container: {
        background: "var(--card)",
        color: "var(--foreground)",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        boxShadow: "0 18px 40px -28px rgba(0,0,0,0.85)"
      }
    },
    legends: {
      text: {
        fill: "var(--muted-foreground)"
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        {insights.top ? (
          <span className="rounded-full border border-border/60 bg-card/70 px-3 py-1">
            {labels.insightTopCategory
              .replace("{{category}}", insights.top[0])
              .replace("{{amount}}", format(insights.top[1]))}
          </span>
        ) : null}
        <span className="rounded-full border border-border/60 bg-card/70 px-3 py-1">
          {labels.insightTransfers.replace("{{amount}}", format(insights.transferTotal))}
        </span>
        <span className="rounded-full border border-border/60 bg-card/70 px-3 py-1">
          {labels.insightSavings.replace("{{amount}}", format(insights.savingsTotal))}
        </span>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
      <div className="h-64 rounded-2xl border border-border/60 bg-card/70 p-3 shadow-[0_18px_40px_-35px_rgba(0,0,0,0.8)]">
        {pieData.length ? (
          <ResponsivePie
            data={pieData}
            margin={{ top: 10, right: 10, bottom: 40, left: 10 }}
            innerRadius={0.6}
            padAngle={0.7}
            cornerRadius={6}
            colors={["#f2c879", "#4fb1b9", "#c39d6b", "#8d94a1", "#7aa27b"]}
            theme={chartTheme}
            enableArcLabels={false}
            enableArcLinkLabels={false}
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                translateY: 32,
                itemWidth: 80,
                itemHeight: 14,
                itemTextColor: "var(--muted-foreground)",
                symbolSize: 10,
                symbolShape: "circle"
              }
            ]}
            tooltip={({ datum }) => (
              <div className="rounded-xl border border-border/60 bg-card/95 px-2 py-1 text-xs shadow-[0_12px_30px_-20px_rgba(0,0,0,0.85)]">
                {datum.id}: {format(Number(datum.value))}
              </div>
            )}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {labels.emptyExpenses}
          </div>
        )}
      </div>
      <div className="h-64 rounded-2xl border border-border/60 bg-card/70 p-3 shadow-[0_18px_40px_-35px_rgba(0,0,0,0.8)]">
        <ResponsiveBar
          data={barData}
          keys={[labels.transfers, labels.monthly, labels.savings]}
          indexBy="bucket"
          margin={{ top: 10, right: 10, bottom: 40, left: 50 }}
          padding={0.6}
          colors={["#4fb1b9", "#8d94a1", "#f2c879"]}
          theme={chartTheme}
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
              itemTextColor: "var(--muted-foreground)",
              symbolSize: 10,
              symbolShape: "circle"
            }
          ]}
          tooltip={({ id, value }) => (
            <div className="rounded-xl border border-border/60 bg-card/95 px-2 py-1 text-xs shadow-[0_12px_30px_-20px_rgba(0,0,0,0.85)]">
              {String(id)}: {format(Number(value))}
            </div>
          )}
        />
      </div>
      </div>
    </div>
  );
}
