import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  const t = useTranslations("privacy");
  const locale = useLocale();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-16 md:py-24">
        <div className="container max-w-3xl">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>

          <h1 className="text-4xl font-extrabold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground mb-10">{t("last_updated")}</p>

          <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Information We Collect</h2>
              <p>When you create an account on QUILL AI, we collect:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Your name and email address</li>
                <li>Password (stored as a secure hash — we never see your plain-text password)</li>
                <li>Content you generate using our platform</li>
                <li>Usage data (number of generations, content types used)</li>
                <li>Technical data such as IP address, browser type, and device information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Provide, operate, and improve QUILL AI services</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send you important account notifications and service updates</li>
                <li>Enforce our Terms of Service and prevent abuse</li>
                <li>Respond to your support requests</li>
              </ul>
              <p className="mt-3">We do <strong className="text-foreground">not</strong> sell your personal data to third parties.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">3. Content You Generate</h2>
              <p>
                Content you generate using QUILL AI belongs to you. We store it securely on our servers to
                provide the content history feature. We do not use your generated content to train AI models
                without your explicit consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Data Retention</h2>
              <p>
                We retain your account data for as long as your account is active. If you delete your account,
                we will delete your personal data within 30 days, except where we are required to retain it
                for legal or compliance purposes.
              </p>
              <p className="mt-2">
                Generated content history is retained according to your plan:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Trial: 3 days</li>
                <li>Starter: 30 days</li>
                <li>Pro &amp; Agency: Unlimited</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Cookies</h2>
              <p>
                We use cookies and similar technologies to keep you signed in, remember your preferences,
                and understand how our platform is used. You can disable cookies in your browser settings,
                though this may affect some functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Third-Party Services</h2>
              <p>We use the following third-party services to operate QUILL AI:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong className="text-foreground">Anthropic:</strong> Powers our AI content generation</li>
                <li><strong className="text-foreground">PayPal:</strong> Handles payment processing</li>
                <li><strong className="text-foreground">Vercel:</strong> Hosts our application</li>
              </ul>
              <p className="mt-2">Each of these services has their own privacy policies governing how they handle data.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Access the personal data we hold about you</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data in a portable format</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, contact us at{" "}
                <a href="mailto:privacy@quill-ai.com" className="text-violet-600 hover:underline">
                  privacy@quill-ai.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Security</h2>
              <p>
                We implement industry-standard security measures including HTTPS encryption, hashed passwords,
                and regular security audits. No system is completely secure, but we take reasonable steps to
                protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of significant changes
                by email or through a notice in our application. Continued use of QUILL AI after changes
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">10. Contact</h2>
              <p>
                If you have questions about this Privacy Policy or how we handle your data, contact us at{" "}
                <a href="mailto:privacy@quill-ai.com" className="text-violet-600 hover:underline">
                  privacy@quill-ai.com
                </a>
              </p>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
