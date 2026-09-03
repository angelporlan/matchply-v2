import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { destroySession, requireAuth } from "@/lib/auth";
import { logout } from "@/lib/auth-actions";

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

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-ink/60">
        Fase 2 · Identidad
      </p>
      <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-lg leading-relaxed text-ink/80">
        Sesión de <span className="font-medium text-ink">{user.email}</span>.
      </p>
      <form action={logout}>
        <button
          type="submit"
          className="underline decoration-ink/30 underline-offset-4"
        >
          Cerrar sesión
        </button>
      </form>
    </main>
  );
}
