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
    <div className="rounded-2xl border border-border/60 bg-card/70 p-4 shadow-[0_20px_60px_-45px_rgba(0,0,0,0.85)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {label ?? "Budget summary"}
          </p>
          <p className="text-lg font-semibold font-display">
            {formatCurrency(used, currency, locale)}{" "}
            <span className="text-sm text-muted-foreground">
              out of {formatCurrency(safeTotal, currency, locale)}
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {remainingLabel ?? "Remaining"}
          </p>
          <p
            className={
              remaining >= 0
                ? "text-base font-semibold text-primary"
                : "text-base font-semibold text-destructive"
            }
          >
            {formatCurrency(remaining, currency, locale)}
          </p>
        </div>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-muted/60">
        <div
          className={
            remaining >= 0
              ? "h-2 rounded-full bg-gradient-to-r from-primary/70 via-primary to-primary/70 shadow-[0_0_12px_rgba(245,200,120,0.4)]"
              : "h-2 rounded-full bg-gradient-to-r from-destructive/70 via-destructive to-destructive/70"
          }
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
