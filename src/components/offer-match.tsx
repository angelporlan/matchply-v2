import { runMatch } from "@/lib/match-actions";
import { runOptimize } from "@/lib/optimize-actions";

export function OfferMatch({
  offerId,
  hasCv,
  score,
  gaps,
  evidence,
  hasProposal,
}: {
  offerId: string;
  hasCv: boolean;
  score: number | null;
  gaps: string[];
  evidence: string[];
  hasProposal: boolean;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium">Match</h2>
      {!hasCv ? (
        <p className="text-sm text-ink/60">Enlaza un CV para medir el encaje.</p>
      ) : (
        <>
          {score !== null ? (
            <div className="flex flex-col gap-2 text-sm">
              <p>
                Score validado: <span className="font-medium">{score}/100</span>
              </p>
              {evidence.length > 0 ? (
                <div>
                  <p className="text-ink/50">Evidencias</p>
                  <ul className="list-disc pl-4">
                    {evidence.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {gaps.length > 0 ? (
                <div>
                  <p className="text-ink/50">Lagunas</p>
                  <ul className="list-disc pl-4">
                    {gaps.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-4">
            <form action={runMatch}>
              <input type="hidden" name="offerId" value={offerId} />
              <button
                type="submit"
                className="underline decoration-ink/30 underline-offset-4"
              >
                Medir encaje
              </button>
            </form>
            <form action={runOptimize}>
              <input type="hidden" name="offerId" value={offerId} />
              <button
                type="submit"
                className="underline decoration-ink/30 underline-offset-4"
              >
                Adaptar CV
              </button>
            </form>
            {hasProposal ? (
              <a
                href={`/offers/${offerId}/adapt`}
                className="underline decoration-ink/30 underline-offset-4"
              >
                Ver propuesta
              </a>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}
