"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function loginAction(
  email: string,
  password: string
): Promise<{ error?: string }> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "invalid_credentials" };
    }
    throw error;
  }
}

export async function oauthSignInAction(
  provider: "google" | "github",
  callbackUrl: string
): Promise<void> {
  await signIn(provider, { redirectTo: callbackUrl });
}
