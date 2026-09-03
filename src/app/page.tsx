import { env } from "@/lib/env";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-ink/60">Fase 1 · Datos</p>
      <h1 className="text-4xl font-semibold tracking-tight">{env.appName}</h1>
      <p className="text-lg leading-relaxed text-ink/80">
        Rebuild desde cero. La app habla con Postgres (Supabase) a través de
        Drizzle. La siguiente pieza no entra hasta que esta se pueda explicar
        sin abrir el código.
      </p>
      <p className="text-sm text-ink/60">
        Comprueba el pulso — ahora con{" "}
        <code className="text-ink/80">select 1</code> — en{" "}
        <a className="underline decoration-ink/30 underline-offset-4" href="/api/health">
          /api/health
        </a>
        .
      </p>
    </main>
  );
}
