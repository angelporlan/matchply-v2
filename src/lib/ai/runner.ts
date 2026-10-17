import { recordRun, countRunsThisMonth } from "@/db/runs";
import { getSkill } from "@/db/skills";
import { getUserById } from "@/db/users";
import {
  extractJson,
  parseOutputSchema,
  validateOutput,
} from "@/lib/ai/output";
import { complete } from "@/lib/ai/provider";
import { COUNTED_SKILLS, FREE_RUNS_PER_MONTH, isPro } from "@/lib/quota";

export class SkillError extends Error {
  constructor(
    message: string,
    readonly code: "missing" | "schema" | "basura" | "provider" | "quota",
  ) {
    super(message);
  }
}

export async function runSkill(
  skillId: string,
  input: Record<string, string>,
  userId: string,
): Promise<Record<string, unknown>> {
  const skill = await getSkill(skillId);
  if (!skill) {
    throw new SkillError(`No existe la skill ${skillId}`, "missing");
  }

  const schema = parseOutputSchema(skill.output);
  if (!schema) {
    throw new SkillError("La skill tiene un output inválido", "schema");
  }

  if (COUNTED_SKILLS.has(skillId)) {
    const user = await getUserById(userId);
    if (!user) {
      throw new SkillError("No hay sesión", "missing");
    }
    if (!isPro(user.subscriptionStatus)) {
      const used = await countRunsThisMonth(userId);
      if (used >= FREE_RUNS_PER_MONTH) {
        throw new SkillError("Cuota agotada", "quota");
      }
    }
  }

  const messages = [
    { role: "system" as const, content: skill.system },
    {
      role: "user" as const,
      content: fillTemplate(skill.userTemplate, input),
    },
  ];

  let raw: string;
  try {
    raw = await complete(messages);
  } catch (error) {
    if (error instanceof Error && error.message.includes("GEMINI_API_KEY")) {
      throw error;
    }
    throw new SkillError("El proveedor no respondió", "provider");
  }

  let parsed: unknown;
  try {
    parsed = extractJson(raw);
  } catch {
    throw new SkillError("El modelo no devolvió JSON", "basura");
  }

  if (!validateOutput(schema, parsed)) {
    throw new SkillError("El JSON no cumple el schema de la skill", "basura");
  }

  await recordRun(userId, skillId);
  return parsed;
}

function fillTemplate(template: string, input: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => input[key] ?? "");
}
