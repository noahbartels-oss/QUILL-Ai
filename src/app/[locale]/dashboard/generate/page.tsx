"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Copy,
  Check,
  Save,
  RotateCcw,
  AlertTriangle,
  Crown,
  Loader2,
} from "lucide-react";
import { countWords } from "@/lib/utils";

type ContentType =
  | "BLOG_POST"
  | "SOCIAL_MEDIA"
  | "EMAIL"
  | "AD_COPY"
  | "PRODUCT_DESCRIPTION"
  | "LANDING_PAGE"
  | "CUSTOM";

const CONTENT_TYPES: ContentType[] = [
  "BLOG_POST",
  "SOCIAL_MEDIA",
  "EMAIL",
  "AD_COPY",
  "PRODUCT_DESCRIPTION",
  "LANDING_PAGE",
  "CUSTOM",
];

const TONES = [
  "professional",
  "casual",
  "friendly",
  "formal",
  "humorous",
  "inspirational",
  "persuasive",
  "informative",
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "nl", label: "Nederlands" },
  { code: "pl", label: "Polski" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
];

function GenerateContent() {
  const t = useTranslations("dashboard.generate");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [contentType, setContentType] = useState<ContentType>(
    (searchParams.get("type") as ContentType) || "BLOG_POST"
  );
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [language, setLanguage] = useState("en");
  const [context, setContext] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    const type = searchParams.get("type") as ContentType;
    if (type && CONTENT_TYPES.includes(type)) {
      setContentType(type);
    }
  }, [searchParams]);

  async function handleGenerate() {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    setResult("");
    setSaved(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: contentType,
          topic,
          tone,
          language,
          additionalContext: context,
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setLimitReached(true);
        setError(t("limit_reached"));
        return;
      }

      if (!res.ok) {
        setError(data.error || "Generation failed");
        return;
      }

      setResult(data.content);
      setWordCount(data.wordCount || countWords(data.content));
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRegenerate() {
    setResult("");
    setSaved(false);
    handleGenerate();
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Form */}
        <div className="md:col-span-2 space-y-5">
          {/* Content Type */}
          <div className="space-y-1.5">
            <Label>{t("content_type")}</Label>
            <Select value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(`types.${type}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Topic */}
          <div className="space-y-1.5">
            <Label>{t("topic")}</Label>
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t("topic_placeholder")}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Tone */}
          <div className="space-y-1.5">
            <Label>{t("tone")}</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((t_) => (
                  <SelectItem key={t_} value={t_}>
                    {t(`tones.${t_}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="space-y-1.5">
            <Label>{t("language")}</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
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

          {/* Additional Context */}
          <div className="space-y-1.5">
            <Label>{t("context")}</Label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder={t("context_placeholder")}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            variant="gradient"
            className="w-full"
            size="lg"
            disabled={loading || !topic.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("generating")}
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                {t("generate_btn")}
              </>
            )}
          </Button>

          {/* Limit Reached */}
          {limitReached && (
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
              <div className="flex gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-sm text-orange-700">{t("limit_reached")}</p>
              </div>
              <Button asChild variant="gradient" size="sm" className="w-full gap-1.5">
                <Link href={`/${locale}/pricing`}>
                  <Crown className="h-3.5 w-3.5" />
                  {t("upgrade_now")}
                </Link>
              </Button>
            </div>
          )}

          {/* Error */}
          {error && !limitReached && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        <div className="md:col-span-3">
          <div className="rounded-xl border bg-card h-full flex flex-col min-h-[500px]">
            {/* Result Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">{t("result_title")}</h3>
                {result && (
                  <Badge variant="secondary" className="text-xs">
                    {t("word_count", { count: wordCount })}
                  </Badge>
                )}
              </div>
              {result && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-1.5"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? t("copied") : t("copy")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerate}
                    className="gap-1.5"
                    disabled={loading}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {t("regenerate")}
                  </Button>
                </div>
              )}
            </div>

            {/* Result Body */}
            <div className="flex-1 p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
                  </div>
                  <p className="text-sm">{t("generating")}</p>
                </div>
              ) : result ? (
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {result}
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-violet-400" />
                  </div>
                  <p className="text-sm text-center max-w-xs">
                    Fill in the form and click Generate to create your AI-powered content
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <GenerateContent />
    </Suspense>
  );
}
