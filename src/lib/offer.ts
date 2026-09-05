export const OFFER_STATUSES = [
  "interested",
  "applied",
  "interview",
  "offer",
  "rejected",
] as const;

export type OfferStatus = (typeof OFFER_STATUSES)[number];

export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  interested: "Interesado",
  applied: "Inscrito",
  interview: "Entrevista",
  offer: "Oferta",
  rejected: "Descartado",
};

const TRANSITIONS: Record<OfferStatus, OfferStatus[]> = {
  interested: ["applied", "rejected"],
  applied: ["interview", "rejected"],
  interview: ["offer", "rejected"],
  offer: ["rejected"],
  rejected: ["interested"],
};

export function isOfferStatus(value: unknown): value is OfferStatus {
  return (
    typeof value === "string" &&
    (OFFER_STATUSES as readonly string[]).includes(value)
  );
}

export function nextStatuses(from: OfferStatus): OfferStatus[] {
  return TRANSITIONS[from];
}

export function canTransition(from: OfferStatus, to: OfferStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export type OfferInput = {
  title: string;
  company: string;
  description: string;
  url: string | null;
  cvId: string | null;
};

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseOfferInput(formData: FormData): OfferInput | null {
  const title = clip(formData.get("title"), 160);
  const company = clip(formData.get("company"), 160);
  const description = clip(formData.get("description"), 20_000);
  if (!title || !company || !description) {
    return null;
  }

  const urlRaw = String(formData.get("url") ?? "").trim();
  let url: string | null = null;
  if (urlRaw) {
    if (!/^https?:\/\/\S+$/i.test(urlRaw) || urlRaw.length > 500) {
      return null;
    }
    url = urlRaw;
  }

  const cvRaw = String(formData.get("cvId") ?? "").trim();
  let cvId: string | null = null;
  if (cvRaw) {
    if (!UUID.test(cvRaw)) {
      return null;
    }
    cvId = cvRaw;
  }

  return { title, company, description, url, cvId };
}

function clip(value: unknown, max: number): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, max);
}
