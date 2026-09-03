"use client";

import { useState } from "react";
import { CvPreview } from "@/components/cv-preview";
import { CvSectionFields } from "@/components/cv-section-fields";
import { updateCv } from "@/lib/cv-actions";
import type { CvData } from "@/lib/cv";

type CvEditorProps = {
  cvId: string;
  title: string;
  data: CvData;
  message?: string | null;
};

export function CvEditor({ cvId, title: initialTitle, data, message }: CvEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [cv, setCv] = useState(data);

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
      <CvPreview title={title} data={cv} />
    </div>
  );
}
