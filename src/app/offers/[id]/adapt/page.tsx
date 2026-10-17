import Link from "next/link";
import { notFound } from "next/navigation";
import { CvPreview } from "@/components/cv-preview";
import { getOwnedCv } from "@/db/cvs";
import { getOwnedOffer } from "@/db/offers";
import { requireAuth } from "@/lib/auth";
import { parseCv, parseStoredCv } from "@/lib/cv";
import { applyProposal } from "@/lib/optimize-actions";

export default async function AdaptPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await requireAuth();
  const offer = await getOwnedOffer(params.id, userId);
  if (!offer?.cvId || !offer.proposal) {
    notFound();
  }
  const baseRow = await getOwnedCv(offer.cvId, userId);
  if (!baseRow) {
    notFound();
  }
  const base = parseStoredCv(baseRow.data);
  const proposal = parseCv(offer.proposal);
  if (!proposal) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-ink/60">Matchply</p>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">
          CV adaptado · {offer.company}
        </h1>
        <Link
          href={`/offers/${offer.id}`}
          className="text-sm underline decoration-ink/30 underline-offset-4"
        >
          Oferta
        </Link>
      </div>
      <p className="text-ink/80">
        El modelo propone. Tú eliges qué secciones se copian a un CV nuevo. El
        CV base no se pisa.
      </p>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-sm uppercase tracking-wide text-ink/50">Antes</h2>
          <CvPreview title={baseRow.title} data={base} />
        </div>
        <div>
          <h2 className="text-sm uppercase tracking-wide text-ink/50">Después</h2>
          <CvPreview title={`Propuesta · ${offer.company}`} data={proposal} />
        </div>
      </div>
      <form action={applyProposal} className="flex flex-col gap-3">
        <input type="hidden" name="offerId" value={offer.id} />
        <label className="flex gap-2 text-sm">
          <input type="checkbox" name="profile" defaultChecked /> Perfil
        </label>
        <label className="flex gap-2 text-sm">
          <input type="checkbox" name="experience" defaultChecked /> Experiencia
        </label>
        <label className="flex gap-2 text-sm">
          <input type="checkbox" name="education" defaultChecked /> Educación
        </label>
        <label className="flex gap-2 text-sm">
          <input type="checkbox" name="skills" defaultChecked /> Skills
        </label>
        <button
          type="submit"
          className="self-start underline decoration-ink/30 underline-offset-4"
        >
          Guardar como CV nuevo
        </button>
      </form>
    </main>
  );
}
