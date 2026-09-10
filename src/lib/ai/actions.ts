"use server";

import { redirect } from "next/navigation";
import { seedSkills } from "@/db/skills";
import { runSkill, SkillError } from "@/lib/ai/runner";
import { requireAuth } from "@/lib/auth";

export async function runEcho(formData: FormData) {
  await requireAuth();
  await seedSkills();

  const text = String(formData.get("text") ?? "").trim();
  if (!text || text.length > 500) {
    redirect("/ai?error=invalid");
  }

  let result: Record<string, unknown>;
  try {
    result = await runSkill("echo", { text });
  } catch (error) {
    if (error instanceof SkillError) {
      redirect(`/ai?error=${error.code}`);
    }
    if (error instanceof Error && error.message.includes("GEMINI_API_KEY")) {
      redirect("/ai?error=key");
    }
    throw error;
  }

  const echo = result.echo;
  if (typeof echo !== "string") {
    redirect("/ai?error=basura");
  }
  redirect(`/ai?echo=${encodeURIComponent(echo)}`);
}
