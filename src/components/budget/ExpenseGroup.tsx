"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import EntryCard from "@/components/budget/EntryCard";
import { formatCurrency } from "@/lib/format";
import { useTranslation } from "react-i18next";

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: string;
}

interface ExpenseGroupProps {
  items: ExpenseItem[];
  currency: string;
  onSave?: (id: string, values: { name: string; amount: number; details: string }) => void;
  onDelete?: (id: string) => void;
}

export default function ExpenseGroup({
  items,
  currency,
  onSave,
  onDelete
}: ExpenseGroupProps) {
  const { i18n } = useTranslation();
  const grouped = items.reduce<Record<string, ExpenseItem[]>>((acc, item) => {
    acc[item.category] = acc[item.category] ?? [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <Accordion type="multiple" className="space-y-2">
      {Object.entries(grouped).map(([category, entries]) => (
        <AccordionItem key={category} value={category} className="border border-border/60 rounded-2xl px-4">
          <AccordionTrigger className="py-4 text-sm font-semibold">
            {category} ({entries.length})
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pb-4">
            {entries.map((item) => (
              <EntryCard
                key={item.id}
                title={item.name}
                amount={formatCurrency(item.amount, currency, i18n.language)}
                meta={category}
                onSave={onSave ? (values) => onSave(item.id, values) : undefined}
                onDelete={onDelete ? () => onDelete(item.id) : undefined}
                initialValues={{ name: item.name, amount: item.amount, details: item.category }}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
