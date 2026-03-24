"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(
  email: string,
  password: string
): Promise<{ error?: string; url?: string }> {
  try {
    const url = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { url: url ?? "/" };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "invalid_credentials" };
    }
    throw error;
  }
}
