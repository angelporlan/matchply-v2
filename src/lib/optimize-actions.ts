"use server";

import { redirect } from "next/navigation";
import { getOwnedCv, insertCv } from "@/db/cvs";
import { getOwnedOffer, saveOfferProposal } from "@/db/offers";
import { seedSkills } from "@/db/skills";
import { redirectSkillFailure } from "@/lib/ai/errors";
import { runSkill } from "@/lib/ai/runner";
import { requireAuth } from "@/lib/auth";
import { parseCv, parseStoredCv, type CvData } from "@/lib/cv";

export async function runOptimize(formData: FormData) {
  const { userId } = await requireAuth();
  await seedSkills();
  const offerId = String(formData.get("offerId") ?? "");
  const offer = await getOwnedOffer(offerId, userId);
  if (!offer?.cvId) {
    redirect(`/offers/${offerId}?error=cv`);
  }
  const cv = await getOwnedCv(offer.cvId, userId);
  if (!cv) {
    redirect(`/offers/${offerId}?error=cv`);
  }

  let raw: Record<string, unknown>;
  try {
    raw = await runSkill(
      "optimize_cv",
      {
        cv: JSON.stringify(parseStoredCv(cv.data)),
        offer: `${offer.title} · ${offer.company}\n${offer.description}`,
      },
      userId,
    );
  } catch (error) {
    redirectSkillFailure(error, `/offers/${offerId}`);
  }

  const proposal = parseCv(raw);
  if (!proposal) {
    redirect(`/offers/${offerId}?error=basura`);
  }

  await saveOfferProposal({ id: offerId, userId, proposal });
  redirect(`/offers/${offerId}/adapt`);
}

export async function applyProposal(formData: FormData) {
  const { userId } = await requireAuth();
  const offerId = String(formData.get("offerId") ?? "");
  const offer = await getOwnedOffer(offerId, userId);
  if (!offer?.cvId || !offer.proposal) {
    redirect(`/offers/${offerId}`);
  }
  const baseRow = await getOwnedCv(offer.cvId, userId);
  if (!baseRow) {
    redirect(`/offers/${offerId}?error=cv`);
  }

  const base = parseStoredCv(baseRow.data);
  const proposal = parseCv(offer.proposal);
  if (!proposal) {
    redirect(`/offers/${offerId}?error=basura`);
  }

  const next: CvData = {
    profile: formData.get("profile") ? proposal.profile : base.profile,
    experience: formData.get("experience") ? proposal.experience : base.experience,
    education: formData.get("education") ? proposal.education : base.education,
    skills: formData.get("skills") ? proposal.skills : base.skills,
  };

  const title = `CV · ${offer.company}`.slice(0, 80);
  const created = await insertCv({
    userId,
    title,
    data: next,
    isActive: false,
    sourceCvId: baseRow.id,
    offerId,
  });
  redirect(`/cvs/${created.id}`);
}
