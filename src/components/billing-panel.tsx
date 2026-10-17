import { startCheckout } from "@/lib/stripe-actions";
import { FREE_RUNS_PER_MONTH } from "@/lib/quota";

export function BillingPanel({
  pro,
  used,
  billing,
  stripeError,
}: {
  pro: boolean;
  used: number;
  billing?: string;
  stripeError?: boolean;
}) {
  return (
    <section className="flex flex-col gap-2 text-sm">
      {billing === "ok" ? (
        <p>Pago enviado. El plan sube cuando llegue el webhook de Stripe.</p>
      ) : null}
      {stripeError ? <p>Stripe no está configurado.</p> : null}
      <h2 className="text-lg font-medium">Cuota</h2>
      <p className="text-ink/70">
        {pro
          ? "Plan pro."
          : `${used}/${FREE_RUNS_PER_MONTH} usos de IA este mes (match, adaptar, reescribir).`}
      </p>
      {pro ? null : (
        <form action={startCheckout}>
          <button
            type="submit"
            className="underline decoration-ink/30 underline-offset-4"
          >
            Pasar a pro
          </button>
        </form>
      )}
    </section>
  );
}
