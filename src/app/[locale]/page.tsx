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
  ChevronDown,
  Sparkles,
  Shield,
  Clock,
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

  const featureGradients = {
    blog: "from-violet-500/10 to-indigo-500/10 border-violet-100",
    social: "from-pink-500/10 to-rose-500/10 border-pink-100",
    email: "from-blue-500/10 to-cyan-500/10 border-blue-100",
    ads: "from-orange-500/10 to-amber-500/10 border-orange-100",
    multilingual: "from-emerald-500/10 to-teal-500/10 border-emerald-100",
    history: "from-purple-500/10 to-violet-500/10 border-purple-100",
  };

  const featureIconColors = {
    blog: "text-violet-600",
    social: "text-pink-600",
    email: "text-blue-600",
    ads: "text-orange-600",
    multilingual: "text-emerald-600",
    history: "text-purple-600",
  };

  const stats = [
    { value: "2M+", label: t("stats.generations"), icon: Zap },
    { value: "10K+", label: t("stats.users"), icon: Users },
    { value: "10+", label: t("stats.languages"), icon: Globe },
    { value: "98%", label: t("stats.satisfaction"), icon: Star },
  ];

  const planIcons = { trial: Zap, starter: Feather, pro: Sparkles, agency: TrendingUp };
  const planHighlight = { trial: false, starter: false, pro: true, agency: false };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">

        {/* ─── HERO ─── */}
        <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-gradient-to-b from-violet-100/80 via-indigo-50/40 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-20 left-1/4 w-64 h-64 bg-pink-100/30 rounded-full blur-3xl" />
            <div className="absolute top-20 right-1/4 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />
          </div>

          <div className="container text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur px-4 py-1.5 text-sm font-medium text-muted-foreground mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              {t("hero.badge")}
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              {t("hero.headline").split(" ").slice(0, -1).join(" ")}{" "}
              <span className="gradient-text">
                {t("hero.headline").split(" ").slice(-1)}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              {t("hero.subheadline")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
              <Button asChild variant="gradient" size="xl" className="shadow-lg shadow-violet-500/25">
                <Link href={`/${locale}/auth/register`}>
                  {t("hero.cta_primary")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link href={`#how-it-works`}>{t("hero.cta_secondary")}</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mb-16">{t("hero.no_credit_card")}</p>

            {/* Browser mockup */}
            <div className="mx-auto max-w-4xl">
              <div className="relative rounded-2xl border bg-card/80 backdrop-blur shadow-2xl shadow-violet-500/10 overflow-hidden">
                {/* Browser chrome */}
                <div className="bg-muted/60 border-b px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  </div>
                  <div className="flex-1 bg-background/60 rounded-md px-3 py-1 text-xs text-muted-foreground text-center max-w-xs mx-auto">
                    app.quill-ai.com/dashboard/generate
                  </div>
                </div>
                {/* App content */}
                <div className="p-6 md:p-8 grid md:grid-cols-2 gap-6 text-left">
                  <div className="space-y-4">
                    <div>
                      <div className="text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-widest">Content Type</div>
                      <div className="border rounded-lg px-3 py-2.5 text-sm bg-violet-50 border-violet-200 text-violet-700 font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Blog Post
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-widest">Topic</div>
                      <div className="border rounded-lg px-3 py-2.5 text-sm bg-background">
                        10 Productivity Hacks for Remote Teams
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-widest">Tone</div>
                        <div className="border rounded-lg px-3 py-2.5 text-sm bg-background">Professional</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-widest">Language</div>
                        <div className="border rounded-lg px-3 py-2.5 text-sm bg-background">English</div>
                      </div>
                    </div>
                    <div className="h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/30">
                      <span className="text-white text-sm font-semibold flex items-center gap-2">
                        <Zap className="h-4 w-4" /> Generate Content
                      </span>
                    </div>
                  </div>
                  <div className="border rounded-xl p-4 bg-gradient-to-br from-muted/30 to-muted/10 relative">
                    <div className="absolute top-3 right-3">
                      <div className="text-[10px] bg-green-100 text-green-700 rounded-full px-2 py-0.5 font-semibold flex items-center gap-1">
                        <Check className="h-2.5 w-2.5" /> 847 words
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                      Generated in 3.2s
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="font-bold leading-snug">
                        10 Productivity Hacks That Actually Work for Remote Teams
                      </div>
                      <div className="text-muted-foreground text-xs leading-relaxed">
                        In today&apos;s distributed work environment, remote teams face unique challenges. After analyzing 500+ high-performing remote companies, we&apos;ve identified the top strategies that consistently deliver results...
                      </div>
                      <div className="flex gap-2 pt-2">
                        <div className="text-xs bg-violet-100 text-violet-700 rounded-md px-3 py-1 font-semibold cursor-pointer hover:bg-violet-200 transition-colors">Copy</div>
                        <div className="text-xs bg-muted text-muted-foreground rounded-md px-3 py-1 cursor-pointer hover:bg-muted/80 transition-colors">Save</div>
                        <div className="text-xs bg-muted text-muted-foreground rounded-md px-3 py-1 cursor-pointer hover:bg-muted/80 transition-colors">Regenerate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── STATS ─── */}
        <section className="py-14 border-y bg-muted/20">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center group">
                    <div className="flex justify-center mb-2">
                      <div className="h-9 w-9 rounded-xl bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                        <Icon className="h-4.5 w-4.5 text-violet-600" style={{ width: 18, height: 18 }} />
                      </div>
                    </div>
                    <div className="text-3xl font-extrabold gradient-text mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section id="how-it-works" className="py-28">
          <div className="container">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">{t("how_it_works.badge")}</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("how_it_works.headline")}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
              {/* Connecting line (desktop) */}
              <div className="hidden md:block absolute top-14 left-1/3 right-1/3 h-px bg-gradient-to-r from-violet-200 via-indigo-300 to-violet-200" />

              {[
                { num: t("how_it_works.step1_number"), title: t("how_it_works.step1_title"), desc: t("how_it_works.step1_desc"), icon: FileText, color: "bg-violet-100 text-violet-600 border-violet-200" },
                { num: t("how_it_works.step2_number"), title: t("how_it_works.step2_title"), desc: t("how_it_works.step2_desc"), icon: Zap, color: "bg-indigo-100 text-indigo-600 border-indigo-200" },
                { num: t("how_it_works.step3_number"), title: t("how_it_works.step3_title"), desc: t("how_it_works.step3_desc"), icon: Sparkles, color: "bg-violet-100 text-violet-600 border-violet-200" },
              ].map((step) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.num} className="flex flex-col items-center text-center px-4">
                    <div className={`relative z-10 flex h-28 w-28 items-center justify-center rounded-2xl border-2 ${step.color} mb-6 shadow-sm`}>
                      <StepIcon className="h-10 w-10" />
                      <div className="absolute -top-3 -right-3 h-7 w-7 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow">
                        {step.num}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section id="features" className="py-24 bg-muted/20">
          <div className="container">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">{t("features.badge")}</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("features.headline")}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("features.subheadline")}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(["blog", "social", "email", "ads", "multilingual", "history"] as const).map((key) => {
                const Icon = featureIcons[key];
                return (
                  <div
                    key={key}
                    className={`group rounded-2xl border bg-gradient-to-br p-6 hover:shadow-lg transition-all duration-300 ${featureGradients[key]}`}
                  >
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 shadow-sm border group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`h-5 w-5 ${featureIconColors[key]}`} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{t(`features.items.${key}.title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`features.items.${key}.description`)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── CONTENT EXAMPLES ─── */}
        <section className="py-28">
          <div className="container">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">{t("examples.badge")}</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("examples.headline")}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("examples.subheadline")}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Blog Post Example */}
              <div className="rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-violet-50 border-b border-violet-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-violet-100 flex items-center justify-center">
                      <FileText className="h-3.5 w-3.5 text-violet-600" />
                    </div>
                    <span className="text-xs font-bold text-violet-700 uppercase tracking-wide">{t("examples.blog_label")}</span>
                  </div>
                  <div className="text-[10px] bg-violet-100 text-violet-600 rounded-full px-2 py-0.5 font-semibold">
                    847 {t("examples.words_label")} · 3.2s
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-sm mb-2 leading-snug">{t("examples.blog_title")}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t("examples.blog_excerpt")}</p>
                </div>
              </div>

              {/* Social Media Example */}
              <div className="rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-pink-50 border-b border-pink-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-pink-100 flex items-center justify-center">
                      <Share2 className="h-3.5 w-3.5 text-pink-600" />
                    </div>
                    <span className="text-xs font-bold text-pink-700 uppercase tracking-wide">{t("examples.social_label")}</span>
                  </div>
                  <div className="text-[10px] bg-pink-100 text-pink-600 rounded-full px-2 py-0.5 font-semibold">
                    42 {t("examples.words_label")} · 1.4s
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm leading-relaxed">{t("examples.social_text")}</p>
                </div>
              </div>

              {/* Email Example */}
              <div className="rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-50 border-b border-blue-100 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Mail className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">{t("examples.email_label")}</span>
                  </div>
                  <div className="text-[10px] bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-semibold">
                    156 {t("examples.words_label")} · 2.1s
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs font-semibold text-muted-foreground mb-2 font-mono">{t("examples.email_subject")}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t("examples.email_body")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PRICING ─── */}
        <section id="pricing" className="py-24 bg-muted/20">
          <div className="container">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">{t("pricing.badge")}</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("pricing.headline")}</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("pricing.subheadline")}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
              {(["trial", "starter", "pro", "agency"] as const).map((plan) => {
                const isPro = plan === "pro";
                const planBadge = t(`pricing.plans.${plan}.badge`);
                const PlanIcon = planIcons[plan];
                return (
                  <div
                    key={plan}
                    className={`relative rounded-2xl border bg-card p-6 flex flex-col transition-all ${
                      isPro
                        ? "border-violet-300 shadow-2xl shadow-violet-500/15 ring-1 ring-violet-300 scale-[1.02]"
                        : "hover:border-muted-foreground/30 hover:shadow-md"
                    }`}
                  >
                    {planBadge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <Badge variant="gradient" className="px-3 py-0.5 text-xs whitespace-nowrap shadow-sm">
                          {planBadge}
                        </Badge>
                      </div>
                    )}

                    <div className="mb-5">
                      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl mb-3 ${isPro ? "bg-gradient-to-br from-violet-600 to-indigo-600" : "bg-muted"}`}>
                        <PlanIcon className={`h-4.5 w-4.5 ${isPro ? "text-white" : "text-muted-foreground"}`} style={{ width: 18, height: 18 }} />
                      </div>
                      <h3 className="text-lg font-bold">{t(`pricing.plans.${plan}.name`)}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 mb-3">{t(`pricing.plans.${plan}.description`)}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold">{t(`pricing.plans.${plan}.price_monthly`)}</span>
                        <span className="text-sm text-muted-foreground">{t("pricing.per_month")}</span>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-6 flex-1">
                      {(t.raw(`pricing.plans.${plan}.features`) as string[]).map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          <Check className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      asChild
                      variant={isPro ? "gradient" : "outline"}
                      size="lg"
                      className="w-full"
                    >
                      <Link href={`/${locale}/auth/register`}>
                        {t(`pricing.plans.${plan}.cta`)}
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 text-center space-y-3">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-background rounded-full px-5 py-2.5 border shadow-sm">
                <Shield className="h-4 w-4 text-green-500 shrink-0" />
                {t("pricing.guarantee")}
              </div>
              <div className="block">
                <Link href={`/${locale}/pricing`} className="text-sm text-violet-600 hover:underline font-medium">
                  {t("pricing.faq_link")} →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section className="py-28">
          <div className="container">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">{t("testimonials.badge")}</Badge>
              <h2 className="text-4xl md:text-5xl font-bold">{t("testimonials.headline")}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {(t.raw("testimonials.items") as Array<{
                name: string;
                role: string;
                company: string;
                text: string;
                avatar_color: string;
              }>).map((item, i) => (
                <div key={i} className="rounded-2xl border bg-card p-7 flex flex-col gap-4 hover:shadow-md transition-shadow">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    &ldquo;{item.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${item.avatar_color || "from-violet-400 to-indigo-400"} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                      {item.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.role} · {item.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section className="py-24 bg-muted/20">
          <div className="container max-w-3xl">
            <div className="text-center mb-14">
              <Badge variant="outline" className="mb-4">{t("faq.badge")}</Badge>
              <h2 className="text-4xl md:text-5xl font-bold">{t("faq.headline")}</h2>
            </div>

            <div className="space-y-3">
              {(t.raw("faq.items") as Array<{ q: string; a: string }>).map((item, i) => (
                <details
                  key={i}
                  className="group rounded-xl border bg-card overflow-hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-semibold text-sm hover:bg-muted/40 transition-colors list-none">
                    {item.q}
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t bg-muted/20 pt-4">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-28 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700" />
          <div className="absolute inset-0 -z-10 opacity-10">
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl" />
          </div>

          <div className="container text-center text-white">
            <div className="inline-flex items-center gap-2 text-sm font-medium bg-white/15 rounded-full px-4 py-1.5 mb-8 backdrop-blur border border-white/20">
              <Clock className="h-4 w-4" />
              Ready in under 30 seconds
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight">
              {t("cta_section.headline")}
            </h2>
            <p className="text-lg md:text-xl opacity-80 max-w-xl mx-auto mb-12 leading-relaxed">
              {t("cta_section.subheadline")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="xl" className="bg-white text-violet-700 hover:bg-white/95 font-bold shadow-xl shadow-violet-900/30">
                <Link href={`/${locale}/auth/register`}>
                  {t("cta_section.cta_primary")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/15 backdrop-blur">
                <Link href={`/${locale}/pricing`}>{t("cta_section.cta_secondary")}</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
