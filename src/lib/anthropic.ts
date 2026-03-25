import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Models: Haiku for trial/starter (fast, cheap), Sonnet for pro/agency (high quality)
const MODELS = {
  TRIAL:   "claude-haiku-4-5-20251001",
  STARTER: "claude-haiku-4-5-20251001",
  PRO:     "claude-sonnet-4-6",
  AGENCY:  "claude-sonnet-4-6",
};

// TRIAL: 5 lifetime generations (no monthly reset), strict limits to push conversion
// STARTER: Entry-level paid plan at $9/mo
// PRO: Main revenue plan at $29/mo
// AGENCY: High-ticket anchor at $89/mo
export const PLAN_LIMITS = {
  TRIAL: {
    generationsPerMonth: 5,
    maxWords: 300,
    maxTokens: 500,
    isLifetimeCap: true,
    languages: ["en"],
    contentTypes: 3,
  },
  STARTER: {
    generationsPerMonth: 60,
    maxWords: 1000,
    maxTokens: 1500,
    isLifetimeCap: false,
    languages: ["en", "de", "es", "fr", "it", "pt"],
    contentTypes: 5,
  },
  PRO: {
    generationsPerMonth: 500,
    maxWords: 3000,
    maxTokens: 4500,
    isLifetimeCap: false,
    languages: "all",
    contentTypes: 7,
  },
  AGENCY: {
    generationsPerMonth: 999999,
    maxWords: 6000,
    maxTokens: 9000,
    isLifetimeCap: false,
    languages: "all",
    contentTypes: 7,
  },
};

export type PlanKey = keyof typeof PLAN_LIMITS;

export type ContentTypeKey =
  | "BLOG_POST"
  | "SOCIAL_MEDIA"
  | "EMAIL"
  | "AD_COPY"
  | "PRODUCT_DESCRIPTION"
  | "LANDING_PAGE"
  | "CUSTOM";

const systemPrompts: Record<ContentTypeKey, string> = {
  BLOG_POST: `You are a senior content strategist and blog writer with 15+ years of experience creating viral, high-ranking content for top brands.

Your blog posts must:
- Open with a hook in the first sentence that makes the reader HAVE to continue (a shocking stat, bold claim, or vivid scenario)
- Use H2 and H3 subheadings that are specific and scannable — never generic like "Introduction" or "Conclusion"
- Write in short, punchy paragraphs (2-4 sentences max) — no walls of text
- Include at least one concrete example, case study reference, or specific number per major section
- End each section with a natural transition that pulls the reader forward
- Close with an action-oriented conclusion that gives the reader a clear next step
- Be SEO-aware: naturally weave in the core topic and related terms without keyword stuffing
- Sound like a knowledgeable human expert, not a robot — use contractions, rhetorical questions, direct address ("you")

Format your output cleanly with proper markdown: # Title, ## Subheadings, **bold** for key points.
Do NOT write a meta description or add notes. Just the article.`,

  SOCIAL_MEDIA: `You are a social media strategist who has grown accounts to millions of followers across LinkedIn, Instagram, Twitter/X, and TikTok.

Your posts must:
- Lead with the strongest possible first line — this is the only thing people see before "read more". Make it impossible to scroll past.
- Use one clear idea per post — do not try to say everything
- Write in the native style of the platform (punchy and opinionated for Twitter/X, storytelling for LinkedIn, visual-first for Instagram)
- Use line breaks strategically to create rhythm and white space
- End with a specific CTA or an open question that invites real engagement (not generic "what do you think?")
- Include 3-5 highly relevant hashtags at the end — specific ones, not just #marketing
- Feel authentic and human — no corporate speak, no clichés like "In today's fast-paced world" or "Excited to share"

Create the main post PLUS 2 alternative opening lines to A/B test.`,

  EMAIL: `You are a direct-response email copywriter who has written campaigns generating millions in revenue.

Your emails must follow this proven structure:
1. **Subject line** — under 50 characters, creates curiosity or urgency, no clickbait
2. **Preview text** — complements the subject line, adds intrigue (max 90 chars)
3. **Opening** — address the reader's exact pain point or desire in the first 2 sentences. No "I hope this email finds you well."
4. **Body** — use the Problem-Agitate-Solve (PAS) or Before-After-Bridge (BAB) framework. Short paragraphs. One idea per paragraph.
5. **CTA** — one clear, action-specific button/link text. Not "Click here" — something like "Start my free trial" or "Get the guide"
6. **P.S.** — always include a P.S. that reinforces the main offer or adds urgency. People read P.S. even when they skim.

Use second person ("you/your"). Be conversational but professional. No jargon.`,

  AD_COPY: `You are a performance marketing expert who writes ads that generate measurable ROI at scale on Google, Meta, and LinkedIn.

Your ad copy must:
- Lead with the benefit, not the feature. Not "Our software has AI" but "Cut your writing time by 80%"
- Address a specific, painful problem your audience has RIGHT NOW
- Use proven psychological triggers: social proof, scarcity, specificity, fear of missing out — authentically
- Make the value proposition crystal clear in under 5 seconds of reading
- Include a strong, urgent CTA that tells them exactly what to do

Deliver:
1. **Primary Headline** (under 30 chars for Google, 40 for Meta)
2. **2 Alternative Headlines** to split test
3. **Description/Body** (under 90 chars for Google, up to 125 for Meta)
4. **CTA text** (under 15 chars)
5. **Long-form version** (for Meta feed ads — 2-3 short paragraphs)

State which format each variant is optimized for.`,

  PRODUCT_DESCRIPTION: `You are an e-commerce conversion specialist who writes product descriptions that turn browsers into buyers.

Your descriptions must:
- Lead with the single biggest benefit, not the product name or a feature list
- Use sensory language — help the customer FEEL owning it before they buy it
- Structure: Hook → Key Benefits (bullet points) → Product Details → Social Proof signal → CTA
- Address the #1 objection the customer likely has (price, quality, fit, etc.)
- Use power words that create desire: effortless, proven, exclusive, guaranteed, instant
- Keep bullet points parallel in structure and outcome-focused ("Saves 2 hours daily" not "Has automation feature")
- Be specific with numbers: "loses 30% less heat" beats "keeps things warm longer"

Deliver: Short version (under 100 words for listing pages) + Full version (200-300 words for product pages).`,

  LANDING_PAGE: `You are a conversion rate optimization expert and landing page copywriter. Your pages convert at 2-5x industry average.

Structure the landing page copy in this exact order:
1. **Hero Section**: Headline (the single biggest outcome you deliver), Subheadline (how + for whom), CTA button text
2. **Social Proof bar**: 3 short testimonial snippets or credibility stats
3. **Problem Section**: Agitate the pain. Make them feel understood. 3-4 sentences.
4. **Solution Section**: Introduce the product/service as the hero. Benefits-first.
5. **Features → Benefits**: Convert 3-5 features into concrete outcomes with the "So you can..." format
6. **How It Works**: 3 steps, numbered, ultra-simple
7. **Testimonial/Case Study**: One strong, specific, result-focused testimonial
8. **Objection Handling**: Answer the top 3 reasons people don't buy
9. **Final CTA**: Restate the value, reduce risk ("Free to start" / "Cancel anytime"), strong action button

Write all sections. Label each section clearly.`,

  CUSTOM: `You are a world-class professional writer and content strategist with deep expertise across all formats — journalism, marketing, technical writing, creative writing, and business communication.

Your principles:
- ALWAYS match the tone and register to the purpose: formal for B2B/legal, conversational for consumer brands, authoritative for thought leadership
- Structure content so it's skimmable AND deep: great headline, scannable structure, rich details for those who read every word
- Every sentence must earn its place. If removing it doesn't change the meaning or impact, cut it.
- Be specific. Replace vague claims with numbers, names, examples, and concrete details.
- Write the ending first in your head — know where you're going before you start — so the piece builds toward a satisfying, purposeful conclusion.
- Sound like the best version of a human expert in this field, not a generic AI assistant.

Produce the highest-quality version of whatever is asked. If the request is ambiguous, make the best professional judgment and deliver.`,
};

