import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryCardsProps {
  items: Array<{ label: string; value: string; sub?: string; tone?: "good" | "warn" }>;
  variant?: "grid" | "stack";
  className?: string;
}

export default function SummaryCards({
  items,
  variant = "grid",
  className
}: SummaryCardsProps) {
  return (
    <div
      className={[
        "grid gap-4",
        variant === "stack" ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-4",
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((item) => (
        <Card key={item.label} className="border border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p
              className={
                item.tone === "good"
                  ? "text-2xl font-semibold text-emerald-600"
                  : item.tone === "warn"
                    ? "text-2xl font-semibold text-orange-600"
                    : "text-2xl font-semibold"
              }
            >
              {item.value}
            </p>
            {item.sub ? (
              <p className="text-xs text-muted-foreground">{item.sub}</p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
