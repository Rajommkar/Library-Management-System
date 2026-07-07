"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { AuthCredentials } from "@/types";
import { headers } from "next/headers";
import { ratelimit } from "@/lib/ratelimit";
import { workflowClient } from "@/lib/workflow";

export const signUp = async (params: AuthCredentials) => {
  const { fullname, email, universityId, password, universityCard } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  
  try {
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return { success: false, error: "Too many requests" };
    }
  } catch (err) {
    console.error("Ratelimit error:", err);
    // Fallback: If redis is not configured properly or unreachable, allow the request
  }

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { success: false, error: "User already exists with this email" };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(users).values({
      fullname,
      email,
      universityId,
      password: hashedPassword,
      universityCard,
    });

    await workflowClient.trigger({
      url: `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/workflows/onboarding`,
      body: {
        email,
        fullName: fullname,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Sign-up error:", error);
    if (error?.name === 'RedirectError' || error?.message?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    return { success: false, error: "An error occurred during sign-up" };
  }
};

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  const { email, password } = params;

  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  
  try {
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return { success: false, error: "Too many requests" };
    }
  } catch (err) {
    console.error("Ratelimit error:", err);
    // Fallback: If redis is not configured properly or unreachable, allow the request
  }

  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const isAdmin = existingUser.length > 0 && existingUser[0].role === "ADMIN";

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      redirectTo: isAdmin ? "/admin" : "/",
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true, redirectTo: isAdmin ? "/admin" : "/" };
  } catch (error: any) {
    console.error("Sign-in error:", error);
    // Rethrow redirect error to allow Next.js/NextAuth to process the redirect or handle headers correctly.
    if (error?.name === 'RedirectError' || error?.message?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    return { success: false, error: "Either ID or password is incorrect, try again." };
  }
};
