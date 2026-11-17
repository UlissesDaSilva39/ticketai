export interface ProfileFields {
  name?: string | null;
  role?: string | null;
  location?: string | null;
  bio?: string | null;
  avatar?: string | null;
  genres?: string[] | null;
  socials?: any;
  latestTrack?: string | null;
  epk?: string | null;
}

export interface FieldHint {
  key: string;
  label: string;
  weight: number;
  anchor: string;
  hint: string;
}

export interface CompletenessResult {
  percent: number;
  earned: number;
  total: number;
  missing: FieldHint[];
  nextStep: FieldHint | null;
  visible: boolean;
}

const FIELD_DEFINITIONS: FieldHint[] = [
  { key: "role", label: "Add your role", weight: 15, anchor: "/me/edit#role", hint: "Tell people what you do" },
  { key: "location", label: "Add your location", weight: 10, anchor: "/me/edit#location", hint: "For matching by city" },
  { key: "bio", label: "Write a short bio", weight: 20, anchor: "/me/edit#bio", hint: "40+ characters is enough" },
  { key: "avatar", label: "Upload a photo", weight: 15, anchor: "/me/edit#avatar", hint: "Profiles with photos get more messages" },
  { key: "genres", label: "Pick your genres", weight: 15, anchor: "/me/edit#genres", hint: "Genres power Matched For You" },
  { key: "socials", label: "Link a social", weight: 15, anchor: "/me/edit#socials", hint: "Spotify, SoundCloud, Instagram" },
  { key: "latestTrack", label: "Add your latest track", weight: 5, anchor: "/me/edit#track", hint: "Let people hear your sound" },
  { key: "epk", label: "Upload your EPK", weight: 5, anchor: "/me/edit#epk", hint: "Promoters look for this first" },
];

const TOTAL_WEIGHT = FIELD_DEFINITIONS.reduce((sum, f) => sum + f.weight, 0);

function hasValue(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.values(value).some(hasValue);
  return Boolean(value);
}

function fieldIsComplete(field: FieldHint, profile: ProfileFields): boolean {
  if (field.key === "bio") {
    return typeof profile.bio === "string" && profile.bio.trim().length >= 40;
  }
  return hasValue((profile as any)[field.key]);
}

export function computeCompleteness(profile: ProfileFields | null | undefined): CompletenessResult {
  if (!profile) {
    return {
      percent: 0,
      earned: 0,
      total: TOTAL_WEIGHT,
      missing: FIELD_DEFINITIONS,
      nextStep: FIELD_DEFINITIONS[0],
      visible: false,
    };
  }

  const hasName = typeof profile.name === "string" && profile.name.trim().length > 0;
  let earned = 0;
  const missing: FieldHint[] = [];

  for (const field of FIELD_DEFINITIONS) {
    if (fieldIsComplete(field, profile)) {
      earned += field.weight;
    } else {
      missing.push(field);
    }
  }

  missing.sort((a, b) => b.weight - a.weight);
  const percent = Math.round((earned / TOTAL_WEIGHT) * 100);
  const visible = hasName && percent >= 20;

  return {
    percent,
    earned,
    total: TOTAL_WEIGHT,
    missing,
    nextStep: missing.length > 0 ? missing[0] : null,
    visible,
  };
}