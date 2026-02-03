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
  progress?: { value: number; tone: "over" | "under" };
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
  progress,
  initialValues,
  onSave,
  onDelete
}: EntryCardProps) {
  const [openEditor, setOpenEditor] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Card className="border border-border/60 bg-muted/10 p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold leading-tight">{title}</p>
                {meta ? <p className="text-xs text-muted-foreground">{meta}</p> : null}
              </div>
              <p className="text-lg font-semibold tabular-nums">{amount}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
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
            {progress ? (
              <div className="space-y-1">
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div
                    className={
                      progress.tone === "under"
                        ? "h-1.5 rounded-full bg-emerald-500"
                        : "h-1.5 rounded-full bg-orange-500"
                    }
                    style={{ width: `${Math.min(Math.max(progress.value, 0), 100)}%` }}
                  />
                </div>
              </div>
            ) : null}
          </div>
          {onSave || onDelete ? (
            <div className="flex items-center gap-2 md:justify-end">
              {onSave ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full"
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
                      className="h-10 w-10 rounded-full text-destructive"
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
