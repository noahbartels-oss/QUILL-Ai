"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Feather,
  Zap,
  History,
  Settings,
  LogOut,
  Crown,
  LayoutDashboard,
} from "lucide-react";

interface SidebarProps {
  plan: string;
  usage: {
    generationsUsed: number;
    generationsMax: number;
  };
}

export function Sidebar({ plan, usage }: SidebarProps) {
  const t = useTranslations("dashboard.nav");
  const locale = useLocale();
  const pathname = usePathname();

  const navItems = [
    {
      label: t("generate"),
      href: `/${locale}/dashboard/generate`,
      icon: Zap,
    },
    {
      label: t("history"),
      href: `/${locale}/dashboard/history`,
      icon: History,
    },
    {
      label: t("settings"),
      href: `/${locale}/dashboard/settings`,
      icon: Settings,
    },
  ];

  const usagePercent = Math.min(
    Math.round((usage.generationsUsed / usage.generationsMax) * 100),
    100
  );

  return (
    <aside className="w-64 flex-shrink-0 border-r bg-background flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
            <Feather className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">QUILL AI</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <Link
          href={`/${locale}/dashboard`}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === `/${locale}/dashboard`
              ? "bg-violet-100 text-violet-700"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-violet-100 text-violet-700"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Usage & Upgrade */}
      <div className="p-4 border-t space-y-4">
        {plan === "FREE" && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                Monthly Usage
              </span>
              <span className="text-xs font-bold text-violet-700">
                {usage.generationsUsed}/{usage.generationsMax}
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-1.5 mb-3">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <Button asChild variant="gradient" size="sm" className="w-full gap-1.5">
              <Link href={`/${locale}/pricing`}>
                <Crown className="h-3.5 w-3.5" />
                {t("upgrade")}
              </Link>
            </Button>
          </div>
        )}

        {plan !== "FREE" && (
          <div className="flex items-center gap-2 px-3 py-2">
            <Crown className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">{plan} Plan</span>
            <Badge variant="gradient" className="ml-auto text-xs py-0">
              Active
            </Badge>
          </div>
        )}

        <button
          onClick={() => signOut({ callbackUrl: `/${locale}` })}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
