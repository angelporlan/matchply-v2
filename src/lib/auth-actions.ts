"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { createSession, destroySession } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";

function parseCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk || password.length < 8 || password.length > 200) {
    return null;
  }
  return { email, password };
}

function isUniqueViolation(error: unknown) {
  let current: unknown = error;
  for (let i = 0; i < 4; i += 1) {
    if (
      current &&
      typeof current === "object" &&
      "code" in current &&
      current.code === "23505"
    ) {
      return true;
    }
    current =
      current && typeof current === "object" && "cause" in current
        ? current.cause
        : undefined;
  }
  return false;
}

export async function register(formData: FormData) {
  const parsed = parseCredentials(formData);
  if (!parsed) {
    redirect("/register?error=invalid");
  }

  let userId: string;
  try {
    const [user] = await getDb()
      .insert(users)
      .values({
        email: parsed.email,
        passwordHash: await hashPassword(parsed.password),
      })
      .returning({ id: users.id });
    userId = user.id;
  } catch (error) {
    if (isUniqueViolation(error)) {
      redirect("/register?error=taken");
    }
    throw error;
  }

  await createSession(userId);
  redirect("/dashboard");
}

export async function login(formData: FormData) {
  const parsed = parseCredentials(formData);
  if (!parsed) {
    redirect("/login?error=invalid");
  }

  const [user] = await getDb()
    .select({
      id: users.id,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.email, parsed.email))
    .limit(1);

  if (!user || !(await verifyPassword(parsed.password, user.passwordHash))) {
    redirect("/login?error=credentials");
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logout() {
  await destroySession();
  redirect("/");
}
