"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BudgetTabsProps {
  defaultValue: string;
  tabs: Array<{ value: string; label: string; content: React.ReactNode }>;
}

export default function BudgetTabs({ defaultValue, tabs }: BudgetTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="h-11 w-full justify-start gap-2 rounded-full border border-border/60 bg-card/70 px-2 shadow-[0_14px_32px_-26px_rgba(0,0,0,0.8)]">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-full px-4 text-xs uppercase tracking-[0.14em]"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-6">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
