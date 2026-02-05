export function getSiteUrl() {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site) {
    return site.startsWith("http") ? site : `https://${site}`;
  }

  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL;
  if (vercel) {
    return `https://${vercel}`;
  }

  return "http://localhost:3000";
}
