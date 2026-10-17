"use client";

import { useState } from "react";
import { CvPreview } from "@/components/cv-preview";
import { CvSectionFields } from "@/components/cv-section-fields";
import { RewriteButton } from "@/components/rewrite-button";
import { updateCv } from "@/lib/cv-actions";
import type { CvData } from "@/lib/cv";

type OfferOption = { id: string; title: string; company: string };

type CvEditorProps = {
  cvId: string;
  title: string;
  data: CvData;
  message?: string | null;
  offers: OfferOption[];
};

export function CvEditor({
  cvId,
  title: initialTitle,
  data,
  message,
  offers,
}: CvEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [cv, setCv] = useState(data);
  const [offerId, setOfferId] = useState(offers[0]?.id ?? "");

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <form action={updateCv} className="flex flex-col gap-6">
        <input type="hidden" name="cvId" value={cvId} />
        <input type="hidden" name="data" value={JSON.stringify(cv)} />
        {message ? <p className="text-sm text-ink/80">{message}</p> : null}
        <label className="flex flex-col gap-1 text-sm">
          Título del CV
          <input
            name="title"
            required
            maxLength={80}
            className="border border-ink/20 bg-white px-3 py-2"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <CvSectionFields data={cv} onChange={setCv} />
        <button
          type="submit"
          className="self-start underline decoration-ink/30 underline-offset-4"
        >
          Guardar
        </button>
      </form>
      <div className="flex flex-col gap-6">
        <CvPreview title={title} data={cv} />
        {offers.length > 0 ? (
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-medium">Reescribir sección</h2>
            <label className="flex flex-col gap-1 text-sm">
              Oferta
              <select
                className="border border-ink/20 bg-white px-3 py-2"
                value={offerId}
                onChange={(event) => setOfferId(event.target.value)}
              >
                {offers.map((offer) => (
                  <option key={offer.id} value={offer.id}>
                    {offer.title} · {offer.company}
                  </option>
                ))}
              </select>
            </label>
            {cv.experience.map((item) => (
              <div key={item.id} className="flex flex-col gap-1">
                <p className="text-sm text-ink/70">
                  {item.role || "Puesto"} · {item.company || "Empresa"}
                </p>
                <RewriteButton
                  cvId={cvId}
                  offerId={offerId}
                  experienceId={item.id}
                  onApply={(rewritten) => {
                    const bullets = rewritten
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean);
                    setCv((current) => ({
                      ...current,
                      experience: current.experience.map((row) =>
                        row.id === item.id ? { ...row, bullets } : row,
                      ),
                    }));
                  }}
                />
              </div>
            ))}
            <p className="text-xs text-ink/50">
              La reescritura entra en el editor. Pulsa Guardar para persistir.
            </p>
          </section>
        ) : null}
      </div>
    </div>
  );
}
