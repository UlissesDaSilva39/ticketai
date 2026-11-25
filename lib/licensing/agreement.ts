// GRID Standard Music Licence: shared by the deal page (preview), the server
// (frozen copy + SHA-256 stored on the deal) and the licence certificate.
// No server-only imports here so it can run in the browser too.
//
// IMPORTANT: this is a working template, not legal advice. Have a UK media
// solicitor review it before taking real payments, then bump AGREEMENT_VERSION
// whenever the wording changes (old deals keep the text they accepted).

export const AGREEMENT_VERSION = "GRID-SML-1.0";

export const LICENCE_TYPES = ["creator", "commercial", "sync"] as const;
export type LicenceType = (typeof LICENCE_TYPES)[number];
export const isLicenceType = (v: unknown): v is LicenceType =>
  typeof v === "string" && (LICENCE_TYPES as readonly string[]).includes(v);

export const GRID_FEE_RATE = 0.1;
export const gridFeeFor = (pence: number) => Math.round(pence * GRID_FEE_RATE);
export const formatGbp = (pence: number) => `£${(pence / 100).toFixed(2)}`;

type LicenceInfo = {
  name: string;
  short: string;
  examples: string;
  media: string;
  term: string;
  excluded: string;
};

export const LICENCE_INFO: Record<LicenceType, LicenceInfo> = {
  creator: {
    name: "Creator Licence",
    short: "One online video, podcast or stream, monetised.",
    examples: "YouTube, TikTok, Instagram, Twitch, podcasts",
    media: "online video and audio platforms and social media, including monetised channels",
    term: "perpetual for the Project",
    excluded: "paid advertising, broadcast television, radio, cinema, video games and physical products",
  },
  commercial: {
    name: "Commercial Licence",
    short: "One brand or advertising campaign, 12 months.",
    examples: "Brand videos, paid social ads, in-store, events, corporate",
    media:
      "online and social media (including paid placements), websites, in-store and event playback, and corporate presentations",
    term: "12 months from the Effective Date for paid placements; organic posts published during that period may stay online",
    excluded: "broadcast television, cinema, video games and physical products",
  },
  sync: {
    name: "Sync Licence",
    short: "One film, TV, game or documentary, all media.",
    examples: "Films, TV episodes, documentaries, games, trailers for them",
    media: "all media now known or later devised, including trailers and promotion of the Project",
    term: "perpetual for the Project",
    excluded: "use outside the Project and its own promotion",
  },
};

export type AgreementInput = {
  licenceType: LicenceType;
  trackTitle: string;
  artistName: string;
  isrc: string | null;
  composer: string;
  publisher: string | null;
  licensorName: string;
  licenseeName: string;
  projectTitle: string;
  licenceFeePence: number;
  effectiveDate: string; // YYYY-MM-DD
};

/** The full agreement text. Plain text so it can be hashed and stored exactly. */
export function buildAgreement(a: AgreementInput): string {
  const t = LICENCE_INFO[a.licenceType];
  const fee = formatGbp(a.licenceFeePence);
  const gridFee = formatGbp(gridFeeFor(a.licenceFeePence));
  const total = formatGbp(a.licenceFeePence + gridFeeFor(a.licenceFeePence));
  const work = `"${a.trackTitle}" by ${a.artistName}${a.isrc ? ` (ISRC ${a.isrc})` : ""}`;

  return `GRID STANDARD MUSIC LICENCE (${AGREEMENT_VERSION})
${t.name}

Effective Date: ${a.effectiveDate}

1. PARTIES
1.1 Licensor: ${a.licensorName}, the GRID member who listed the Track ("Licensor").
1.2 Licensee: ${a.licenseeName} ("Licensee").
1.3 GRID Music Ltd ("GRID") runs the platform and collects payment on the Licensor's behalf. GRID is not the owner of the Track and is not a party to the licence granted in clause 3.

2. THE TRACK AND THE PROJECT
2.1 Track: ${work}, including the sound recording (master) and the underlying musical work. Composer(s): ${a.composer}.${a.publisher ? ` Publisher: ${a.publisher}.` : ""}
2.2 Project: "${a.projectTitle}". The licence covers this one Project only.

3. LICENCE
3.1 In return for the Licence Fee, the Licensor grants the Licensee a non-exclusive, non-transferable, worldwide licence to reproduce and synchronise the Track in the Project and to make the Project available in: ${t.media}.
3.2 Term: ${t.term}.
3.3 Not included: ${t.excluded}. Any other use needs a separate licence.
3.4 The Licensee may edit, loop, fade and shorten the Track to fit the Project, but may not remix it, add vocals, or change its character.
3.5 The Licensee may not: (a) release, sell or stream the Track on its own or as the main feature of the Project; (b) register the Track or the Project's audio with any content identification system (such as YouTube Content ID); (c) sub-license the Track, except to distributors and platforms showing the Project as a whole; (d) use the Track in content that is unlawful, defamatory, hateful, or sexually explicit, or in political campaigning.

4. FEES AND PAYMENT
4.1 Licence Fee: ${fee}, paid to the Licensor through GRID.
4.2 GRID service fee: ${gridFee}, charged by GRID to the Licensee. Total paid by the Licensee: ${total}.
4.3 The licence starts only once payment has cleared. If the payment is refunded or charged back, the licence ends immediately and the Licensee must stop new uses of the Track.

5. CREDIT
5.1 Where reasonably practicable, the Licensee will credit: Music: "${a.trackTitle}" by ${a.artistName} (licensed via GRID).

6. PERFORMANCE ROYALTIES
6.1 This licence does not affect public performance and broadcast royalties collected by collecting societies (such as PRS for Music and PPL). Where the Project is broadcast or publicly performed, the broadcaster or venue remains responsible for its own collecting-society licences, and the Licensee will provide cue-sheet information on request.

7. LICENSOR PROMISES
7.1 The Licensor confirms that it owns or controls 100% of the rights in the sound recording and the musical work needed to grant this licence (or has written authority from every co-owner, publisher and performer), and that the Licensee's use as permitted here will not infringe anyone's rights.
7.2 The Licensor will promptly release any content identification claim made against the Project for the Track.
7.3 The Licensor will indemnify the Licensee against third-party claims caused by a breach of clause 7.1.

8. LIABILITY
8.1 Except for the indemnity in clause 7.3, fraud, or liability that cannot be limited by law, each party's total liability under this licence is limited to the Licence Fee.
8.2 GRID's liability is limited to its service fee, and GRID gives no promise about the Track or the Project.

9. ENDING THE LICENCE
9.1 Either party may end this licence if the other materially breaches it and does not fix the breach within 14 days of written notice. Copies of the Project already lawfully distributed before the end date are not affected, except where the licence ends under clause 4.3.

10. GENERAL
10.1 This document is the whole agreement between the Licensor and the Licensee about the Track for the Project.
10.2 The Licensee accepts this licence electronically by ticking the agreement box, typing its full legal name and paying. Both parties agree that this has the same effect as a signature.
10.3 This licence is governed by the law of England and Wales, and the courts of England and Wales have exclusive jurisdiction.
`;
}

/** SHA-256 of the agreement text, hex. Works in the browser and in Node 18+. */
export async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export const todayUtc = () => new Date().toISOString().slice(0, 10);

export type ListingPrices = { creator: number | null; commercial: number | null; sync: number | null };
export const priceFor = (prices: ListingPrices, t: LicenceType) => prices[t];
