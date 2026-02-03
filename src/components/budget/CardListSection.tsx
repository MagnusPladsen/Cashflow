"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import EntryEditor from "./EntryEditor";

interface CardListSectionProps {
  title: string;
  actionLabel: string;
  children: React.ReactNode;
  disabled?: boolean;
  onCreate?: (values: { name: string; amount: number; details: string }) => void;
}

export default function CardListSection({
  title,
  actionLabel,
  children,
  disabled,
  onCreate
}: CardListSectionProps) {
  const [openEditor, setOpenEditor] = useState(false);

  const handleSave = (values: { name: string; amount: number; details: string }) => {
    onCreate?.(values);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {onCreate ? (
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setOpenEditor(true)}
            disabled={disabled}
          >
            {actionLabel}
          </Button>
        ) : null}
      </div>
      <div className="space-y-3">{children}</div>
      {onCreate ? (
        <EntryEditor
          open={openEditor}
          onOpenChange={setOpenEditor}
          title={actionLabel}
          onSave={handleSave}
        />
      ) : null}
    </section>
  );
}
