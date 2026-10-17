import { redirect } from "next/navigation";
import { SkillError } from "@/lib/ai/runner";

export function redirectSkillFailure(error: unknown, fallback: string): never {
  if (error instanceof SkillError) {
    redirect(`${fallback}?error=${error.code}`);
  }
  if (error instanceof Error && error.message.includes("GEMINI_API_KEY")) {
    redirect(`${fallback}?error=key`);
  }
  throw error;
}
