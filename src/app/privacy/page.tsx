import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Privacidad</h1>
      <p className="text-ink/80">
        Guardamos tu email, el hash de tu contraseña, tus CVs y ofertas para
        prestar el servicio. La clave de IA y de Stripe viven solo en el
        servidor. No vendemos tus datos.
      </p>
      <p className="text-ink/80">
        Puedes borrar tu cuenta pidiéndolo por email. El pago lo procesa Stripe.
      </p>
      <Link
        href="/"
        className="text-sm underline decoration-ink/30 underline-offset-4"
      >
        Inicio
      </Link>
    </main>
  );
}
