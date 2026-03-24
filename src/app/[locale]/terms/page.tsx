import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const t = useTranslations("terms");
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
              <h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>
                By creating an account or using QUILL AI (&quot;the Service&quot;), you agree to be bound by these
                Terms of Service. If you do not agree, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">2. Description of Service</h2>
              <p>
                QUILL AI is an AI-powered content generation platform that allows users to create written
                content including blog posts, social media content, emails, ad copy, and more. We reserve
                the right to modify, suspend, or discontinue any aspect of the Service at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">3. Account Registration</h2>
              <p>To use QUILL AI, you must:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Be at least 16 years old</li>
                <li>Provide accurate and complete registration information</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized account use</li>
              </ul>
              <p className="mt-3">
                You are responsible for all activity that occurs under your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Acceptable Use</h2>
              <p>You agree not to use QUILL AI to generate content that:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Is illegal, fraudulent, or deceptive</li>
                <li>Infringes on intellectual property rights of others</li>
                <li>Contains hate speech, harassment, or threats</li>
                <li>Spreads misinformation or is intentionally misleading</li>
                <li>Violates the privacy of others</li>
                <li>Is used to spam or send unsolicited communications</li>
              </ul>
              <p className="mt-3">
                We reserve the right to suspend or terminate accounts that violate these rules.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Ownership of Generated Content</h2>
              <p>
                Content you generate using QUILL AI belongs to you, subject to these Terms. You are
                responsible for reviewing generated content before publishing and ensuring it complies
                with applicable laws and regulations. QUILL AI is not liable for how you use generated content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Subscription and Billing</h2>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Paid plans are billed monthly or yearly in advance</li>
                <li>All prices are in USD unless otherwise stated</li>
                <li>Subscriptions renew automatically unless cancelled before the renewal date</li>
                <li>We offer a 14-day money-back guarantee for first-time paid subscribers</li>
                <li>Refunds after 14 days are at our discretion</li>
                <li>Prices may change with 30 days notice to existing subscribers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Cancellation</h2>
              <p>
                You may cancel your subscription at any time from your account settings. Cancellation takes
                effect at the end of your current billing period. You will retain access to paid features
                until then. We do not prorate refunds for unused time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Intellectual Property</h2>
              <p>
                QUILL AI, its logo, and all related technology are the exclusive property of QUILL AI and
                are protected by copyright, trademark, and other intellectual property laws. You may not
                copy, modify, or distribute our software or branding without express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, QUILL AI shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages arising from your use of the Service.
                Our total liability for any claim shall not exceed the amount you paid us in the 12 months
                preceding the claim.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">10. Disclaimer of Warranties</h2>
              <p>
                The Service is provided &quot;as is&quot; without warranty of any kind. We do not guarantee that
                generated content will be accurate, complete, or suitable for any particular purpose.
                Always review AI-generated content before publishing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">11. Changes to Terms</h2>
              <p>
                We may update these Terms of Service from time to time. We will notify you of material
                changes via email or in-app notification. Continued use of the Service after changes
                take effect constitutes your acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">12. Governing Law</h2>
              <p>
                These Terms are governed by applicable law. Any disputes shall be resolved through
                binding arbitration, except where prohibited by law.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">13. Contact</h2>
              <p>
                Questions about these Terms? Contact us at{" "}
                <a href="mailto:legal@quill-ai.com" className="text-violet-600 hover:underline">
                  legal@quill-ai.com
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
