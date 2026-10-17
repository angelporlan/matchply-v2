import Link from "next/link";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-ink/60">Matchply</p>
      <h1 className="text-4xl font-semibold tracking-tight">{env.appName}</h1>
      <p className="text-lg leading-relaxed text-ink/80">
        Pega una oferta, mide tu CV y adáptalo con IA. Descarga un PDF. Si se
        acaba la cuota gratis, pasa a pro.
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
        <Link
          className="underline decoration-ink/30 underline-offset-4"
          href="/privacy"
        >
          Privacidad
        </Link>
        <Link
          className="underline decoration-ink/30 underline-offset-4"
          href="/terms"
        >
          Términos
        </Link>
      </p>
    </main>
  );
}
