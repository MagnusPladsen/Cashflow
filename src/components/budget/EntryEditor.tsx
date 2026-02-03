"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export interface EntryEditorConfig {
  detailsLabel?: string;
  detailsPlaceholder?: string;
  detailsHint?: string;
  typeLabel?: string;
  typeHint?: string;
  typeOptions?: Array<{ label: string; value: string }>;
  accountLabel?: string;
  accountPlaceholder?: string;
  accountHint?: string;
  showAccountWhenType?: string;
}

interface EntryEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  initialValues?: {
    name?: string;
    amount?: number;
    details?: string;
    type?: string;
    account?: string;
  };
  onSave?: (values: {
    name: string;
    amount: number;
    details: string;
    type?: string;
    account?: string;
  }) => void;
  config?: EntryEditorConfig;
}

export default function EntryEditor({
  open,
  onOpenChange,
  title,
  initialValues,
  onSave,
  config
}: EntryEditorProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [entryType, setEntryType] = useState("");
  const [account, setAccount] = useState("");

  useEffect(() => {
    if (open) {
      setName(initialValues?.name ?? "");
      setAmount(
        initialValues?.amount !== undefined ? String(initialValues.amount) : ""
      );
      setDetails(initialValues?.details ?? "");
      setEntryType(
        initialValues?.type ??
          config?.typeOptions?.[0]?.value ??
          ""
      );
      setAccount(initialValues?.account ?? "");
    }
  }, [open, initialValues, config?.typeOptions]);

  const handleSave = () => {
    const parsedAmount = Number(amount.replace(/[^0-9.-]/g, ""));
    if (!name.trim()) return;
    onSave?.({
      name: name.trim(),
      amount: Number.isFinite(parsedAmount) ? parsedAmount : 0,
      details: details.trim(),
      type: entryType || undefined,
      account: account.trim() || undefined
    });
    onOpenChange(false);
  };

  const content = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("common.name")}</Label>
        <Input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={t("common.namePlaceholder")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">{t("common.amount")}</Label>
        <Input
          id="amount"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder={t("common.amountPlaceholder")}
        />
      </div>
      {config?.typeOptions ? (
        <div className="space-y-2">
          <Label>{config.typeLabel ?? t("common.type")}</Label>
          <Select value={entryType} onValueChange={setEntryType}>
            <SelectTrigger className="w-full rounded-full">
              <SelectValue placeholder={config.typeLabel ?? t("common.type")} />
            </SelectTrigger>
            <SelectContent>
              {config.typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {config.typeHint ? (
            <p className="text-xs text-muted-foreground">{config.typeHint}</p>
          ) : null}
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="meta">
          {config?.detailsLabel ?? t("common.details")}
        </Label>
        <Input
          id="meta"
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          placeholder={config?.detailsPlaceholder ?? t("common.detailsPlaceholder")}
        />
        {config?.detailsHint ? (
          <p className="text-xs text-muted-foreground">{config.detailsHint}</p>
        ) : null}
      </div>
      {config?.showAccountWhenType && entryType === config.showAccountWhenType ? (
        <div className="space-y-2">
          <Label htmlFor="account">{config.accountLabel ?? t("common.account")}</Label>
          <Input
            id="account"
            value={account}
            onChange={(event) => setAccount(event.target.value)}
            placeholder={config.accountPlaceholder ?? ""}
          />
          {config.accountHint ? (
            <p className="text-xs text-muted-foreground">{config.accountHint}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {content}
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSave}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">{content}</div>
        <DrawerFooter>
          <Button onClick={handleSave}>{t("common.save")}</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
