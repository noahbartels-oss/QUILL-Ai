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
import { Check, Crown, Zap, Building2, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Plan {
  id: string;
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  description: string;
  cta: string;
  features: string[];
  featured?: boolean;
  paypalPlanId: string;
  yearlyPaypalPlanId: string;
  icon: React.ElementType;
}

export default function PricingPage() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const { data: session } = useSession();
  const router = useRouter();

  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const plans: Plan[] = [
    {
      id: "free",
      name: t("plans.free.name"),
      price: "$0",
      yearlyPrice: "$0",
      period: t("plans.free.period"),
      description: t("plans.free.description"),
      cta: t("plans.free.cta"),
      features: t.raw("plans.free.features") as string[],
      paypalPlanId: "",
      yearlyPaypalPlanId: "",
      icon: Zap,
    },
    {
      id: "pro",
      name: t("plans.pro.name"),
      price: "$19.99",
      yearlyPrice: "$179.99",
      period: t("plans.pro.period"),
      description: t("plans.pro.description"),
      cta: t("plans.pro.cta"),
      features: t.raw("plans.pro.features") as string[],
      featured: true,
      paypalPlanId: "PRO_MONTHLY",
      yearlyPaypalPlanId: "PRO_YEARLY",
      icon: Crown,
    },
    {
      id: "enterprise",
      name: t("plans.enterprise.name"),
      price: "$79.99",
      yearlyPrice: "$719.99",
      period: t("plans.enterprise.period"),
      description: t("plans.enterprise.description"),
      cta: t("plans.enterprise.cta"),
      features: t.raw("plans.enterprise.features") as string[],
      paypalPlanId: "ENTERPRISE_MONTHLY",
      yearlyPaypalPlanId: "ENTERPRISE_YEARLY",
      icon: Building2,
    },
  ];

  async function createOrder(planId: string) {
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    const data = await res.json();
    return data.orderId;
  }

  async function onApprove(planId: string, data: { orderID: string }) {
    setPaymentLoading(true);
    try {
      const res = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.orderID, planId }),
      });
      const result = await res.json();
      if (result.success) {
        setPaymentSuccess(true);
        setTimeout(() => router.push(`/${locale}/dashboard`), 2000);
      }
    } finally {
      setPaymentLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-24">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              {t("badge")}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              {t("headline")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("subheadline")}
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <span
                className={`text-sm font-medium ${billing === "monthly" ? "text-foreground" : "text-muted-foreground"}`}
              >
                {t("monthly")}
              </span>
              <button
                onClick={() =>
                  setBilling((b) => (b === "monthly" ? "yearly" : "monthly"))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billing === "yearly" ? "bg-violet-600" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                    billing === "yearly" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span
                className={`text-sm font-medium flex items-center gap-1.5 ${billing === "yearly" ? "text-foreground" : "text-muted-foreground"}`}
              >
                {t("yearly")}
                <Badge variant="gradient" className="text-xs py-0">
                  {t("save")}
                </Badge>
              </span>
            </div>
          </div>

          {/* Payment Success */}
          {paymentSuccess && (
            <div className="max-w-md mx-auto mb-8 p-4 rounded-xl bg-green-50 border border-green-200 text-center">
              <div className="text-green-600 font-semibold">
                Payment successful! Redirecting to dashboard...
              </div>
            </div>
          )}

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const price = billing === "monthly" ? plan.price : plan.yearlyPrice;
              const paypalId =
                billing === "monthly"
                  ? plan.paypalPlanId
                  : plan.yearlyPaypalPlanId;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border bg-card p-8 flex flex-col ${
                    plan.featured
                      ? "border-violet-300 shadow-xl shadow-violet-500/10 md:scale-105"
                      : ""
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge variant="gradient" className="px-4 py-1">
                        {t("most_popular")}
                      </Badge>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                          plan.featured
                            ? "bg-gradient-to-br from-violet-600 to-indigo-600"
                            : "bg-muted"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${plan.featured ? "text-white" : "text-muted-foreground"}`}
                        />
                      </div>
                      <h2 className="text-xl font-bold">{plan.name}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold">{price}</span>
                      <span className="text-muted-foreground text-sm">
                        {billing === "yearly" ? "/year" : plan.period}
                      </span>
                    </div>
                    {billing === "yearly" && plan.id !== "free" && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        Save {plan.id === "pro" ? "$59.89" : "$239.89"} per year
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Payment/CTA */}
                  {plan.id === "free" ? (
                    <Button
                      asChild
                      variant={session ? "outline" : "gradient"}
                      className="w-full"
                      size="lg"
                    >
                      <Link href={session ? `/${locale}/dashboard` : `/${locale}/auth/register`}>
                        {plan.cta}
                      </Link>
                    </Button>
                  ) : plan.id === "enterprise" ? (
                    <Button asChild variant="outline" className="w-full" size="lg">
                      <Link href={`/${locale}/contact`}>{plan.cta}</Link>
                    </Button>
                  ) : session && paypalId ? (
                    <div>
                      {selectedPlan !== plan.id ? (
                        <Button
                          variant="gradient"
                          className="w-full"
                          size="lg"
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          {plan.cta}
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <PayPalScriptProvider
                            options={{
                              clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "test",
                            }}
                          >
                            <PayPalButtons
                              style={{ layout: "vertical", shape: "rect" }}
                              createOrder={() => createOrder(paypalId)}
                              onApprove={(data) => onApprove(paypalId, data)}
                              onCancel={() => setSelectedPlan(null)}
                            />
                          </PayPalScriptProvider>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            onClick={() => setSelectedPlan(null)}
                          >
                            <X className="h-4 w-4 mr-1" /> Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Button
                      asChild
                      variant={plan.featured ? "gradient" : "outline"}
                      className="w-full"
                      size="lg"
                    >
                      <Link href={`/${locale}/auth/register`}>{plan.cta}</Link>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {/* FAQ teaser */}
          <div className="text-center mt-16 text-muted-foreground text-sm">
            <p>
              All plans include a 14-day money-back guarantee. Questions?{" "}
              <Link href={`/${locale}/contact`} className="text-violet-600 hover:underline">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
