"use client";

import { useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "@/components/ui/sonner";
import i18n, { defaultLanguage } from "@/i18n";

function resolveInitialLanguage() {
  if (typeof window === "undefined") return defaultLanguage;
  const stored = window.localStorage.getItem("cashflow-lang");
  if (stored) return stored;
  const browser = window.navigator.language?.slice(0, 2);
  if (browser === "no" || browser === "nb" || browser === "nn") return "no";
  return defaultLanguage;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);

  useEffect(() => {
    const lang = resolveInitialLanguage();
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-center" />
      </QueryClientProvider>
    </I18nextProvider>
  );
}
