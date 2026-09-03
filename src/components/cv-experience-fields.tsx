import { CvField, cvInputClass } from "@/components/cv-field";
import type { CvExperience } from "@/lib/cv";

export function CvExperienceFields({
  item,
  onChange,
  onRemove,
}: {
  item: CvExperience;
  onChange: (patch: Partial<CvExperience>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 border border-ink/10 p-3">
      <CvField label="Puesto" value={item.role} onChange={(role) => onChange({ role })} />
      <CvField
        label="Empresa"
        value={item.company}
        onChange={(company) => onChange({ company })}
      />
      <div className="grid grid-cols-2 gap-3">
        <CvField
          label="Inicio"
          value={item.start}
          onChange={(start) => onChange({ start })}
        />
        <CvField label="Fin" value={item.end} onChange={(end) => onChange({ end })} />
      </div>
      <label className="flex flex-col gap-1 text-sm">
        Logros (uno por línea)
        <textarea
          rows={4}
          className={cvInputClass}
          value={item.bullets.join("\n")}
          onChange={(event) => onChange({ bullets: event.target.value.split("\n") })}
        />
      </label>
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
