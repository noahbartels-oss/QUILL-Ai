import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  FileText,
  Share2,
  Mail,
  Megaphone,
  Globe,
  History,
  Check,
  Star,
  ArrowRight,
  Zap,
  Feather,
  TrendingUp,
  Users,
  MessageSquare,
} from "lucide-react";

export default function LandingPage() {
  const t = useTranslations();
  const locale = useLocale();

  const featureIcons = {
    blog: FileText,
    social: Share2,
    email: Mail,
    ads: Megaphone,
    multilingual: Globe,
    history: History,
  };

  const stats = [
    { value: "2M+", label: t("stats.generations"), icon: Zap },
    { value: "10K+", label: t("stats.users"), icon: Users },
    { value: "10+", label: t("stats.languages"), icon: Globe },
    { value: "98%", label: t("stats.satisfaction"), icon: Star },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-violet-100 to-transparent rounded-full blur-3xl opacity-60" />
          </div>

          <div className="container text-center">
            <Badge variant="gradient" className="mb-6 text-sm px-4 py-1.5">
              <Feather className="h-3.5 w-3.5 mr-1.5" />
              {t("hero.badge")}
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              {t("hero.headline").split(" ").slice(0, -1).join(" ")}{" "}
              <span className="gradient-text">
                {t("hero.headline").split(" ").slice(-1)}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("hero.subheadline")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Button asChild variant="gradient" size="xl">
                <Link href={`/${locale}/auth/register`}>
                  {t("hero.cta_primary")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link href={`/${locale}/#features`}>{t("hero.cta_secondary")}</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">{t("hero.no_credit_card")}</p>

            {/* Hero image / Demo preview */}
            <div className="mt-16 mx-auto max-w-4xl">
              <div className="relative rounded-2xl border bg-card shadow-2xl shadow-violet-500/10 overflow-hidden">
                <div className="bg-muted/50 border-b px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-muted-foreground font-medium">
                      QUILL AI — Content Generator
                    </span>
                  </div>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                        Content Type
                      </div>
                      <div className="border rounded-lg px-3 py-2 text-sm bg-violet-50 border-violet-200 text-violet-700 font-medium">
                        Blog Post
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                        Topic
                      </div>
                      <div className="border rounded-lg px-3 py-2 text-sm">
                        10 Productivity Hacks for Remote Teams
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                        Tone
                      </div>
                      <div className="border rounded-lg px-3 py-2 text-sm">
                        Professional
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <div className="flex-1 h-10 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium flex items-center gap-1.5">
                          <Zap className="h-4 w-4" /> Generate Content
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-xl p-4 bg-muted/30">
                    <div className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-green-500" />
                      Generated — 847 words
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="font-semibold">
                        10 Productivity Hacks That Actually Work for Remote Teams
                      </div>
                      <div className="text-muted-foreground text-xs leading-relaxed">
                        In today&apos;s distributed work environment, remote teams face unique challenges that can impact productivity and collaboration. After analyzing hundreds of high-performing remote companies, we&apos;ve identified the top 10 strategies that consistently deliver results...
                      </div>
                      <div className="flex gap-2 pt-2">
                        <div className="text-xs bg-violet-100 text-violet-700 rounded px-2 py-0.5 font-medium">
                          Copy
                        </div>
                        <div className="text-xs bg-muted text-muted-foreground rounded px-2 py-0.5">
                          Save
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center">
                    <div className="flex justify-center mb-2">
                      <Icon className="h-5 w-5 text-violet-600" />
                    </div>
                    <div className="text-3xl font-extrabold gradient-text mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="container">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                {t("features.badge")}
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                {t("features.headline")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("features.subheadline")}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(["blog", "social", "email", "ads", "multilingual", "history"] as const).map((key) => {
                const Icon = featureIcons[key];
                return (
                  <div
                    key={key}
                    className="group rounded-2xl border bg-card p-6 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 group-hover:from-violet-200 group-hover:to-indigo-200 transition-colors">
                      <Icon className="h-6 w-6 text-violet-600" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {t(`features.items.${key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`features.items.${key}.description`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                {t("pricing.badge")}
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                {t("pricing.headline")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("pricing.subheadline")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {(["trial", "pro", "agency"] as const).map((plan) => {
                const isPro = plan === "pro";
                return (
                  <div
                    key={plan}
                    className={`relative rounded-2xl border bg-card p-8 flex flex-col ${
                      isPro
                        ? "border-violet-300 shadow-xl shadow-violet-500/10 scale-105"
                        : ""
                    }`}
                  >
                    {isPro && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <Badge variant="gradient" className="px-4 py-1">
                          {t("pricing.most_popular")}
                        </Badge>
                      </div>
                    )}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-1">
                        {t(`pricing.plans.${plan}.name`)}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t(`pricing.plans.${plan}.description`)}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold">
                          {t(`pricing.plans.${plan}.price_monthly`)}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {t("pricing.per_month")}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {(t.raw(`pricing.plans.${plan}.features`) as string[]).map(
                        (feature: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        )
                      )}
                    </ul>

                    <Button
                      asChild
                      variant={isPro ? "gradient" : "outline"}
                      className="w-full"
                      size="lg"
                    >
                      <Link href={`/${locale}/auth/register`}>
                        {t(`pricing.plans.${plan}.cta`)}
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link
                href={`/${locale}/pricing`}
                className="text-sm text-violet-600 hover:underline font-medium"
              >
                {t("cta_section.cta_secondary")} →
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24">
          <div className="container">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">
                {t("testimonials.badge")}
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold">
                {t("testimonials.headline")}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {(t.raw("testimonials.items") as Array<{
                name: string;
                role: string;
                company: string;
                text: string;
              }>).map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border bg-card p-6 flex flex-col gap-4"
                >
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, s) => (
                      <Star
                        key={s}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    &ldquo;{item.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-400 flex items-center justify-center text-white text-sm font-bold">
                      {item.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.role} · {item.company}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-600 to-indigo-700" />
          <div className="absolute inset-0 -z-10 opacity-20">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          <div className="container text-center text-white">
            <div className="mb-4 flex justify-center">
              <TrendingUp className="h-12 w-12 opacity-80" />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              {t("cta_section.headline")}
            </h2>
            <p className="text-lg opacity-80 max-w-xl mx-auto mb-10">
              {t("cta_section.subheadline")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="xl"
                className="bg-white text-violet-700 hover:bg-white/90 font-bold shadow-xl"
              >
                <Link href={`/${locale}/auth/register`}>
                  {t("cta_section.cta_primary")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="xl"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <Link href={`/${locale}/pricing`}>
                  {t("cta_section.cta_secondary")}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
