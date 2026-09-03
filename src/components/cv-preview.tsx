import type { ReactNode } from "react";
import type { CvData } from "@/lib/cv";

export function CvPreview({ title, data }: { title: string; data: CvData }) {
  const { profile, experience, education, skills } = data;

  return (
    <article className="border border-ink/15 bg-white px-5 py-6">
      <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Preview</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">
        {profile.fullName || title || "Sin nombre"}
      </h2>
      {profile.headline ? (
        <p className="mt-1 text-ink/70">{profile.headline}</p>
      ) : null}
      <p className="mt-2 text-sm text-ink/60">
        {[profile.email, profile.phone, profile.location]
          .filter(Boolean)
          .join(" · ")}
      </p>
      {profile.summary ? (
        <p className="mt-4 text-sm leading-relaxed text-ink/80">{profile.summary}</p>
      ) : null}

      <Section title="Experiencia">
        {experience.length === 0 ? (
          <Empty />
        ) : (
          experience.map((item) => (
            <div key={item.id} className="mb-4 last:mb-0">
              <p className="font-medium">
                {item.role || "Puesto"} · {item.company || "Empresa"}
              </p>
              <p className="text-xs text-ink/50">
                {[item.start, item.end || "actual"].filter(Boolean).join(" — ")}
              </p>
              {item.bullets.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-ink/80">
                  {item.bullets.map((bullet, index) => (
                    <li key={`${item.id}-${index}`}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))
        )}
      </Section>

      <Section title="Educación">
        {education.length === 0 ? (
          <Empty />
        ) : (
          education.map((item) => (
            <p key={item.id} className="mb-2 text-sm last:mb-0">
              <span className="font-medium">{item.degree || "Estudios"}</span>
              {item.school ? ` · ${item.school}` : ""}
              {item.year ? ` · ${item.year}` : ""}
            </p>
          ))
        )}
      </Section>

      <Section title="Skills">
        {skills.length === 0 ? (
          <Empty />
        ) : (
          <p className="text-sm text-ink/80">{skills.join(" · ")}</p>
        )}
      </Section>
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-6">
      <h3 className="text-xs uppercase tracking-[0.2em] text-ink/50">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

function Empty() {
  return <p className="text-sm text-ink/40">Sin datos en esta sección.</p>;
}
