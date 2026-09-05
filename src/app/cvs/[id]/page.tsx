import Link from "next/link";
import { notFound } from "next/navigation";
import { CvEditor } from "@/components/cv-editor";
import { getOwnedCv } from "@/db/cvs";
import { requireAuth } from "@/lib/auth";
import { parseStoredCv } from "@/lib/cv";

const MESSAGES: Record<string, string> = {
  saved: "Guardado.",
  invalid: "El CV no es válido. Revisa los campos.",
};

export default async function CvPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { saved?: string; error?: string };
}) {
  const { userId } = await requireAuth();
  const row = await getOwnedCv(params.id, userId);
  if (!row) {
    notFound();
  }

  const message = searchParams.saved
    ? MESSAGES.saved
    : searchParams.error
      ? (MESSAGES[searchParams.error] ?? MESSAGES.invalid)
      : null;

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-ink/60">
        Fase 4 · Ofertas
      </p>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">Editar CV</h1>
        <Link
          href="/dashboard"
          className="text-sm underline decoration-ink/30 underline-offset-4"
        >
          Dashboard
        </Link>
      </div>
      <CvEditor
        cvId={row.id}
        title={row.title}
        data={parseStoredCv(row.data)}
        message={message}
      />
    </main>
  );
}
