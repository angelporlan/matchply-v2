import { getSkill } from "@/db/skills";
import {
  extractJson,
  parseOutputSchema,
  validateOutput,
} from "@/lib/ai/output";
import { complete } from "@/lib/ai/provider";

export class SkillError extends Error {
  constructor(
    message: string,
    readonly code: "missing" | "schema" | "basura" | "provider",
  ) {
    super(message);
  }
}

export async function runSkill(
  skillId: string,
  input: Record<string, string>,
): Promise<Record<string, unknown>> {
  const skill = await getSkill(skillId);
  if (!skill) {
    throw new SkillError(`No existe la skill ${skillId}`, "missing");
  }

  const schema = parseOutputSchema(skill.output);
  if (!schema) {
    throw new SkillError("La skill tiene un output inválido", "schema");
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

  return parsed;
}

function fillTemplate(template: string, input: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => input[key] ?? "");
}
