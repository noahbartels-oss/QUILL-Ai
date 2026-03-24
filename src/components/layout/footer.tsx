import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Feather } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                <Feather className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">QUILL AI</span>
            </Link>
            <p className="text-sm text-muted-foreground">{t("tagline")}</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-sm mb-3">{t("product")}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/#features`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("links.features")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/pricing`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("links.pricing")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("links.blog")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-3">{t("company")}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/about`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("links.about")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("links.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm mb-3">{t("legal")}</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/privacy`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("links.privacy")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {t("links.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">{t("copyright")}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {(["en", "de", "es", "fr"] as const).map((l) => (
              <Link
                key={l}
                href={`/${l}`}
                className="px-2 py-1 rounded uppercase font-medium hover:bg-muted transition-colors"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
