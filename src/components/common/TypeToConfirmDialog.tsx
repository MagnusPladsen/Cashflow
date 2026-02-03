"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TypeToConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  keyword: string;
  placeholder: string;
  confirmLabel: string;
  onConfirm: () => void;
}

export default function TypeToConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  keyword,
  placeholder,
  confirmLabel,
  onConfirm
}: TypeToConfirmDialogProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState("");

  const handleConfirm = () => {
    if (value.trim().toUpperCase() !== keyword.toUpperCase()) return;
    onConfirm();
    onOpenChange(false);
    setValue("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="space-y-2">
          <Label htmlFor="confirm">{t("common.typeToConfirm", { keyword })}</Label>
          <Input
            id="confirm"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={placeholder}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={value.trim().toUpperCase() !== keyword.toUpperCase()}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
