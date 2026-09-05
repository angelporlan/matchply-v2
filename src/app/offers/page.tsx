import Link from "next/link";
import { OfferBoard } from "@/components/offer-board";
import { OfferCreateForm } from "@/components/offer-create-form";
import { listCvs } from "@/db/cvs";
import { listOffers } from "@/db/offers";
import { requireAuth } from "@/lib/auth";

const ERRORS: Record<string, string> = {
  invalid: "Título, empresa y descripción son obligatorios. La URL, si va, empieza por http.",
  cv: "Ese CV no es tuyo.",
};

export default async function OffersPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const { userId } = await requireAuth();
  const [offers, cvs] = await Promise.all([
    listOffers(userId),
    listCvs(userId),
  ]);
  const error = searchParams.error
    ? (ERRORS[searchParams.error] ?? "No se pudo guardar.")
    : null;

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-ink/60">
        Fase 4 · Ofertas
      </p>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">Ofertas</h1>
        <Link
          href="/dashboard"
          className="text-sm underline decoration-ink/30 underline-offset-4"
        >
          Dashboard
        </Link>
      </div>
      {error ? <p className="text-sm text-ink/80">{error}</p> : null}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Pegar oferta</h2>
        <OfferCreateForm cvs={cvs} />
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Tablero</h2>
        <OfferBoard offers={offers} />
      </section>
    </main>
  );
}
