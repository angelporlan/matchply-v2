import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { sessions } from "@/db/schema";
import { env } from "@/lib/env";

const COOKIE = "session";
const TTL_MS = 1000 * 60 * 60 * 24 * 30;

export type Auth = { userId: string };

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: env.nodeEnv === "production",
    path: "/",
    expires,
  };
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TTL_MS);
  await getDb().insert(sessions).values({ userId, token, expiresAt });
  cookies().set(COOKIE, token, cookieOptions(expiresAt));
}

export async function destroySession() {
  const token = cookies().get(COOKIE)?.value;
  if (token) {
    await getDb().delete(sessions).where(eq(sessions.token, token));
  }
  cookies().set(COOKIE, "", cookieOptions(new Date(0)));
}

export async function auth(): Promise<Auth | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) {
    return null;
  }

  const [row] = await getDb()
    .select({
      userId: sessions.userId,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .where(eq(sessions.token, token))
    .limit(1);

  if (!row) {
    return null;
  }

  if (row.expiresAt.getTime() <= Date.now()) {
    await getDb().delete(sessions).where(eq(sessions.token, token));
    return null;
  }

  return { userId: row.userId };
}

export async function requireAuth(): Promise<Auth> {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return session;
}
