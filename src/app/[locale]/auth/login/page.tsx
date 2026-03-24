"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Feather, Github, Loader2, AlertCircle } from "lucide-react";

const hasGoogle = process.env.NEXT_PUBLIC_HAS_GOOGLE === "true";
const hasGitHub = process.env.NEXT_PUBLIC_HAS_GITHUB === "true";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const locale = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"github" | "google" | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError(t("error"));
      setLoading(false);
    } else {
      router.push(`/${locale}/dashboard`);
    }
  }

  async function handleOAuth(provider: "github" | "google") {
    setOauthLoading(provider);
    await signIn(provider, { callbackUrl: `/${locale}/dashboard` });
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel */}
      <div className="hidden lg:flex w-[420px] shrink-0 flex-col justify-between bg-foreground text-background p-12">
        <Link href={`/${locale}`} className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/20">
            <Feather className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">QUILL AI</span>
        </Link>
        <div>
          <blockquote className="text-lg font-medium leading-relaxed opacity-90 mb-5">
            &ldquo;QUILL AI helped us cut content creation time by 80%. It&apos;s become the backbone of our entire marketing operation.&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">S</div>
            <div>
              <div className="text-sm font-semibold">Sarah Johnson</div>
              <div className="text-xs opacity-50">Content Manager, TechFlow Inc.</div>
            </div>
          </div>
        </div>
        <p className="text-xs opacity-30">© 2026 QUILL AI. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-muted/10">
        <div className="w-full max-w-[400px]">
          <div className="lg:hidden text-center mb-8">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
                <Feather className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">QUILL AI</span>
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-1">{t("title")}</h1>
          <p className="text-sm text-muted-foreground mb-8">{t("subtitle")}</p>

          {(hasGoogle || hasGitHub) && (
            <>
              <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: hasGoogle && hasGitHub ? "1fr 1fr" : "1fr" }}>
                {hasGitHub && (
                  <Button variant="outline" onClick={() => handleOAuth("github")} disabled={!!oauthLoading} className="gap-2">
                    {oauthLoading === "github" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
                    GitHub
                  </Button>
                )}
                {hasGoogle && (
                  <Button variant="outline" onClick={() => handleOAuth("google")} disabled={!!oauthLoading} className="gap-2">
                    {oauthLoading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    )}
                    Google
                  </Button>
                )}
              </div>
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">{t("or")}</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />{error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("email_label")}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">{t("password_label")}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" placeholder="••••••••" />
            </div>
            <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…</> : t("submit")}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("no_account")}{" "}
            <Link href={`/${locale}/auth/register`} className="text-violet-600 font-semibold hover:underline">{t("signup_link")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
