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

interface EntryEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  initialValues?: {
    name?: string;
    amount?: number;
    details?: string;
  };
  onSave?: (values: { name: string; amount: number; details: string }) => void;
}

export default function EntryEditor({
  open,
  onOpenChange,
  title,
  initialValues,
  onSave
}: EntryEditorProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (open) {
      setName(initialValues?.name ?? "");
      setAmount(
        initialValues?.amount !== undefined ? String(initialValues.amount) : ""
      );
      setDetails(initialValues?.details ?? "");
    }
  }, [open, initialValues]);

  const handleSave = () => {
    const parsedAmount = Number(amount.replace(/[^0-9.-]/g, ""));
    if (!name.trim()) return;
    onSave?.({
      name: name.trim(),
      amount: Number.isFinite(parsedAmount) ? parsedAmount : 0,
      details: details.trim()
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
      <div className="space-y-2">
        <Label htmlFor="meta">{t("common.details")}</Label>
        <Input
          id="meta"
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          placeholder={t("common.detailsPlaceholder")}
        />
      </div>
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
