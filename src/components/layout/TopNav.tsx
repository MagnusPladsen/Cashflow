"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LanguageToggle from "./LanguageToggle";

const links = [
  { href: "/dashboard", key: "dashboard" },
  { href: "/templates", key: "templates" },
  { href: "/budgets", key: "budgets" },
  { href: "/settings", key: "settings" },
  { href: "/profile", key: "profile" }
];

export default function TopNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur shadow-[0_12px_30px_-25px_rgba(0,0,0,0.8)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/90 text-primary-foreground grid place-items-center font-semibold shadow-[0_16px_30px_-20px_rgba(245,200,120,0.6)]">
            CF
          </div>
          <div>
            <p className="text-sm font-semibold font-display">{t("appName")}</p>
            <p className="text-xs text-muted-foreground">{t("app.tagline")}</p>
          </div>
        </div>
        <nav className="hidden items-center gap-2 lg:flex">
          {links.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Button
                key={link.href}
                asChild
                variant={active ? "default" : "ghost"}
                className={cn(
                  "rounded-full px-4",
                  !active && "text-muted-foreground"
                )}
              >
                <Link href={link.href}>{t(`nav.${link.key}`)}</Link>
              </Button>
            );
          })}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle />
          <Button className="rounded-full">{t("common.invite")}</Button>
        </div>
      </div>
    </header>
  );
}
