import { CvField } from "@/components/cv-field";
import type { CvEducation } from "@/lib/cv";

export function CvEducationFields({
  item,
  onChange,
  onRemove,
}: {
  item: CvEducation;
  onChange: (patch: Partial<CvEducation>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 border border-ink/10 p-3">
      <CvField
        label="Título"
        value={item.degree}
        onChange={(degree) => onChange({ degree })}
      />
      <CvField
        label="Centro"
        value={item.school}
        onChange={(school) => onChange({ school })}
      />
      <CvField label="Año" value={item.year} onChange={(year) => onChange({ year })} />
      <button
        type="button"
        onClick={onRemove}
        className="self-start text-sm text-ink/60 underline decoration-ink/30 underline-offset-4"
      >
        Quitar
      </button>
    </div>
  );
}
