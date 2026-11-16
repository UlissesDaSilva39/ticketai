export interface LicensingContact {
  id: string;
  name: string;
  role: string;
  email?: string;
  url: string;
  description: string;
}

export const LICENSING_CONTACTS: LicensingContact[] = [
  {
    id: "prs",
    name: "PRS for Music",
    role: "Composition rights",
    email: "applications@prsformusic.com",
    url: "https://www.prsformusic.com",
    description: "Licences the use of musical works and represents songwriters, composers and publishers. Ask about the Digital Music Services Licence for interactive streaming in the UK.",
  },
  {
    id: "ppl",
    name: "PPL",
    role: "Recorded music rights",
    email: "licensing@ppluk.com",
    url: "https://www.ppluk.com",
    description: "Represents recording rightsholders and performers. PPL does not typically license direct-to-consumer on-demand services - for those, contact recording owners directly.",
  },
  {
    id: "mcps",
    name: "MCPS",
    role: "Mechanical rights",
    url: "https://www.prsformusic.com/mcps",
    description: "Administers mechanical rights in musical works, including certain digital uses. Ask PRS which MCPS repertoire and permissions are included in the proposed digital service agreement.",
  },
  {
    id: "labels",
    name: "Record labels",
    role: "Master recording rights",
    url: "https://www.sonymusic.com",
    description: "Essential for full tracks. Negotiate direct agreements for on-demand streaming, including catalogues owned by independent labels, major labels and artists who own their masters.",
  },
];

export interface LicenceRequirement {
  feature: string;
  permissions: string;
}

export const LICENCE_REQUIREMENTS: LicenceRequirement[] = [
  { feature: "30-60 second previews", permissions: "Master-owner permission and composition rights" },
  { feature: "Full-track streaming", permissions: "Direct master licence + composition/mechanical permissions" },
  { feature: "On-demand playlists", permissions: "Same as full-track streaming" },
  { feature: "User-uploaded music", permissions: "Upload agreement, ownership verification and appropriate rights" },
  { feature: "Music videos", permissions: "Master, composition and audiovisual/synchronisation permissions" },
  { feature: "Live music streaming", permissions: "Recording, composition, performance and broadcast/streaming permissions" },
];

export interface ProgrammeStep {
  step: number;
  title: string;
  description: string;
}

export const PROGRAMME_STEPS: ProgrammeStep[] = [
  { step: 1, title: "Recruit independent artists", description: "Who own or control their recordings." },
  { step: 2, title: "Offer a non-exclusive digital streaming licence", description: "Subject to agreed terms and territory." },
  { step: 3, title: "Obtain composition permissions", description: "From songwriters and publishers, or confirm applicable collecting-society coverage." },
  { step: 4, title: "Collect track metadata", description: "ISRCs, ownership information and contributor splits." },
  { step: 5, title: "Make approved previews and full tracks available", description: "Through GRID Billboard and GRID Music." },
  { step: 6, title: "Report usage and calculate royalties", description: "Transparently, per track, per territory." },
];

export const PRS_DIGITAL_LICENCE = {
  name: "PRS Digital Music Services Licence",
  eligibility: "UK-only digital music services with annual revenue up to £500,000.",
  coverage: "Covers relevant PRS and MCPS repertoire for interactive streaming and downloads.",
  limitation: "Does not automatically clear the master recordings.",
};