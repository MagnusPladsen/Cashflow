"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  Home,
  Layers,
  Settings,
  UserRound
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", key: "dashboard", icon: Home },
  { href: "/templates", key: "templates", icon: Layers },
  { href: "/budgets", key: "budgets", icon: Calendar },
  { href: "/settings", key: "settings", icon: Settings },
  { href: "/profile", key: "profile", icon: UserRound }
];

export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-5">
        {navItems.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-3 text-xs",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{t(`nav.${item.key}`)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