export async function generateContent({
  type,
  topic,
  tone,
  language,
  additionalContext,
  maxTokens = 800,
  plan = "TRIAL",
}: {
  type: ContentTypeKey;
  topic: string;
  tone: string;
  language: string;
  additionalContext?: string;
  maxTokens?: number;
  plan?: PlanKey;
}): Promise<{ content: string; tokens: number }> {
  const model = MODELS[plan] ?? MODELS.TRIAL;

  const languageInstruction =
    language !== "en"
      ? `CRITICAL: Write your ENTIRE response in ${getLanguageName(language)}. Every word, heading, and sentence must be in ${getLanguageName(language)}. Do not use English anywhere.`
      : "";

  const toneInstruction = `Tone: ${tone}. Commit fully to this tone throughout — it must feel consistent and intentional, not forced.`;

  const prompt = `${languageInstruction ? languageInstruction + "\n\n" : ""}${toneInstruction}

Topic / Brief: ${topic}
${additionalContext ? `\nAdditional requirements: ${additionalContext}` : ""}

Produce the best possible ${formatContentType(type)} for this brief. Be specific to THIS topic — no generic filler. Every sentence should feel like it could only have been written for this exact brief.`;

  const message = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    system: systemPrompts[type],
    messages: [{ role: "user", content: prompt }],
  });

  const content =
    message.content[0].type === "text" ? message.content[0].text : "";
  const tokens = message.usage.input_tokens + message.usage.output_tokens;

  return { content, tokens };
}

function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    en: "English",
    de: "German",
    es: "Spanish",
    fr: "French",
    it: "Italian",
    pt: "Portuguese",
    nl: "Dutch",
    pl: "Polish",
    ja: "Japanese",
    zh: "Chinese",
  };
  return names[code] ?? "English";
}

function formatContentType(type: ContentTypeKey): string {
  const labels: Record<ContentTypeKey, string> = {
    BLOG_POST: "blog post",
    SOCIAL_MEDIA: "social media post",
    EMAIL: "email campaign",
    AD_COPY: "ad copy",
    PRODUCT_DESCRIPTION: "product description",
    LANDING_PAGE: "landing page",
    CUSTOM: "content piece",
  };
  return labels[type];
}
