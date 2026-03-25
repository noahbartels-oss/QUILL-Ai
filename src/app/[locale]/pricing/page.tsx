"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Check, Crown, Zap, Building2, Sparkles, X, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    key: "trial",
    paypalMonthly: null,
    paypalYearly: null,
    icon: Zap,
    highlight: false,
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
  {
    key: "starter",
    paypalMonthly: "STARTER_MONTHLY",
    paypalYearly: "STARTER_YEARLY",
    icon: Sparkles,
    highlight: false,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    key: "pro",
    paypalMonthly: "PRO_MONTHLY",
    paypalYearly: "PRO_YEARLY",
    icon: Crown,
    highlight: true,
    iconBg: "bg-gradient-to-br from-violet-600 to-indigo-600",
    iconColor: "text-white",
  },
  {
    key: "agency",
    paypalMonthly: "AGENCY_MONTHLY",
    paypalYearly: "AGENCY_YEARLY",
    icon: Building2,
    highlight: false,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

export default function PricingPage() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const { data: session } = useSession();
  const router = useRouter();

  // Default to yearly to anchor on better value
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const saveLabels: Record<string, string> = {
    starter: t("save_starter"),
    pro: t("save_pro"),
    agency: t("save_agency"),
  };

  async function createOrder(planId: string) {
    setPaymentError(null);
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    const data = await res.json();
    if (!res.ok || !data.orderId) {
      const msg = data.error ?? "Failed to create order. Check your PayPal configuration.";
      setPaymentError(msg);
      setSelectedPlan(null);
      throw new Error(msg);
    }
    return data.orderId;
  }

  async function onApprove(planId: string, data: { orderID: string }) {
    setPaymentError(null);
    const res = await fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: data.orderID, planId }),
    });
    const result = await res.json();
    if (result.success) {
      setPaymentSuccess(true);
      setTimeout(() => router.push(`/${locale}/dashboard`), 2000);
    } else {
      setPaymentError(result.error ?? "Payment capture failed. Please try again.");
      setSelectedPlan(null);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-20 md:py-28">
        <div className="container max-w-6xl">

          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">{t("badge")}</Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t("headline")}</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">{t("subheadline")}</p>

            {/* Billing toggle — default yearly */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <span className={cn("text-sm font-medium", billing === "monthly" ? "text-foreground" : "text-muted-foreground")}>
                {t("monthly")}
              </span>
              <button
                onClick={() => setBilling(b => b === "monthly" ? "yearly" : "monthly")}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  billing === "yearly" ? "bg-violet-600" : "bg-muted"
                )}
              >
                <span className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
                  billing === "yearly" ? "translate-x-6" : "translate-x-1"
                )} />
              </button>
              <span className={cn("text-sm font-medium flex items-center gap-1.5", billing === "yearly" ? "text-foreground" : "text-muted-foreground")}>
                {t("yearly")}
                <Badge variant="gradient" className="text-xs py-0 px-2">
                  {t("save_pro")} {/* generic save badge */}
                </Badge>
              </span>
            </div>
          </div>

          {paymentSuccess && (
            <div className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-green-50 border border-green-200 text-center text-green-700 font-medium">
              Payment successful! Redirecting to dashboard…
            </div>
          )}

          {paymentError && (
            <div className="max-w-lg mx-auto mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-center text-red-700 text-sm">
              <strong>Payment error:</strong> {paymentError}
            </div>
          )}

          {/* Plans grid */}
          <div className="grid md:grid-cols-4 gap-5">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const planKey = plan.key as "trial" | "starter" | "pro" | "agency";
              const price = billing === "monthly"
                ? t(`plans.${planKey}.price_monthly`)
                : t(`plans.${planKey}.price_yearly`);
              const period = billing === "monthly" ? t("per_month") : t("per_year");
              const features = t.raw(`plans.${planKey}.features`) as string[];
              const planBadge = t(`plans.${planKey}.badge`);
              const paypalId = billing === "monthly" ? plan.paypalMonthly : plan.paypalYearly;
              const isFree = planKey === "trial";
              const saveLabel = billing === "yearly" && !isFree ? saveLabels[planKey] : null;

              return (
                <div
                  key={planKey}
                  className={cn(
                    "relative rounded-2xl border bg-card p-6 flex flex-col",
                    plan.highlight
                      ? "border-violet-300 shadow-2xl shadow-violet-500/10 ring-1 ring-violet-300"
                      : "hover:border-muted-foreground/30 transition-colors"
                  )}
                >
                  {/* Badge */}
                  {planBadge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <Badge variant="gradient" className="px-3 py-0.5 text-xs whitespace-nowrap">
                        {planBadge}
                      </Badge>
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-5">
                    <div className={cn("inline-flex h-9 w-9 items-center justify-center rounded-xl mb-3", plan.iconBg)}>
                      <Icon className={cn("h-4.5 w-4.5", plan.iconColor)} style={{ width: 18, height: 18 }} />
                    </div>
                    <h2 className="text-lg font-bold">{t(`plans.${planKey}.name`)}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{t(`plans.${planKey}.description`)}</p>

                    <div className="flex items-baseline gap-1 mt-3">
                      <span className="text-3xl font-extrabold">{price}</span>
                      <span className="text-sm text-muted-foreground">{period}</span>
                    </div>

                    {saveLabel && (
                      <p className="text-xs text-green-600 font-semibold mt-0.5">
                        {saveLabel} {t("billed_yearly")}
                      </p>
                    )}

                    {billing === "monthly" && !isFree && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t("or")}{" "}
                        <button onClick={() => setBilling("yearly")} className="text-violet-600 underline font-medium">
                          {saveLabels[planKey]}
                        </button>
                        {" "}{t("billed_yearly")}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                        <span className={planKey === "trial" ? "text-muted-foreground" : ""}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {isFree ? (
                    <Button asChild variant="outline" size="lg" className="w-full">
                      <Link href={session ? `/${locale}/dashboard` : `/${locale}/auth/register`}>
                        {t(`plans.${planKey}.cta`)}
                      </Link>
                    </Button>
                  ) : session && paypalId && selectedPlan !== planKey ? (
                    <Button
                      variant={plan.highlight ? "gradient" : "outline"}
                      size="lg"
                      className="w-full"
                      onClick={() => setSelectedPlan(planKey)}
                    >
                      {t(`plans.${planKey}.cta`)}
                    </Button>
                  ) : session && paypalId && selectedPlan === planKey ? (
                    <div className="space-y-2">
                      <PayPalScriptProvider options={{
                        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "test",
                        components: "buttons",
                        currency: "USD",
                      }}>
                        <PayPalButtons
                          style={{ layout: "vertical", shape: "rect", height: 40 }}
                          createOrder={() => createOrder(paypalId)}
                          onApprove={(data) => onApprove(paypalId, data)}
                          onCancel={() => setSelectedPlan(null)}
                          onError={(err) => {
                            setPaymentError("PayPal encountered an error. Make sure NEXT_PUBLIC_PAYPAL_CLIENT_ID is set correctly on Vercel.");
                            setSelectedPlan(null);
                            console.error("PayPal error:", err);
                          }}
                        />
                      </PayPalScriptProvider>
                      <Button variant="ghost" size="sm" className="w-full" onClick={() => setSelectedPlan(null)}>
                        <X className="h-3.5 w-3.5 mr-1" /> Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      asChild
                      variant={plan.highlight ? "gradient" : "outline"}
                      size="lg"
                      className="w-full"
                    >
                      <Link href={`/${locale}/auth/register`}>{t(`plans.${planKey}.cta`)}</Link>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Guarantee bar */}
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-full px-5 py-2.5 border">
              <Shield className="h-4 w-4 text-green-500 shrink-0" />
              {t("guarantee")}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
