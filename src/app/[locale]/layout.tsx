import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "QUILL AI — AI Content Platform",
    template: "%s | QUILL AI",
  },
  description:
    "Create brilliant AI-powered content in seconds. Blog posts, social media, emails, and more — in 10+ languages.",
  keywords: ["AI content", "content generator", "blog writer", "social media", "copywriting AI"],
  authors: [{ name: "QUILL AI" }],
  openGraph: {
    type: "website",
    siteName: "QUILL AI",
    title: "QUILL AI — AI Content Platform",
    description: "Create brilliant AI-powered content in seconds.",
  },
  twitter: {
    card: "summary_large_image",
    title: "QUILL AI — AI Content Platform",
    description: "Create brilliant AI-powered content in seconds.",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "de" | "es" | "fr")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
