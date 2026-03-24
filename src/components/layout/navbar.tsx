"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Feather, Menu, X } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t("features"), href: `/${locale}/#features` },
    { label: t("pricing"), href: `/${locale}/pricing` },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
            <Feather className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">QUILL AI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language switcher */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {(["en", "de", "es", "fr"] as const).map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                className={`px-1.5 py-0.5 rounded uppercase font-medium transition-colors ${
                  locale === l
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {l}
              </Link>
            ))}
          </div>

          {session ? (
            <Button asChild variant="gradient" size="sm">
              <Link href={`/${locale}/dashboard`}>{t("dashboard")}</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/${locale}/auth/login`}>{t("login")}</Link>
              </Button>
              <Button asChild variant="gradient" size="sm">
                <Link href={`/${locale}/auth/register`}>{t("signup")}</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            {session ? (
              <Button asChild variant="gradient" className="w-full">
                <Link href={`/${locale}/dashboard`}>{t("dashboard")}</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/${locale}/auth/login`}>{t("login")}</Link>
                </Button>
                <Button asChild variant="gradient" className="flex-1">
                  <Link href={`/${locale}/auth/register`}>{t("signup")}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
