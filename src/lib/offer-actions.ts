"use server";

import { redirect } from "next/navigation";
import { getOwnedCv } from "@/db/cvs";
import {
  getOwnedOffer,
  insertOffer,
  linkOwnedOfferCv,
  updateOwnedOfferStatus,
} from "@/db/offers";
import { requireAuth } from "@/lib/auth";
import {
  canTransition,
  isOfferStatus,
  parseOfferInput,
} from "@/lib/offer";

export async function createOffer(formData: FormData) {
  const { userId } = await requireAuth();
  const parsed = parseOfferInput(formData);
  if (!parsed) {
    redirect("/offers?error=invalid");
  }

  if (parsed.cvId) {
    const cv = await getOwnedCv(parsed.cvId, userId);
    if (!cv) {
      redirect("/offers?error=cv");
    }
  }

  const row = await insertOffer({ ...parsed, userId });
  redirect(`/offers/${row.id}`);
}

export async function updateOfferStatus(formData: FormData) {
  const { userId } = await requireAuth();
  const offerId = String(formData.get("offerId") ?? "");
  const next = formData.get("status");
  if (!isOfferStatus(next)) {
    redirect("/offers");
  }

  const offer = await getOwnedOffer(offerId, userId);
  if (!offer) {
    redirect("/offers");
  }
  if (!canTransition(offer.status, next)) {
    redirect(`/offers/${offerId}?error=transition`);
  }

  await updateOwnedOfferStatus({ id: offerId, userId, status: next });
  redirect(`/offers/${offerId}`);
}

export async function linkOfferCv(formData: FormData) {
  const { userId } = await requireAuth();
  const offerId = String(formData.get("offerId") ?? "");
  const cvRaw = String(formData.get("cvId") ?? "").trim();
  const cvId = cvRaw || null;

  const offer = await getOwnedOffer(offerId, userId);
  if (!offer) {
    redirect("/offers");
  }
  if (cvId) {
    const cv = await getOwnedCv(cvId, userId);
    if (!cv) {
      redirect(`/offers/${offerId}?error=cv`);
    }
  }

  await linkOwnedOfferCv({ id: offerId, userId, cvId });
  redirect(`/offers/${offerId}`);
}
