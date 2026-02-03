"use client";

import { formatCurrency } from "@/lib/format";

interface BudgetSummaryBarProps {
  used: number;
  total: number;
  currency: string;
  locale?: string;
  label?: string;
  remainingLabel?: string;
}

export default function BudgetSummaryBar({
  used,
  total,
  currency,
  locale,
  label,
  remainingLabel
}: BudgetSummaryBarProps) {
  const safeTotal = total > 0 ? total : 0;
  const remaining = safeTotal - used;
  const progress = safeTotal > 0 ? Math.min((used / safeTotal) * 100, 100) : 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {label ?? "Budget summary"}
          </p>
          <p className="text-lg font-semibold">
            {formatCurrency(used, currency, locale)}{" "}
            <span className="text-sm text-muted-foreground">
              out of {formatCurrency(safeTotal, currency, locale)}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            {remainingLabel ?? "Remaining"}
          </p>
          <p
            className={
              remaining >= 0
                ? "text-base font-semibold text-emerald-600"
                : "text-base font-semibold text-orange-600"
            }
          >
            {formatCurrency(remaining, currency, locale)}
          </p>
        </div>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-muted">
        <div
          className={
            remaining >= 0 ? "h-2 rounded-full bg-emerald-500" : "h-2 rounded-full bg-orange-500"
          }
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
