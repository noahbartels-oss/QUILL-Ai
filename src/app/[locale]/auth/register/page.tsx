"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Feather, Github, Loader2, AlertCircle, CheckCircle2, Zap } from "lucide-react";

const hasGoogle = process.env.NEXT_PUBLIC_HAS_GOOGLE === "true";
const hasGitHub = process.env.NEXT_PUBLIC_HAS_GITHUB === "true";

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const locale = useLocale();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"github" | "google" | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", { email, password, redirect: false });
      if (signInResult?.ok) {
        router.push(`/${locale}/dashboard`);
      } else {
        setSuccess(true);
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  async function handleOAuth(provider: "github" | "google") {
    setOauthLoading(provider);
    await signIn(provider, { callbackUrl: `/${locale}/dashboard` });
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/10">
        <div className="w-full max-w-sm text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Account created!</h2>
          <p className="text-muted-foreground text-sm mb-6">Please sign in to continue.</p>
          <Button asChild variant="gradient" className="w-full">
            <Link href={`/${locale}/auth/login`}>Sign in now</Link>
          </Button>
        </div>
      </div>
    );
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
        <div className="space-y-5">
          <h2 className="text-2xl font-bold leading-snug">Start creating better content today.</h2>
          <ul className="space-y-3 text-sm opacity-80">
            {[
              "5 free AI generations — no credit card",
              "Blog posts, emails, ads & more",
              "10+ languages supported",
              "Results in under 5 seconds",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <Zap className="h-4 w-4 text-violet-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
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
              <div className="flex items-start gap-2 p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />{error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="name">{t("name_label")}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Jane Doe" autoComplete="name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("email_label")}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">{t("password_label")}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" autoComplete="new-password" />
              <p className="text-xs text-muted-foreground">{t("password_hint")}</p>
            </div>
            <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account…</> : t("submit")}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">{t("terms")}</p>
          <p className="text-center text-sm text-muted-foreground mt-4">
            {t("have_account")}{" "}
            <Link href={`/${locale}/auth/login`} className="text-violet-600 font-semibold hover:underline">{t("login_link")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
