import Link from "next/link";
import { notFound } from "next/navigation";
import { OfferStatusButtons } from "@/components/offer-status-buttons";
import { listCvs } from "@/db/cvs";
import { getOwnedOffer } from "@/db/offers";
import { requireAuth } from "@/lib/auth";
import { linkOfferCv } from "@/lib/offer-actions";
import { OFFER_STATUS_LABELS } from "@/lib/offer";

const ERRORS: Record<string, string> = {
  transition: "Ese salto de estado no está permitido.",
  cv: "Ese CV no es tuyo.",
};

export default async function OfferPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { error?: string };
}) {
  const { userId } = await requireAuth();
  const [offer, cvs] = await Promise.all([
    getOwnedOffer(params.id, userId),
    listCvs(userId),
  ]);
  if (!offer) {
    notFound();
  }

  const error = searchParams.error
    ? (ERRORS[searchParams.error] ?? "No se pudo actualizar.")
    : null;
  const linked = cvs.find((cv) => cv.id === offer.cvId);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-ink/60">
        Fase 4 · Ofertas
      </p>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">{offer.title}</h1>
        <Link
          href="/offers"
          className="text-sm underline decoration-ink/30 underline-offset-4"
        >
          Tablero
        </Link>
      </div>
      <p className="text-lg text-ink/70">{offer.company}</p>
      <p className="text-sm uppercase tracking-wide text-ink/50">
        {OFFER_STATUS_LABELS[offer.status]}
      </p>
      {error ? <p className="text-sm text-ink/80">{error}</p> : null}
      {offer.url ? (
        <a
          href={offer.url}
          className="text-sm underline decoration-ink/30 underline-offset-4"
        >
          {offer.url}
        </a>
      ) : null}
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
        {offer.description}
      </p>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">Siguiente estado</h2>
        <OfferStatusButtons offerId={offer.id} status={offer.status} />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">CV enlazado</h2>
        <p className="text-sm text-ink/70">
          {linked ? linked.title : "Ninguno"}
        </p>
        <form action={linkOfferCv} className="flex flex-wrap items-end gap-3">
          <input type="hidden" name="offerId" value={offer.id} />
          <label className="flex flex-col gap-1 text-sm">
            Cambiar
            <select
              name="cvId"
              defaultValue={offer.cvId ?? ""}
              className="border border-ink/20 bg-white px-3 py-2"
            >
              <option value="">Ninguno</option>
              {cvs.map((cv) => (
                <option key={cv.id} value={cv.id}>
                  {cv.title}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="underline decoration-ink/30 underline-offset-4"
          >
            Enlazar
          </button>
        </form>
      </section>
    </main>
  );
}
