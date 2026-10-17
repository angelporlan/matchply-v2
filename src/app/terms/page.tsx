import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Términos</h1>
      <p className="text-ink/80">
        Matchply es una herramienta para adaptar tu CV a ofertas. El plan free
        incluye un número limitado de usos de IA al mes. El plan pro se cobra
        vía Stripe. El modelo puede equivocarse: tú revisas antes de enviar un
        CV.
      </p>
      <Link
        href="/"
        className="text-sm underline decoration-ink/30 underline-offset-4"
      >
        Inicio
      </Link>
    </main>
  );
}
