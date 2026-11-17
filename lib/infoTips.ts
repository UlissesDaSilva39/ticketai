// Central copy for tooltips. Edit wording here, not in components.
// Each entry: label is the aria-label / question, body is the explanation.

export const INFO_TIPS = {
  splits: {
    label: "What are splits?",
    body: "How royalties are divided between collaborators on a track.",
  },
  splitSheet: {
    label: "What is a split sheet?",
    body: "A written agreement showing each collaborator's percentage share.",
  },
  verified: {
    label: "What does the verified badge mean?",
    body: "Confirms email ownership only. It is not an identity check or an endorsement by GRID.",
  },
  forBusiness: {
    label: "What is For Business?",
    body: "Post roles and find music industry talent.",
  },
  notifications: {
    label: "What are notifications?",
    body: "Platform updates and activity alerts. Direct conversations live in Messages.",
  },
  claimProfile: {
    label: "What does claiming a profile do?",
    body: "Proves the profile is yours so you can edit it and respond to enquiries.",
  },
} as const;

export type InfoTipKey = keyof typeof INFO_TIPS;
