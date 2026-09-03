import type { ReactNode } from "react";
import { CvEducationFields } from "@/components/cv-education-fields";
import { CvExperienceFields } from "@/components/cv-experience-fields";
import { CvField, cvInputClass } from "@/components/cv-field";
import type { CvData, CvProfile } from "@/lib/cv";
import { emptyEducation, emptyExperience } from "@/lib/cv";

type Props = {
  data: CvData;
  onChange: (data: CvData) => void;
};

export function CvSectionFields({ data, onChange }: Props) {
  const setProfile = (patch: Partial<CvProfile>) =>
    onChange({ ...data, profile: { ...data.profile, ...patch } });

  return (
    <div className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium">Perfil</legend>
        <CvField
          label="Nombre"
          value={data.profile.fullName}
          onChange={(fullName) => setProfile({ fullName })}
        />
        <CvField
          label="Titular"
          value={data.profile.headline}
          onChange={(headline) => setProfile({ headline })}
        />
        <CvField
          label="Email"
          value={data.profile.email}
          onChange={(email) => setProfile({ email })}
        />
        <CvField
          label="Teléfono"
          value={data.profile.phone}
          onChange={(phone) => setProfile({ phone })}
        />
        <CvField
          label="Ubicación"
          value={data.profile.location}
          onChange={(location) => setProfile({ location })}
        />
        <CvField
          label="Resumen"
          value={data.profile.summary}
          onChange={(summary) => setProfile({ summary })}
          multiline
        />
      </fieldset>

      <ListSection
        title="Experiencia"
        addLabel="Añadir experiencia"
        onAdd={() =>
          onChange({ ...data, experience: [...data.experience, emptyExperience()] })
        }
      >
        {data.experience.map((item, index) => (
          <CvExperienceFields
            key={item.id}
            item={item}
            onChange={(patch) =>
              onChange({
                ...data,
                experience: data.experience.map((row, i) =>
                  i === index ? { ...row, ...patch } : row,
                ),
              })
            }
            onRemove={() =>
              onChange({
                ...data,
                experience: data.experience.filter((_, i) => i !== index),
              })
            }
          />
        ))}
      </ListSection>

      <ListSection
        title="Educación"
        addLabel="Añadir educación"
        onAdd={() =>
          onChange({ ...data, education: [...data.education, emptyEducation()] })
        }
      >
        {data.education.map((item, index) => (
          <CvEducationFields
            key={item.id}
            item={item}
            onChange={(patch) =>
              onChange({
                ...data,
                education: data.education.map((row, i) =>
                  i === index ? { ...row, ...patch } : row,
                ),
              })
            }
            onRemove={() =>
              onChange({
                ...data,
                education: data.education.filter((_, i) => i !== index),
              })
            }
          />
        ))}
      </ListSection>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium">Skills</legend>
        <label className="flex flex-col gap-1 text-sm">
          Una por línea
          <textarea
            rows={5}
            className={cvInputClass}
            value={data.skills.join("\n")}
            onChange={(event) =>
              onChange({ ...data, skills: event.target.value.split("\n") })
            }
          />
        </label>
      </fieldset>
    </div>
  );
}

function ListSection({
  title,
  addLabel,
  onAdd,
  children,
}: {
  title: string;
  addLabel: string;
  onAdd: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="text-sm font-medium">{title}</legend>
      {children}
      <button
        type="button"
        onClick={onAdd}
        className="self-start text-sm underline decoration-ink/30 underline-offset-4"
      >
        {addLabel}
      </button>
    </fieldset>
  );
}
