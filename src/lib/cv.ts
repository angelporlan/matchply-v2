export type CvProfile = {
  fullName: string;
  headline: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
};

export type CvExperience = {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  bullets: string[];
};

export type CvEducation = {
  id: string;
  school: string;
  degree: string;
  year: string;
};

export type CvData = {
  profile: CvProfile;
  experience: CvExperience[];
  education: CvEducation[];
  skills: string[];
};

export function emptyCv(): CvData {
  return {
    profile: {
      fullName: "",
      headline: "",
      summary: "",
      email: "",
      phone: "",
      location: "",
    },
    experience: [],
    education: [],
    skills: [],
  };
}

export function emptyExperience(): CvExperience {
  return {
    id: crypto.randomUUID(),
    company: "",
    role: "",
    start: "",
    end: "",
    bullets: [],
  };
}

export function emptyEducation(): CvEducation {
  return {
    id: crypto.randomUUID(),
    school: "",
    degree: "",
    year: "",
  };
}

export function parseTitle(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const title = value.trim();
  if (title.length < 1 || title.length > 80) {
    return null;
  }
  return title;
}

export function parseCv(value: unknown): CvData | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const raw = value as Record<string, unknown>;
  const profileRaw =
    raw.profile && typeof raw.profile === "object"
      ? (raw.profile as Record<string, unknown>)
      : {};

  return {
    profile: {
      fullName: asString(profileRaw.fullName, 120),
      headline: asString(profileRaw.headline, 160),
      summary: asString(profileRaw.summary, 2000),
      email: asString(profileRaw.email, 120),
      phone: asString(profileRaw.phone, 40),
      location: asString(profileRaw.location, 120),
    },
    experience: asArray(raw.experience, 15).map(parseExperience),
    education: asArray(raw.education, 10).map(parseEducation),
    skills: asStringList(raw.skills, 40, 60),
  };
}

export function parseStoredCv(value: unknown): CvData {
  return parseCv(value) ?? emptyCv();
}

function asString(value: unknown, max: number): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, max);
}

function asArray(value: unknown, max: number): unknown[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.slice(0, max);
}

function asStringList(value: unknown, maxItems: number, maxLen: number): string[] {
  return asArray(value, maxItems)
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.slice(0, maxLen));
}

function parseExperience(value: unknown): CvExperience {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    id: parseId(raw.id),
    company: asString(raw.company, 120),
    role: asString(raw.role, 120),
    start: asString(raw.start, 20),
    end: asString(raw.end, 20),
    bullets: asStringList(raw.bullets, 8, 400),
  };
}

function parseEducation(value: unknown): CvEducation {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    id: parseId(raw.id),
    school: asString(raw.school, 120),
    degree: asString(raw.degree, 160),
    year: asString(raw.year, 20),
  };
}

function parseId(value: unknown): string {
  if (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    )
  ) {
    return value;
  }
  return crypto.randomUUID();
}
