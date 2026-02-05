export function parseAmount(input: string) {
  const normalized = input.replace(/,/g, "").trim();
  if (!normalized) return 0;

  if (/^[0-9+\-*/().\s]+$/.test(normalized)) {
    try {
      // eslint-disable-next-line no-new-func
      const value = Function(`"use strict"; return (${normalized});`)();
      return Number.isFinite(value) ? Number(value) : 0;
    } catch {
      return 0;
    }
  }

  const fallback = Number(normalized.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(fallback) ? fallback : 0;
}
