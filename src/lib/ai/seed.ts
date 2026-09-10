import type { OutputSchema } from "@/lib/ai/output";

export type SkillSeed = {
  id: string;
  version: number;
  system: string;
  userTemplate: string;
  output: OutputSchema;
};

export const ECHO_SKILL: SkillSeed = {
  id: "echo",
  version: 1,
  system:
    'Responde SOLO con JSON válido, sin markdown ni texto alrededor. Forma exacta: {"echo":"<texto>"}. Copia el texto del usuario tal cual.',
  userTemplate: "{{text}}",
  output: { type: "object", keys: { echo: "string" } },
};

export const SKILL_SEED: SkillSeed[] = [ECHO_SKILL];
