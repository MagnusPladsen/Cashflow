"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit2, Trash2 } from "lucide-react";
import EntryEditor from "./EntryEditor";
import DeleteConfirm from "./DeleteConfirm";

interface EntryCardProps {
  title: string;
  amount: string;
  meta?: string;
  badge?: string;
  diff?: { value: string; tone: "over" | "under" };
  initialValues?: {
    name?: string;
    amount?: number;
    details?: string;
  };
  onSave?: (values: { name: string; amount: number; details: string }) => void;
  onDelete?: () => void;
}

export default function EntryCard({
  title,
  amount,
  meta,
  badge,
  diff,
  initialValues,
  onSave,
  onDelete
}: EntryCardProps) {
  const [openEditor, setOpenEditor] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Card className="flex items-center justify-between gap-4 border border-border/60 p-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{title}</p>
            {badge ? (
              <Badge variant="secondary" className="rounded-full">
                {badge}
              </Badge>
            ) : null}
            {diff ? (
              <Badge
                className={
                  diff.tone === "under"
                    ? "rounded-full bg-emerald-100 text-emerald-700"
                    : "rounded-full bg-orange-100 text-orange-700"
                }
              >
                {diff.value}
              </Badge>
            ) : null}
          </div>
          {meta ? <p className="text-xs text-muted-foreground">{meta}</p> : null}
        </div>
        <div className="flex items-center gap-4">
          <p className="text-lg font-semibold tabular-nums">{amount}</p>
          {onSave || onDelete ? (
            <div className="flex items-center gap-2">
              {onSave ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onClick={() => setOpenEditor(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              ) : null}
              {onDelete ? (
                <DeleteConfirm
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                  onConfirm={onDelete}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </Card>
      {onSave ? (
        <EntryEditor
          open={openEditor}
          onOpenChange={setOpenEditor}
          title={t("common.editEntry", { name: title })}
          initialValues={initialValues}
          onSave={onSave}
        />
      ) : null}
    </>
  );
}
