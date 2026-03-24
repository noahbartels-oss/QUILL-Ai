"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Feather, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

const ERROR_MESSAGES: Record<string, { title: string; desc: string }> = {
  Configuration: {
    title: "Server configuration error",
    desc: "OAuth credentials are not configured correctly. Please contact support.",
  },
  AccessDenied: {
    title: "Access denied",
    desc: "You do not have permission to sign in.",
  },
  Verification: {
    title: "Verification failed",
    desc: "The sign-in link may have expired. Please request a new one.",
  },
  OAuthSignin: {
    title: "OAuth sign-in error",
    desc: "Could not start the OAuth sign-in process. Make sure the OAuth credentials are configured in Vercel.",
  },
  OAuthCallback: {
    title: "OAuth callback error",
    desc: "OAuth sign-in failed. Check that NEXTAUTH_URL is set to your Vercel deployment URL and the OAuth redirect URI matches.",
  },
  OAuthCreateAccount: {
    title: "Could not create account",
    desc: "Unable to create an account via OAuth. The database may not be configured. Set DATABASE_URL in Vercel.",
  },
  EmailCreateAccount: {
    title: "Could not create account",
    desc: "Unable to create an account. The database may not be configured.",
  },
  Callback: {
    title: "Callback error",
    desc: "An error occurred during sign-in. Please try again.",
  },
  Default: {
    title: "Authentication error",
    desc: "An unexpected error occurred. Please try again.",
  },
};

function AuthErrorContent() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error") ?? "Default";
  const info = ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.Default;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md text-center">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-10 justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600">
            <Feather className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">QUILL AI</span>
        </Link>

        <div className="bg-white rounded-2xl border shadow-lg p-8">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-red-500" />
            </div>
          </div>

          <h1 className="text-xl font-bold mb-2">{info.title}</h1>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{info.desc}</p>

          {(errorCode === "OAuthCallback" || errorCode === "OAuthCreateAccount" || errorCode === "OAuthSignin" || errorCode === "Configuration") && (
            <div className="text-left bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-xs text-amber-800 space-y-1.5">
              <p className="font-bold">Setup checklist:</p>
              <p>1. Set <code className="bg-amber-100 px-1 rounded">DATABASE_URL</code> in Vercel (use Neon.tech — free)</p>
              <p>2. Run <code className="bg-amber-100 px-1 rounded">npx prisma db push</code> after adding DATABASE_URL</p>
              <p>3. Set <code className="bg-amber-100 px-1 rounded">NEXTAUTH_URL</code> to your Vercel URL</p>
              <p>4. Add OAuth credentials + correct redirect URI in Google/GitHub</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button asChild variant="gradient" className="w-full">
              <Link href={`/${locale}/auth/login`}>Try again</Link>
            </Button>
            <Button asChild variant="outline" className="w-full gap-2">
              <Link href={`/${locale}`}>
                <ArrowLeft className="h-4 w-4" /> Back to home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-violet-600 border-t-transparent rounded-full" /></div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
