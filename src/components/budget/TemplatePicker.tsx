"use client";

import { useMemo, useState } from "react";
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
import { useMediaQuery } from "usehooks-ts";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface TemplatePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: Array<{ id: string; name: string }>;
  onSelect: (templateId: string) => void;
}

export default function TemplatePicker({
  open,
  onOpenChange,
  templates,
  onSelect
}: TemplatePickerProps) {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter((template) => template.name.toLowerCase().includes(q));
  }, [templates, query]);

  const content = (
    <div className="space-y-3">
      <Input
        placeholder={t("budgets.searchTemplate")}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="rounded-full"
      />
      {filtered.map((template) => (
        <Card
          key={template.id}
          className={`cursor-pointer border border-border/60 p-4 transition ${
            selectedId === template.id
              ? "border-primary/60 bg-primary/5"
              : "hover:border-primary/40"
          }`}
          onClick={() => setSelectedId(template.id)}
        >
          <p className="font-medium">{template.name}</p>
        </Card>
      ))}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("budgets.noTemplateMatch")}</p>
      ) : null}
    </div>
  );

  const handleConfirm = () => {
    if (!selectedId) return;
    onSelect(selectedId);
    onOpenChange(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{t("budgets.pickTemplate")}</DialogTitle>
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
          <DrawerTitle>{t("budgets.pickTemplate")}</DrawerTitle>
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
