"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import type { EntryEditorConfig } from "./EntryEditor";
import EntryEditor from "./EntryEditor";

interface CardListSectionProps {
  title: string;
  actionLabel: string;
  children: React.ReactNode;
  disabled?: boolean;
  onCreate?: (values: {
    name: string;
    amount: number;
    details: string;
    type?: string;
    account?: string;
  }) => void;
  description?: string;
  tip?: string;
  tooltip?: string;
  editorConfig?: EntryEditorConfig;
}

export default function CardListSection({
  title,
  actionLabel,
  children,
  disabled,
  onCreate,
  description,
  tip,
  tooltip,
  editorConfig
}: CardListSectionProps) {
  const [openEditor, setOpenEditor] = useState(false);

  const handleSave = (values: { name: string; amount: number; details: string }) => {
    onCreate?.(values);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{title}</h2>
            {tooltip ? (
              <span
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/60 text-muted-foreground"
                title={tooltip}
              >
                <Info className="h-4 w-4" />
              </span>
            ) : null}
          </div>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
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
      {tip ? (
        <p className="text-xs text-muted-foreground">{tip}</p>
      ) : null}
      {onCreate ? (
        <EntryEditor
          open={openEditor}
          onOpenChange={setOpenEditor}
          title={actionLabel}
          onSave={handleSave}
          config={editorConfig}
        />
      ) : null}
    </section>
  );
}
