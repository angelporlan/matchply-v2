import { updateOfferStatus } from "@/lib/offer-actions";
import {
  nextStatuses,
  OFFER_STATUS_LABELS,
  type OfferStatus,
} from "@/lib/offer";

export function OfferStatusButtons({
  offerId,
  status,
}: {
  offerId: string;
  status: OfferStatus;
}) {
  const next = nextStatuses(status);
  if (next.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {next.map((value) => (
        <form action={updateOfferStatus} key={value}>
          <input type="hidden" name="offerId" value={offerId} />
          <input type="hidden" name="status" value={value} />
          <button
            type="submit"
            className="text-sm underline decoration-ink/30 underline-offset-4"
          >
            {OFFER_STATUS_LABELS[value]}
          </button>
        </form>
      ))}
    </div>
  );
}
