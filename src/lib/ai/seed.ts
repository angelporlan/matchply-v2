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

export const MATCH_SKILL: SkillSeed = {
  id: "match_offer",
  version: 1,
  system: `Eres un evaluador de encaje CV-oferta. No inventes experiencia que no esté en el CV.
Responde SOLO JSON: {"score":0-100,"gaps":["..."],"evidence":["..."]}
score: 0 nada, 50 parcial, 80+ encaje fuerte.
gaps: requisitos de la oferta SIN evidencia en el CV (máx 6, frases cortas).
evidence: hechos del CV que SÍ cubren requisitos (máx 6).
No des opiniones vagas: cada gap o evidence debe apuntar a un requisito concreto.`,
  userTemplate: "CV JSON:\n{{cv}}\n\nOferta:\n{{offer}}",
  output: {
    type: "object",
    keys: { score: "number", gaps: "string[]", evidence: "string[]" },
  },
};

export const OPTIMIZE_SKILL: SkillSeed = {
  id: "optimize_cv",
  version: 1,
  system: `Adapta el CV JSON a la oferta. No inventes empresas, títulos ni fechas.
Puedes reescribir headline, summary, bullets y el orden de skills.
Conserva los mismos "id" de experience y education.
Responde SOLO el JSON del CV con claves profile, experience, education, skills.`,
  userTemplate: "CV JSON:\n{{cv}}\n\nOferta:\n{{offer}}",
  output: { type: "cv" },
};

export const REWRITE_SKILL: SkillSeed = {
  id: "rewrite_section",
  version: 1,
  system: `Reescribe la sección del CV para esta oferta. Conserva hechos. No inventes.
Responde SOLO JSON: {"rewritten":"..."}.
Si hay varios bullets, sepáralos con saltos de línea.`,
  userTemplate: "Oferta:\n{{offer}}\n\nSección ({{kind}}):\n{{section}}",
  output: { type: "object", keys: { rewritten: "string" } },
};

export const SKILL_SEED: SkillSeed[] = [
  ECHO_SKILL,
  MATCH_SKILL,
  OPTIMIZE_SKILL,
  REWRITE_SKILL,
];
