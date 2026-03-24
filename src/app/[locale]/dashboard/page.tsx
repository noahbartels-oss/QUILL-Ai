import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PLAN_LIMITS } from "@/lib/anthropic";
import { truncate, formatDate } from "@/lib/utils";
import {
  Zap,
  FileText,
  Share2,
  Mail,
  Megaphone,
  ArrowRight,
  Crown,
  TrendingUp,
} from "lucide-react";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/auth/login`);

  const t = await getTranslations("dashboard");

  const [user, recentContents] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: { usage: true },
    }),
    prisma.content.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        type: true,
        title: true,
        output: true,
        wordCount: true,
        createdAt: true,
      },
    }),
  ]);

  if (!user) redirect(`/${locale}/auth/login`);

  const plan = user.plan as "TRIAL" | "STARTER" | "PRO" | "AGENCY";
  const limits = PLAN_LIMITS[plan];
  const used = user.usage?.generationsUsed ?? 0;
  const max = limits.generationsPerMonth;
  const usagePercent = Math.min(Math.round((used / max) * 100), 100);

  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  const quickActions = [
    { type: "BLOG_POST", icon: FileText, label: "Blog Post", color: "violet" },
    { type: "SOCIAL_MEDIA", icon: Share2, label: "Social Media", color: "blue" },
    { type: "EMAIL", icon: Mail, label: "Email", color: "green" },
    { type: "AD_COPY", icon: Megaphone, label: "Ad Copy", color: "orange" },
  ];

  const typeColors: Record<string, string> = {
    BLOG_POST: "bg-violet-100 text-violet-700",
    SOCIAL_MEDIA: "bg-blue-100 text-blue-700",
    EMAIL: "bg-green-100 text-green-700",
    AD_COPY: "bg-orange-100 text-orange-700",
    PRODUCT_DESCRIPTION: "bg-pink-100 text-pink-700",
    LANDING_PAGE: "bg-cyan-100 text-cyan-700",
    CUSTOM: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          Good {timeOfDay}, {user.name?.split(" ")[0] ?? "there"}!
        </h1>
        <p className="text-muted-foreground mt-1">{t("home.subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="md:col-span-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            {t("home.quick_actions")}
          </h2>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.type}
                  href={`/${locale}/dashboard/generate?type=${action.type}`}
                  className="group flex items-center gap-3 p-4 rounded-xl border bg-card hover:border-violet-200 hover:shadow-md hover:shadow-violet-500/5 transition-all duration-200"
                >
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 group-hover:from-violet-200 group-hover:to-indigo-200 flex items-center justify-center transition-colors">
                    <Icon className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{action.label}</div>
                    <div className="text-xs text-muted-foreground">Generate now</div>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-violet-600 group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </div>

          {/* Recent Content */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {t("home.recent_content")}
            </h2>
            <Link
              href={`/${locale}/dashboard/history`}
              className="text-xs text-violet-600 hover:underline font-medium"
            >
              {t("home.view_all")} →
            </Link>
          </div>

          {recentContents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border rounded-xl bg-muted/20">
              <Zap className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">{t("home.no_content")}</p>
              <Button asChild variant="gradient" size="sm" className="mt-4">
                <Link href={`/${locale}/dashboard/generate`}>Generate your first content</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentContents.map((content) => (
                <div
                  key={content.id}
                  className="flex items-start gap-3 p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
                >
                  <Badge
                    className={`shrink-0 text-xs ${typeColors[content.type] ?? "bg-gray-100 text-gray-700"}`}
                    variant="secondary"
                  >
                    {content.type.replace("_", " ")}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{content.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {truncate(content.output, 100)}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {formatDate(content.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Usage + Stats */}
        <div className="space-y-4">
          {/* Usage Card */}
          <div className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">{t("home.usage_title")}</h3>
              <Badge
                variant={plan === "TRIAL" ? "secondary" : "gradient"}
                className="text-xs"
              >
                {plan}
              </Badge>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Generations</span>
                <span className="font-medium text-foreground">
                  {used} / {max === 999999 ? "∞" : max}
                </span>
              </div>
              <Progress value={max === 999999 ? 5 : usagePercent} />
            </div>
            {plan === "TRIAL" && (
              <Button asChild variant="gradient" size="sm" className="w-full mt-3 gap-1.5">
                <Link href={`/${locale}/pricing`}>
                  <Crown className="h-3.5 w-3.5" />
                  Upgrade · from $9/mo
                </Link>
              </Button>
            )}
          </div>

          {/* Stats mini */}
          <div className="rounded-xl border bg-card p-5">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-violet-600" />
              Your Stats
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total generated</span>
                <span className="font-semibold">{used}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Words written</span>
                <span className="font-semibold">
                  {(user.usage?.wordsGenerated ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-semibold capitalize">{plan.toLowerCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
