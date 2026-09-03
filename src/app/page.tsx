import Link from "next/link";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-ink/60">
        Fase 2 · Identidad
      </p>
      <h1 className="text-4xl font-semibold tracking-tight">{env.appName}</h1>
      <p className="text-lg leading-relaxed text-ink/80">
        Rebuild desde cero. Hay cuentas con contraseña hasheada y cookie de
        sesión. La siguiente pieza no entra hasta que esta se pueda explicar
        sin abrir el código.
      </p>
      <p className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink/60">
        {session ? (
          <Link
            className="underline decoration-ink/30 underline-offset-4"
            href="/dashboard"
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              className="underline decoration-ink/30 underline-offset-4"
              href="/register"
            >
              Crear cuenta
            </Link>
            <Link
              className="underline decoration-ink/30 underline-offset-4"
              href="/login"
            >
              Entrar
            </Link>
          </>
        )}
        <a
          className="underline decoration-ink/30 underline-offset-4"
          href="/api/health"
        >
          /api/health
        </a>
      </p>
    </main>
  );
}
