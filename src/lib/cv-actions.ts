"use server";

import { redirect } from "next/navigation";
import { activateOwnedCv, insertCv, listCvs, updateOwnedCv } from "@/db/cvs";
import { requireAuth } from "@/lib/auth";
import { emptyCv, parseCv, parseTitle } from "@/lib/cv";

export async function createCv(formData: FormData) {
  const { userId } = await requireAuth();
  const title = parseTitle(formData.get("title")) ?? "CV";
  const existing = await listCvs(userId);
  const row = await insertCv({
    userId,
    title,
    data: emptyCv(),
    isActive: existing.length === 0,
  });
  redirect(`/cvs/${row.id}`);
}

export async function updateCv(formData: FormData) {
  const { userId } = await requireAuth();
  const cvId = String(formData.get("cvId") ?? "");
  const title = parseTitle(formData.get("title"));
  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("data") ?? ""));
  } catch {
    redirect(`/cvs/${cvId}?error=invalid`);
  }
  const data = parseCv(raw);
  if (!title || !data) {
    redirect(`/cvs/${cvId}?error=invalid`);
  }

  const updated = await updateOwnedCv({ id: cvId, userId, title, data });
  if (!updated) {
    redirect("/dashboard");
  }
  redirect(`/cvs/${cvId}?saved=1`);
}

export async function setActiveCv(formData: FormData) {
  const { userId } = await requireAuth();
  const cvId = String(formData.get("cvId") ?? "");
  const updated = await activateOwnedCv(cvId, userId);
  if (!updated) {
    redirect("/dashboard");
  }
  redirect("/dashboard");
}
