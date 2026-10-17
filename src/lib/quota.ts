export const FREE_RUNS_PER_MONTH = 5;

export const COUNTED_SKILLS = new Set([
  "match_offer",
  "optimize_cv",
  "rewrite_section",
]);

export function isPro(status: string): boolean {
  return status === "pro";
}
