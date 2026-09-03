import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { auth } from "@/lib/auth";
import { register } from "@/lib/auth-actions";

const ERRORS: Record<string, string> = {
  invalid: "Email válido y contraseña de al menos 8 caracteres.",
  taken: "Ese email ya tiene cuenta.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  if (await auth()) {
    redirect("/dashboard");
  }

  const error = searchParams.error
    ? (ERRORS[searchParams.error] ?? "No se pudo crear la cuenta.")
    : null;

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-ink/60">
        Fase 2 · Identidad
      </p>
      <h1 className="text-4xl font-semibold tracking-tight">Crear cuenta</h1>
      {error ? <p className="text-sm text-ink/80">{error}</p> : null}
      <AuthForm
        action={register}
        submitLabel="Registrarme"
        passwordAutoComplete="new-password"
      />
      <p className="text-sm text-ink/60">
        ¿Ya tienes cuenta?{" "}
        <Link
          className="underline decoration-ink/30 underline-offset-4"
          href="/login"
        >
          Entrar
        </Link>
        .
      </p>
    </main>
  );
}
