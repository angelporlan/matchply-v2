"use server";

import { redirect } from "next/navigation";
import { seedSkills } from "@/db/skills";
import { getOwnedCv } from "@/db/cvs";
import { getOwnedOffer, saveOfferMatch } from "@/db/offers";
import { redirectSkillFailure } from "@/lib/ai/errors";
import { runSkill } from "@/lib/ai/runner";
import { requireAuth } from "@/lib/auth";
import { parseStoredCv } from "@/lib/cv";

export async function runMatch(formData: FormData) {
  const { userId } = await requireAuth();
  await seedSkills();
  const offerId = String(formData.get("offerId") ?? "");
  const offer = await getOwnedOffer(offerId, userId);
  if (!offer) {
    redirect("/offers");
  }
  if (!offer.cvId) {
    redirect(`/offers/${offerId}?error=cv`);
  }
  const cv = await getOwnedCv(offer.cvId, userId);
  if (!cv) {
    redirect(`/offers/${offerId}?error=cv`);
  }

  let raw: Record<string, unknown>;
  try {
    raw = await runSkill(
      "match_offer",
      {
        cv: JSON.stringify(parseStoredCv(cv.data)),
        offer: `${offer.title} · ${offer.company}\n${offer.description}`,
      },
      userId,
    );
  } catch (error) {
    redirectSkillFailure(error, `/offers/${offerId}`);
  }

  const score = clampScore(raw.score);
  const gaps = asStringList(raw.gaps, 6);
  const evidence = asStringList(raw.evidence, 6);
  if (score === null) {
    redirect(`/offers/${offerId}?error=basura`);
  }

  await saveOfferMatch({ id: offerId, userId, score, gaps, evidence });
  redirect(`/offers/${offerId}`);
}

function clampScore(value: unknown): number | null {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }
  return Math.min(100, Math.max(0, Math.round(value)));
}

function asStringList(value: unknown, max: number): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, max);
}
