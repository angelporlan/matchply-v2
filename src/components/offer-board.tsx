import Link from "next/link";
import { OfferStatusButtons } from "@/components/offer-status-buttons";
import {
  OFFER_STATUSES,
  OFFER_STATUS_LABELS,
  type OfferStatus,
} from "@/lib/offer";

type OfferCard = {
  id: string;
  title: string;
  company: string;
  status: OfferStatus;
};

export function OfferBoard({ offers }: { offers: OfferCard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      {OFFER_STATUSES.map((status) => {
        const column = offers.filter((offer) => offer.status === status);
        return (
          <section key={status} className="flex flex-col gap-3">
            <h2 className="text-xs uppercase tracking-[0.2em] text-ink/50">
              {OFFER_STATUS_LABELS[status]}
              <span className="ml-1 text-ink/30">{column.length}</span>
            </h2>
            {column.length === 0 ? (
              <p className="text-sm text-ink/40">Vacío</p>
            ) : (
              column.map((offer) => (
                <article
                  key={offer.id}
                  className="flex flex-col gap-2 border border-ink/10 px-3 py-3"
                >
                  <Link
                    href={`/offers/${offer.id}`}
                    className="font-medium underline decoration-ink/30 underline-offset-4"
                  >
                    {offer.title}
                  </Link>
                  <p className="text-sm text-ink/60">{offer.company}</p>
                  <OfferStatusButtons offerId={offer.id} status={offer.status} />
                </article>
              ))
            )}
          </section>
        );
      })}
    </div>
  );
}
