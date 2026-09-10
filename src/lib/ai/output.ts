export type OutputSchema = {
  type: "object";
  keys: Record<string, "string" | "number" | "boolean">;
};

export function parseOutputSchema(value: unknown): OutputSchema | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const raw = value as Record<string, unknown>;
  if (raw.type !== "object" || !raw.keys || typeof raw.keys !== "object") {
    return null;
  }
  const keys: OutputSchema["keys"] = {};
  for (const [name, typ] of Object.entries(raw.keys as Record<string, unknown>)) {
    if (typ === "string" || typ === "number" || typ === "boolean") {
      keys[name] = typ;
    } else {
      return null;
    }
  }
  return { type: "object", keys };
}

export function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const unfenced = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  return JSON.parse(unfenced);
}

export function validateOutput(
  schema: OutputSchema,
  value: unknown,
): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const row = value as Record<string, unknown>;
  for (const [name, typ] of Object.entries(schema.keys)) {
    if (typeof row[name] !== typ) {
      return false;
    }
  }
  return true;
}
