"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en/common.json";
import no from "@/locales/no/common.json";

const resources = {
  en: { common: en },
  no: { common: no }
} as const;

const defaultLanguage = "en";

if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    resources,
    lng: defaultLanguage,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    defaultNS: "common",
    supportedLngs: ["en", "no"],
    react: { useSuspense: false }
  });
}

export { defaultLanguage, resources };
export default i18next;
