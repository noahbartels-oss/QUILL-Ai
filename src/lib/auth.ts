import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

// On Vercel, AUTH_URL/NEXTAUTH_URL might be set to http://localhost:3000 which
// breaks cookie naming (__Host- vs plain), OAuth callback URLs, and session detection.
// Use VERCEL_URL to auto-fix this at runtime.
if (process.env.VERCEL && process.env.VERCEL_URL) {
  const correctUrl = `https://${process.env.VERCEL_URL}`;
  if (!process.env.AUTH_URL || process.env.AUTH_URL.includes("localhost")) {
    process.env.AUTH_URL = correctUrl;
  }
  if (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost")) {
    process.env.NEXTAUTH_URL = correctUrl;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

const providers = [];

// Only register GitHub if credentials are set
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

// Only register Google if credentials are set
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

providers.push(
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const parsed = z
        .object({ email: z.string().email(), password: z.string().min(6) })
        .safeParse(credentials);

      if (!parsed.success) return null;

      try {
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user || !user.password) return null;

        const valid = await verifyPassword(parsed.data.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      } catch {
        return null;
      }
    },
  })
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === "production",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { plan: true, locale: true },
          });
          if (dbUser) {
            token.plan = dbUser.plan;
            token.locale = dbUser.locale;
          }
        } catch {
          // DB unavailable — continue without plan info
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.plan = token.plan as string;
        session.user.locale = token.locale as string;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      try {
        await prisma.usage.create({
          data: {
            userId: user.id!,
            generationsUsed: 0,
            generationsMax: 5,
            wordsGenerated: 0,
          },
        });
      } catch {
        // Usage record creation failed — non-fatal
      }
    },
  },
});
