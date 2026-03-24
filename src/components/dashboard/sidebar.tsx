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
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  plan: string;
  usage: {
    generationsUsed: number;
    generationsMax: number;
    isLifetimeCap?: boolean;
  };
}

const PLAN_BADGES: Record<string, { label: string; color: string }> = {
  TRIAL:   { label: "Trial",   color: "bg-muted text-muted-foreground" },
  STARTER: { label: "Starter", color: "bg-blue-100 text-blue-700" },
  PRO:     { label: "Pro",     color: "bg-violet-100 text-violet-700" },
  AGENCY:  { label: "Agency",  color: "bg-amber-100 text-amber-700" },
};

export function Sidebar({ plan, usage }: SidebarProps) {
  const t = useTranslations("dashboard.nav");
  const locale = useLocale();
  const pathname = usePathname();

  const navItems = [
    { label: t("generate"), href: `/${locale}/dashboard/generate`, icon: Zap },
    { label: t("history"),  href: `/${locale}/dashboard/history`,  icon: History },
    { label: t("settings"), href: `/${locale}/dashboard/settings`, icon: Settings },
  ];

  const isTrial = plan === "TRIAL";
  const isPaid  = !isTrial;
  const planMeta = PLAN_BADGES[plan] ?? PLAN_BADGES.TRIAL;

  const usagePercent = usage.generationsMax > 0
    ? Math.min(Math.round((usage.generationsUsed / usage.generationsMax) * 100), 100)
    : 0;

  const remaining = usage.generationsMax - usage.generationsUsed;

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

      {/* Usage & plan */}
      <div className="p-4 border-t space-y-3">
        {/* Trial upgrade prompt */}
        {isTrial && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-violet-700">Trial</span>
              <span className="text-xs font-bold text-violet-700">
                {remaining > 0 ? `${remaining} left` : "0 left"}
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
                <Sparkles className="h-3.5 w-3.5" />
                {t("upgrade")} · from $9/mo
              </Link>
            </Button>
          </div>
        )}

        {/* Paid plan badge */}
        {isPaid && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/30">
            <Crown className="h-4 w-4 text-yellow-500 shrink-0" />
            <span className="text-sm font-medium flex-1">{planMeta.label} Plan</span>
            <span className={cn("text-xs rounded-full px-2 py-0.5 font-semibold", planMeta.color)}>
              Active
            </span>
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
