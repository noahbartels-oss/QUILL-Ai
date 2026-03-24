"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  User,
  CreditCard,
  Settings,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
];

export default function SettingsPage() {
  const t = useTranslations("dashboard.settings");
  const locale = useLocale();
  const { data: session, update: updateSession } = useSession();

  const [name, setName] = useState(session?.user?.name ?? "");
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState<{
    plan: string;
    usage: { generationsUsed: number; generationsMax: number; wordsGenerated: number };
    subscription: { currentPeriodEnd?: string; status: string } | null;
  } | null>(null);

  useEffect(() => {
    fetch("/api/user/usage")
      .then((r) => r.json())
      .then(setUsage)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  async function handleSave() {
    setLoading(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, locale: selectedLocale }),
      });

      if (!res.ok) {
        setError("Failed to save settings");
        return;
      }

      await updateSession({ name });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      // Redirect to new locale if changed
      if (selectedLocale !== locale) {
        window.location.href = `/${selectedLocale}/dashboard/settings`;
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const planLabel =
    usage?.plan === "TRIAL"   ? t("plan_trial")   :
    usage?.plan === "STARTER" ? t("plan_starter") :
    usage?.plan === "PRO"     ? t("plan_pro")     :
    usage?.plan === "AGENCY"  ? t("plan_agency")  : t("plan_trial");

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">{t("title")}</h1>
      </div>

      {/* Success / Error */}
      {saved && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm mb-6">
          <CheckCircle2 className="h-4 w-4" />
          {t("saved")}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-6">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <User className="h-5 w-5 text-violet-600" />
            <h2 className="font-semibold">{t("profile")}</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">{t("profile_name")}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("profile_email")}</Label>
              <Input
                id="email"
                value={session?.user?.email ?? ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Section */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <CreditCard className="h-5 w-5 text-violet-600" />
            <h2 className="font-semibold">{t("subscription")}</h2>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                {t("current_plan")}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{planLabel}</span>
                {usage?.plan !== "TRIAL" && (
                  <Badge variant="gradient" className="text-xs py-0 gap-1">
                    <Crown className="h-3 w-3" />
                    Active
                  </Badge>
                )}
              </div>
              {usage?.subscription?.currentPeriodEnd && (
                <p className="text-xs text-muted-foreground mt-1">
                  Renews{" "}
                  {new Date(usage.subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>

            {usage?.plan === "TRIAL" || usage?.plan === "STARTER" ? (
              <Button asChild variant="gradient" size="sm" className="gap-1.5">
                <Link href={`/${locale}/pricing`}>
                  <Crown className="h-3.5 w-3.5" />
                  {t("upgrade")}
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm">
                {t("cancel")}
              </Button>
            )}
          </div>

          {/* Usage stats */}
          {usage && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <div className="text-2xl font-bold text-violet-600">
                  {usage.usage.generationsUsed}
                </div>
                <div className="text-xs text-muted-foreground">
                  Generations used
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-violet-600">
                  {usage.usage.generationsMax === 999999
                    ? "∞"
                    : usage.usage.generationsMax}
                </div>
                <div className="text-xs text-muted-foreground">
                  Monthly limit
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-violet-600">
                  {usage.usage.wordsGenerated.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Words generated
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Settings className="h-5 w-5 text-violet-600" />
            <h2 className="font-semibold">{t("preferences")}</h2>
          </div>

          <div className="space-y-1.5">
            <Label>{t("language_pref")}</Label>
            <Select value={selectedLocale} onValueChange={setSelectedLocale}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          variant="gradient"
          size="lg"
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            t("profile_save")
          )}
        </Button>

        {/* Danger Zone */}
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="font-semibold text-destructive mb-2">
            {t("danger_zone")}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {t("delete_warning")}
          </p>
          <Button variant="destructive" size="sm">
            {t("delete_account")}
          </Button>
        </div>
      </div>
    </div>
  );
}
