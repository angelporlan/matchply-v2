import Link from "next/link";
import { seedSkills } from "@/db/skills";
import { runEcho } from "@/lib/ai/actions";
import { requireAuth } from "@/lib/auth";

const ERRORS: Record<string, string> = {
  invalid: "Escribe un texto de como máximo 500 caracteres.",
  key: "Falta GEMINI_API_KEY en el servidor. No viaja al navegador.",
  provider: "El proveedor no respondió. Revisa la clave y el modelo.",
  basura: "El modelo devolvió basura: no era JSON con { echo: string }.",
  missing: "No está la skill echo. Recarga la página.",
  schema: "El schema de la skill echo está mal en la tabla.",
};

export default async function AiPage({
  searchParams,
}: {
  searchParams: { echo?: string; error?: string };
}) {
  await requireAuth();
  await seedSkills();

  const error = searchParams.error
    ? (ERRORS[searchParams.error] ?? "No se pudo ejecutar echo.")
    : null;
  const echo = searchParams.echo ?? null;

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-ink/60">
        Fase 5 · Motor IA
      </p>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">Tubo echo</h1>
        <Link
          href="/dashboard"
          className="text-sm underline decoration-ink/30 underline-offset-4"
        >
          Dashboard
        </Link>
      </div>
      <p className="text-ink/80">
        No es match ni optimizar. Es el tubo: valida input → monta mensajes →
        llama al proveedor → parsea JSON → valida el schema de la skill.
      </p>
      {error ? <p className="text-sm text-ink/80">{error}</p> : null}
      {echo ? (
        <p className="border border-ink/10 bg-white px-3 py-3 text-sm">
          echo: {echo}
        </p>
      ) : null}
      <form action={runEcho} className="flex max-w-xl flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Texto
          <input
            name="text"
            required
            maxLength={500}
            className="border border-ink/20 bg-white px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="self-start underline decoration-ink/30 underline-offset-4"
        >
          Ejecutar echo
        </button>
      </form>
    </main>
  );
}
