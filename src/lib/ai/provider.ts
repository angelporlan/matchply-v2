import { env } from "@/lib/env";

export type ChatMessage = { role: "system" | "user"; content: string };

export async function complete(messages: ChatMessage[]): Promise<string> {
  const model = encodeURIComponent(env.geminiModel);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const system = messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n\n");
  const contents = messages
    .filter((message) => message.role === "user")
    .map((message) => ({
      role: "user",
      parts: [{ text: message.content }],
    }));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "x-goog-api-key": env.geminiApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: system ? { parts: [{ text: system }] } : undefined,
      contents,
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    }),
    signal: AbortSignal.timeout(30_000),
  });

  const raw = await response.text();
  if (!response.ok) {
    throw new Error(`proveedor HTTP ${response.status}`);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    throw new Error("proveedor: JSON inválido");
  }

  return readOutputText(body);
}

function readOutputText(body: unknown): string {
  if (!body || typeof body !== "object") {
    throw new Error("proveedor: respuesta vacía");
  }
  const record = body as Record<string, unknown>;
  if (!Array.isArray(record.candidates) || record.candidates.length === 0) {
    throw new Error("proveedor: sin texto");
  }
  const first = record.candidates[0];
  if (!first || typeof first !== "object") {
    throw new Error("proveedor: sin texto");
  }
  const candidate = first as Record<string, unknown>;
  if (!candidate.content || typeof candidate.content !== "object") {
    throw new Error("proveedor: sin texto");
  }
  const content = candidate.content as Record<string, unknown>;
  if (!Array.isArray(content.parts)) {
    throw new Error("proveedor: sin texto");
  }

  const chunks: string[] = [];
  for (const part of content.parts) {
    if (!part || typeof part !== "object") {
      continue;
    }
    const piece = part as Record<string, unknown>;
    if (piece.thought === true) {
      continue;
    }
    if (typeof piece.text === "string" && piece.text.trim()) {
      chunks.push(piece.text);
    }
  }
  const text = chunks.join("");
  if (!text.trim()) {
    throw new Error("proveedor: sin texto");
  }
  return text;
}
