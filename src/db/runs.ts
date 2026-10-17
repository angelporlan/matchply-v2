import { and, count, eq, gte } from "drizzle-orm";
import { getDb } from "@/db";
import { COUNTED_SKILLS } from "@/lib/quota";
import { aiRuns } from "./schema";

export async function countRunsThisMonth(userId: string): Promise<number> {
  const start = new Date();
  start.setUTCDate(1);
  start.setUTCHours(0, 0, 0, 0);
  const [row] = await getDb()
    .select({ value: count() })
    .from(aiRuns)
    .where(and(eq(aiRuns.userId, userId), gte(aiRuns.createdAt, start)));
  return row?.value ?? 0;
}

export async function recordRun(userId: string, skillId: string) {
  if (!COUNTED_SKILLS.has(skillId)) {
    return;
  }
  await getDb().insert(aiRuns).values({ userId, skillId });
}
