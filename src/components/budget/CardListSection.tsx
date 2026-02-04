"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import type { EntryEditorConfig } from "./EntryEditor";
import EntryEditor from "./EntryEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { parseAmount } from "@/lib/amount";

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
  quickAdd?: boolean;
  quickAddLabel?: string;
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
  editorConfig,
  quickAdd,
  quickAddLabel
}: CardListSectionProps) {
  const [openEditor, setOpenEditor] = useState(false);
  const [qaName, setQaName] = useState("");
  const [qaAmount, setQaAmount] = useState("");
  const [qaDetails, setQaDetails] = useState("");
  const [qaType, setQaType] = useState(editorConfig?.typeOptions?.[0]?.value ?? "");
  const [qaAccount, setQaAccount] = useState("");

  const handleSave = (values: { name: string; amount: number; details: string }) => {
    onCreate?.(values);
  };

  const handleQuickAdd = () => {
    if (!onCreate || !qaName.trim()) return;
    onCreate({
      name: qaName.trim(),
      amount: parseAmount(qaAmount),
      details: qaDetails.trim(),
      type: qaType || undefined,
      account: qaAccount.trim() || undefined
    });
    setQaName("");
    setQaAmount("");
    setQaDetails("");
    setQaAccount("");
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
      {quickAdd && onCreate ? (
        <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium">
              {quickAddLabel ?? "Quick add"}
            </p>
            <Button
              size="sm"
              className="rounded-full"
              onClick={handleQuickAdd}
              disabled={disabled || !qaName.trim()}
            >
              Add
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-[1.4fr_0.8fr_1fr]">
            <div className="space-y-2">
              <Label htmlFor={`${title}-qa-name`}>Name</Label>
              <Input
                id={`${title}-qa-name`}
                value={qaName}
                onChange={(event) => setQaName(event.target.value)}
                placeholder="Groceries"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleQuickAdd();
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${title}-qa-amount`}>Amount</Label>
              <Input
                id={`${title}-qa-amount`}
                value={qaAmount}
                onChange={(event) => setQaAmount(event.target.value)}
                placeholder="4000"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleQuickAdd();
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${title}-qa-details`}>
                {editorConfig?.detailsLabel ?? "Details"}
              </Label>
              <Input
                id={`${title}-qa-details`}
                value={qaDetails}
                onChange={(event) => setQaDetails(event.target.value)}
                placeholder={editorConfig?.detailsPlaceholder ?? ""}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleQuickAdd();
                  }
                }}
              />
            </div>
          </div>
          {editorConfig?.typeOptions ? (
            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr]">
              <div className="space-y-2">
                <Label>{editorConfig.typeLabel ?? "Type"}</Label>
                <Select value={qaType} onValueChange={setQaType}>
                  <SelectTrigger className="w-full rounded-full">
                    <SelectValue placeholder={editorConfig.typeLabel ?? "Type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {editorConfig.typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {editorConfig.showAccountWhenType && qaType === editorConfig.showAccountWhenType ? (
                <div className="space-y-2">
                  <Label>{editorConfig.accountLabel ?? "Account"}</Label>
                  <Input
                    value={qaAccount}
                    onChange={(event) => setQaAccount(event.target.value)}
                    placeholder={editorConfig.accountPlaceholder ?? ""}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleQuickAdd();
                      }
                    }}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
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
