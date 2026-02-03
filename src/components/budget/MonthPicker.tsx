"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "usehooks-ts";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface MonthPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (year: number, month: number) => void;
}

function buildYearOptions(start: number, count: number) {
  return Array.from({ length: count }).map((_, index) => start + index);
}

export default function MonthPicker({ open, onOpenChange, onConfirm }: MonthPickerProps) {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const now = new Date();
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"));

  const years = useMemo(() => buildYearOptions(now.getFullYear() - 1, 4), [now]);

  const months = [
    { value: "01", label: t("months.jan") },
    { value: "02", label: t("months.feb") },
    { value: "03", label: t("months.mar") },
    { value: "04", label: t("months.apr") },
    { value: "05", label: t("months.may") },
    { value: "06", label: t("months.jun") },
    { value: "07", label: t("months.jul") },
    { value: "08", label: t("months.aug") },
    { value: "09", label: t("months.sep") },
    { value: "10", label: t("months.oct") },
    { value: "11", label: t("months.nov") },
    { value: "12", label: t("months.dec") }
  ];

  const content = (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">{t("budgets.pickYear")}</p>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((value) => (
              <SelectItem key={value} value={String(value)}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">{t("budgets.pickMonthLabel")}</p>
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const handleConfirm = () => {
    onConfirm(Number(year), Number(month));
    onOpenChange(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>{t("budgets.duplicateToMonth")}</DialogTitle>
          </DialogHeader>
          {content}
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleConfirm}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("budgets.duplicateToMonth")}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">{content}</div>
        <DrawerFooter>
          <Button onClick={handleConfirm}>{t("common.save")}</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
