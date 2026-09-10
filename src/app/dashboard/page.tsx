import Link from "next/link";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { listCvs } from "@/db/cvs";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { destroySession, requireAuth } from "@/lib/auth";
import { logout } from "@/lib/auth-actions";
import { createCv, setActiveCv } from "@/lib/cv-actions";

export default async function DashboardPage() {
  const { userId } = await requireAuth();
  const [user] = await getDb()
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    await destroySession();
    redirect("/login");
  }

  const cvList = await listCvs(userId);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-ink/60">
        Fase 5 · Motor IA
      </p>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
        <p className="flex flex-wrap gap-x-4 text-sm text-ink/60">
          <span>{user.email}</span>
          <Link
            className="underline decoration-ink/30 underline-offset-4"
            href="/offers"
          >
            Ofertas
          </Link>
          <Link
            className="underline decoration-ink/30 underline-offset-4"
            href="/ai"
          >
            Tubo IA
          </Link>
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Tus CVs</h2>
        {cvList.length === 0 ? (
          <p className="text-ink/70">Aún no hay ningún CV. Crea el primero.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {cvList.map((cv) => (
              <li
                key={cv.id}
                className="flex flex-wrap items-center justify-between gap-3 border border-ink/10 px-3 py-3"
              >
                <div>
                  <Link
                    href={`/cvs/${cv.id}`}
                    className="font-medium underline decoration-ink/30 underline-offset-4"
                  >
                    {cv.title}
                  </Link>
                  {cv.isActive ? (
                    <span className="ml-2 text-xs uppercase tracking-wide text-ink/50">
                      Activo
                    </span>
                  ) : null}
                </div>
                {cv.isActive ? null : (
                  <form action={setActiveCv}>
                    <input type="hidden" name="cvId" value={cv.id} />
                    <button
                      type="submit"
                      className="text-sm underline decoration-ink/30 underline-offset-4"
                    >
                      Activar
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
        <form action={createCv} className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm">
            Título
            <input
              name="title"
              defaultValue="CV"
              required
              maxLength={80}
              className="border border-ink/20 bg-white px-3 py-2"
            />
          </label>
          <button
            type="submit"
            className="underline decoration-ink/30 underline-offset-4"
          >
            Crear CV
          </button>
        </form>
      </section>

      <form action={logout}>
        <button
          type="submit"
          className="text-sm underline decoration-ink/30 underline-offset-4"
        >
          Cerrar sesión
        </button>
      </form>
    </main>
  );
}
