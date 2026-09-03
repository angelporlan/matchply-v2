import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import type { CvData } from "@/lib/cv";
import { cvs } from "./schema";

export async function listCvs(userId: string) {
  return getDb()
    .select({
      id: cvs.id,
      title: cvs.title,
      isActive: cvs.isActive,
      updatedAt: cvs.updatedAt,
    })
    .from(cvs)
    .where(eq(cvs.userId, userId))
    .orderBy(desc(cvs.updatedAt));
}

export async function getOwnedCv(id: string, userId: string) {
  const [row] = await getDb()
    .select()
    .from(cvs)
    .where(and(eq(cvs.id, id), eq(cvs.userId, userId)))
    .limit(1);
  return row ?? null;
}

export async function insertCv(input: {
  userId: string;
  title: string;
  data: CvData;
  isActive: boolean;
}) {
  const [row] = await getDb()
    .insert(cvs)
    .values(input)
    .returning({ id: cvs.id });
  return row;
}

export async function updateOwnedCv(input: {
  id: string;
  userId: string;
  title: string;
  data: CvData;
}) {
  const [row] = await getDb()
    .update(cvs)
    .set({
      title: input.title,
      data: input.data,
      updatedAt: new Date(),
    })
    .where(and(eq(cvs.id, input.id), eq(cvs.userId, input.userId)))
    .returning({ id: cvs.id });
  return row ?? null;
}

export async function activateOwnedCv(id: string, userId: string) {
  return getDb().transaction(async (tx) => {
    const [owned] = await tx
      .select({ id: cvs.id })
      .from(cvs)
      .where(and(eq(cvs.id, id), eq(cvs.userId, userId)))
      .limit(1);
    if (!owned) {
      return null;
    }

    await tx
      .update(cvs)
      .set({ isActive: false })
      .where(eq(cvs.userId, userId));

    const [row] = await tx
      .update(cvs)
      .set({ isActive: true, updatedAt: new Date() })
      .where(and(eq(cvs.id, id), eq(cvs.userId, userId)))
      .returning({ id: cvs.id });
    return row ?? null;
  });
}
