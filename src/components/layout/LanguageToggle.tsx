"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const options = [
  { value: "en", label: "EN" },
  { value: "no", label: "NO" }
];

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const [value, setValue] = useState(i18n.language || "en");

  useEffect(() => {
    setValue(i18n.language || "en");
  }, [i18n.language]);

  const onChange = (next: string) => {
    setValue(next);
    i18n.changeLanguage(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("cashflow-lang", next);
    }
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-[76px] rounded-full bg-card">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
