import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  env: {
    // Expose OAuth provider availability to client at build time
    NEXT_PUBLIC_HAS_GOOGLE: process.env.GOOGLE_CLIENT_ID ? "true" : "false",
    NEXT_PUBLIC_HAS_GITHUB: process.env.GITHUB_CLIENT_ID ? "true" : "false",
    NEXT_PUBLIC_HAS_DB: process.env.DATABASE_URL ? "true" : "false",
  },
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
