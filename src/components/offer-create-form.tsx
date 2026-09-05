import { createOffer } from "@/lib/offer-actions";

const inputClass = "border border-ink/20 bg-white px-3 py-2";

type CvOption = { id: string; title: string; isActive: boolean };

export function OfferCreateForm({ cvs }: { cvs: CvOption[] }) {
  const activeId = cvs.find((cv) => cv.isActive)?.id ?? "";

  return (
    <form action={createOffer} className="flex max-w-xl flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Título
        <input name="title" required maxLength={160} className={inputClass} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Empresa
        <input name="company" required maxLength={160} className={inputClass} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Descripción
        <textarea
          name="description"
          required
          rows={6}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        URL (opcional)
        <input name="url" type="url" className={inputClass} />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        CV enlazado
        <select name="cvId" defaultValue={activeId} className={inputClass}>
          <option value="">Ninguno</option>
          {cvs.map((cv) => (
            <option key={cv.id} value={cv.id}>
              {cv.title}
              {cv.isActive ? " (activo)" : ""}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="self-start underline decoration-ink/30 underline-offset-4"
      >
        Guardar oferta
      </button>
    </form>
  );
}
