import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// TRIAL: 5 lifetime generations (no monthly reset), strict limits to push conversion
// STARTER: Entry-level paid plan at $9/mo — impulse-buy price point
// PRO: Main revenue plan at $29/mo — strong value vs Starter
// AGENCY: High-ticket anchor at $89/mo — makes Pro look affordable
export const PLAN_LIMITS = {
  TRIAL: {
    generationsPerMonth: 5,      // lifetime cap, not monthly
    maxWords: 300,
    maxTokens: 500,
    isLifetimeCap: true,         // no monthly reset
    languages: ["en"],           // English only
    contentTypes: 3,             // limited types
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
  BLOG_POST:
    "You are an expert blog writer who creates engaging, SEO-optimized blog posts. Write in a clear, conversational style that educates and entertains readers. Include a compelling headline, introduction, well-structured body with subheadings, and a strong conclusion.",
  SOCIAL_MEDIA:
    "You are a social media expert who creates viral, engaging content. Write punchy, attention-grabbing posts with relevant hashtags and clear calls to action. Adapt tone for the target platform.",
  EMAIL:
    "You are a professional email copywriter. Write compelling email campaigns with subject lines that drive opens, personalized body copy that resonates, and clear CTAs that convert. Keep it concise and impactful.",
  AD_COPY:
    "You are an expert advertising copywriter who creates high-converting ad copy. Write persuasive, benefit-focused content with strong headlines, compelling body text, and irresistible calls to action.",
  PRODUCT_DESCRIPTION:
    "You are an e-commerce copywriter who creates compelling product descriptions. Highlight benefits over features, use sensory language, address customer pain points, and include clear purchasing incentives.",
  LANDING_PAGE:
    "You are a conversion-focused landing page copywriter. Write persuasive copy that clearly communicates value, addresses objections, builds trust, and drives visitors to take action.",
  CUSTOM:
    "You are a versatile professional writer with expertise across multiple content types. Create high-quality, tailored content based on the user's specific requirements.",
};

export async function generateContent({
  type,
  topic,
  tone,
  language,
  additionalContext,
  maxTokens = 800,
}: {
  type: ContentTypeKey;
  topic: string;
  tone: string;
  language: string;
  additionalContext?: string;
  maxTokens?: number;
}): Promise<{ content: string; tokens: number }> {
  const languageInstruction =
    language !== "en"
      ? `IMPORTANT: Write your entire response in ${getLanguageName(language)}.`
      : "";

  const prompt = `${languageInstruction}

Topic: ${topic}
Tone: ${tone}
${additionalContext ? `Additional context: ${additionalContext}` : ""}

Please create high-quality ${formatContentType(type)} content based on the above information. Make it professional, engaging, and ready to use.`;

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
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
    EMAIL: "email",
    AD_COPY: "ad copy",
    PRODUCT_DESCRIPTION: "product description",
    LANDING_PAGE: "landing page copy",
    CUSTOM: "content",
  };
  return labels[type];
}
