"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import {
  rewriteExperience,
  type RewriteState,
} from "@/lib/rewrite-actions";

export function RewriteButton({
  cvId,
  offerId,
  experienceId,
  onApply,
}: {
  cvId: string;
  offerId: string;
  experienceId: string;
  onApply: (rewritten: string) => void;
}) {
  const [state, action] = useFormState<RewriteState | null, FormData>(
    rewriteExperience,
    null,
  );

  useEffect(() => {
    if (state?.rewritten && state.experienceId === experienceId) {
      onApply(state.rewritten);
    }
  }, [state, experienceId, onApply]);

  return (
    <form action={action} className="flex flex-col gap-1">
      <input type="hidden" name="cvId" value={cvId} />
      <input type="hidden" name="offerId" value={offerId} />
      <input type="hidden" name="experienceId" value={experienceId} />
      <button
        type="submit"
        className="self-start text-sm underline decoration-ink/30 underline-offset-4"
      >
        Reescribir para la oferta
      </button>
      {state?.error && state.experienceId === experienceId ? (
        <p className="text-xs text-ink/60">{state.error}</p>
      ) : null}
    </form>
  );
}
