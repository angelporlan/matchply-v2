"use server";

import { getOwnedCv } from "@/db/cvs";
import { getOwnedOffer } from "@/db/offers";
import { seedSkills } from "@/db/skills";
import { SkillError, runSkill } from "@/lib/ai/runner";
import { requireAuth } from "@/lib/auth";
import { parseStoredCv } from "@/lib/cv";

export type RewriteState = {
  experienceId?: string;
  rewritten?: string;
  error?: string;
};

export async function rewriteExperience(
  _prev: RewriteState | null,
  formData: FormData,
): Promise<RewriteState> {
  const { userId } = await requireAuth();
  await seedSkills();
  const cvId = String(formData.get("cvId") ?? "");
  const offerId = String(formData.get("offerId") ?? "");
  const experienceId = String(formData.get("experienceId") ?? "");

  const [cv, offer] = await Promise.all([
    getOwnedCv(cvId, userId),
    getOwnedOffer(offerId, userId),
  ]);
  if (!cv || !offer) {
    return { error: "cv" };
  }

  const data = parseStoredCv(cv.data);
  const item = data.experience.find((row) => row.id === experienceId);
  if (!item) {
    return { error: "missing" };
  }

  try {
    const result = await runSkill(
      "rewrite_section",
      {
        offer: `${offer.title} · ${offer.company}\n${offer.description}`,
        kind: "experience",
        section: JSON.stringify(item),
      },
      userId,
    );
    const rewritten = result.rewritten;
    if (typeof rewritten !== "string" || !rewritten.trim()) {
      return { experienceId, error: "basura" };
    }
    return { experienceId, rewritten };
  } catch (error) {
    if (error instanceof SkillError) {
      return { experienceId, error: error.code };
    }
    if (error instanceof Error && error.message.includes("GEMINI_API_KEY")) {
      return { experienceId, error: "key" };
    }
    throw error;
  }
}
