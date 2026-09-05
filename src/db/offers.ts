import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import type { OfferInput, OfferStatus } from "@/lib/offer";
import { jobOffers } from "./schema";

export async function listOffers(userId: string) {
  return getDb()
    .select({
      id: jobOffers.id,
      title: jobOffers.title,
      company: jobOffers.company,
      status: jobOffers.status,
      cvId: jobOffers.cvId,
      updatedAt: jobOffers.updatedAt,
    })
    .from(jobOffers)
    .where(eq(jobOffers.userId, userId))
    .orderBy(desc(jobOffers.updatedAt));
}

export async function getOwnedOffer(id: string, userId: string) {
  const [row] = await getDb()
    .select()
    .from(jobOffers)
    .where(and(eq(jobOffers.id, id), eq(jobOffers.userId, userId)))
    .limit(1);
  return row ?? null;
}

export async function insertOffer(input: OfferInput & { userId: string }) {
  const [row] = await getDb()
    .insert(jobOffers)
    .values({
      userId: input.userId,
      title: input.title,
      company: input.company,
      description: input.description,
      url: input.url,
      cvId: input.cvId,
      status: "interested",
    })
    .returning({ id: jobOffers.id });
  return row;
}

export async function updateOwnedOfferStatus(input: {
  id: string;
  userId: string;
  status: OfferStatus;
}) {
  const [row] = await getDb()
    .update(jobOffers)
    .set({ status: input.status, updatedAt: new Date() })
    .where(and(eq(jobOffers.id, input.id), eq(jobOffers.userId, input.userId)))
    .returning({ id: jobOffers.id, status: jobOffers.status });
  return row ?? null;
}

export async function linkOwnedOfferCv(input: {
  id: string;
  userId: string;
  cvId: string | null;
}) {
  const [row] = await getDb()
    .update(jobOffers)
    .set({ cvId: input.cvId, updatedAt: new Date() })
    .where(and(eq(jobOffers.id, input.id), eq(jobOffers.userId, input.userId)))
    .returning({ id: jobOffers.id });
  return row ?? null;
}
