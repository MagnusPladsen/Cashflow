export function getLocaleFromLang(lang?: string) {
  if (!lang) return "en-US";
  if (lang.startsWith("no") || lang.startsWith("nb") || lang.startsWith("nn")) {
    return "nb-NO";
  }
  return "en-US";
}

export function formatCurrency(amount: number, currency: string, lang?: string) {
  const locale = getLocaleFromLang(lang);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatMonthLabel(year: number, month: number, lang?: string) {
  const locale = getLocaleFromLang(lang);
  const date = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    date
  );
}
