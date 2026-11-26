// Content for "Remi", GRID's in-app guide (components/guide/GuideAssistant.tsx).
// Keep answers accurate: only describe features that exist, and update this
// file when a feature changes.

export type GuideLink = { label: string; href: string };
export type GuideAnswer = { id: string; question: string; answer: string; links: GuideLink[] };
export type TourStep = { title: string; body: string; href: string; tip?: string };

export const GUIDE_NAME = "Remi";

export const WELCOME =
  "Hi, I'm Remi, your GRID guide. GRID is where artists, producers, venues and the music industry meet: build your profile, find collabs and gigs, sell and license your music, and get paid. What would you like to know?";

export const QUESTIONS: GuideAnswer[] = [
  {
    id: "what",
    question: "What can I do on GRID?",
    answer:
      "Build a profile and EPK, connect with other music people, find collabs and gigs, message anyone, sell beats and services, license your tracks, prepare releases, and track your earnings, all in one place.",
    links: [
      { label: "Take the tour", href: "#tour" },
      { label: "My EPK", href: "/epk" },
    ],
  },
  {
    id: "booked",
    question: "How do I get booked?",
    answer:
      "Complete your profile and EPK so people can hear and book you. Then browse Jobs for open collabs and gigs and apply. Your home feed also shows matches based on your genre, role and city.",
    links: [
      { label: "Browse jobs", href: "/jobs" },
      { label: "Edit my EPK", href: "/epk" },
    ],
  },
  {
    id: "paid",
    question: "How do I get paid?",
    answer:
      "Sell beats, sample packs, services or merch in the Marketplace, or license your tracks. Earnings go into your seller balance, clear after a 7-day hold, and can then be withdrawn from your seller dashboard.",
    links: [
      { label: "Seller dashboard", href: "/seller" },
      { label: "Marketplace", href: "/marketplace" },
    ],
  },
  {
    id: "license",
    question: "How do I license my music?",
    answer:
      "List a track in Licensing and set prices for Creator, Commercial or Sync use. Buyers sign the GRID Standard Music Licence and pay by card. You keep ownership and 100% of your licence fee.",
    links: [
      { label: "License my tracks", href: "/licensing?tab=sell" },
      { label: "Find music", href: "/licensing" },
    ],
  },
  {
    id: "release",
    question: "Can I release music on Spotify?",
    answer:
      "Distribution is in early access. You can build your release now (cover art, tracks, credits, release date) and pass GRID's store checks. Delivery to stores is coming soon, and we'll email you when it opens.",
    links: [{ label: "Start a release", href: "/distribution" }],
  },
  {
    id: "pro",
    question: "What does GRID Pro add?",
    answer:
      "Free members can start 5 new conversations a week; Pro raises that to 30, and Premium is unlimited. Pro also gives you priority in matches and more tools for growing your career. See the plans for full details.",
    links: [{ label: "See plans", href: "/pro" }],
  },
];

export const TOUR: TourStep[] = [
  {
    title: "Your profile & EPK",
    body: "Your EPK (electronic press kit) is your music CV: photos, tracks, bio, rider and booking button, all on one link.",
    href: "/epk",
    tip: "Profiles with a photo and tracks get far more replies.",
  },
  {
    title: "Network",
    body: "Connect with vocalists, producers, DJs, venues and industry. See invitations, suggestions and who viewed your profile.",
    href: "/network",
  },
  {
    title: "Jobs & collabs",
    body: "Open gigs, sessions and collabs posted by other members. Apply in a click, or post your own.",
    href: "/jobs",
  },
  {
    title: "Messages",
    body: "Chat with anyone on GRID, share tracks and agree details. Replying is always unlimited.",
    href: "/messages",
  },
  {
    title: "Marketplace",
    body: "Buy and sell beats, sample packs, services and merch. Buyers pay by card, and downloads unlock instantly.",
    href: "/marketplace",
  },
  {
    title: "Licensing",
    body: "Find cleared music for your projects, or list your tracks for Creator, Commercial and Sync licences with a signed agreement.",
    href: "/licensing",
  },
  {
    title: "Release builder",
    body: "Prepare your next release: cover art, tracks, credits and release date, checked against common store rules.",
    href: "/distribution",
    tip: "Early access: delivery to stores is coming soon.",
  },
  {
    title: "Split sheets",
    body: "Agree who owns what on a track before it's released, so royalties are shared fairly.",
    href: "/splits",
  },
  {
    title: "Seller balance",
    body: "See what you've earned from sales and licences, and withdraw once it clears.",
    href: "/seller",
  },
  {
    title: "Events",
    body: "Discover gigs and events, get tickets, and see who's playing near you.",
    href: "/events",
    tip: "That's the tour! You can reopen me anytime from the button in the corner.",
  },
];
