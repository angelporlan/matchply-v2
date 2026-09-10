import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { SKILL_SEED, type SkillSeed } from "@/lib/ai/seed";
import { skills } from "./schema";

export async function getSkill(id: string) {
  const [row] = await getDb()
    .select()
    .from(skills)
    .where(eq(skills.id, id))
    .orderBy(desc(skills.version))
    .limit(1);
  return row ?? null;
}

export async function upsertSkill(skill: SkillSeed) {
  await getDb()
    .insert(skills)
    .values(skill)
    .onConflictDoUpdate({
      target: [skills.id, skills.version],
      set: {
        system: skill.system,
        userTemplate: skill.userTemplate,
        output: skill.output,
      },
    });
}

export async function seedSkills() {
  for (const skill of SKILL_SEED) {
    await upsertSkill(skill);
  }
}
