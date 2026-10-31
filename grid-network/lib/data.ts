import { NetworkCard } from "./types";

export const TABS = [
  { slug: "everyone",  label: "Everyone",  icon: "O" },
  { slug: "artists",   label: "Artists",   icon: "A" },
  { slug: "djs",       label: "DJs",       icon: "D" },
  { slug: "producers", label: "Producers", icon: "P" },
  { slug: "bands",     label: "Bands",     icon: "B" },
  { slug: "managers",  label: "Managers",  icon: "M" },
  { slug: "promoters", label: "Promoters", icon: "*" },
  { slug: "venues",    label: "Venues",    icon: "V" },
  { slug: "a-and-r",   label: "A&R",       icon: "R" },
  { slug: "labels",    label: "Labels",    icon: "L" },
  { slug: "attendees", label: "Attendees", icon: "." },
] as const;

export const CARDS: NetworkCard[] = [
  { id:"1", name:"Rachel Sterling", handle:"@rachelsterling", role:"A&R", kind:"person", city:"London", genres:["Electronic","Techno"], bio:"A&R at major label.", price:2 },
  { id:"2", name:"David Chen", handle:"@davidchen", role:"A&R", kind:"person", city:"Manchester", genres:["Indie","Rock"], bio:"A&R looking for indie/rock.", price:2 },
  { id:"3", name:"Sophie Bennett", handle:"@sophiebennett", role:"A&R", kind:"person", city:"Brighton", genres:["Jazz","Soul"], bio:"Jazz and soul A&R.", price:2 },
  { id:"4", name:"Marcus Reid", handle:"@marcusreid", role:"A&R", kind:"person", city:"London", genres:["Hip-hop","Rap"], bio:"Hip hop A&R.", price:2 },
  { id:"5", name:"Nina Vasquez", handle:"@ninavasquez", role:"A&R", kind:"person", city:"Berlin", genres:["Electronic"], bio:"Electronic A&R.", price:2 },
  { id:"6", name:"Felix Schwarz", handle:"@felixschwarz", role:"A&R", kind:"person", city:"Berlin", genres:["Techno","House"], bio:"Techno and house A&R.", price:2 },
  { id:"7", name:"Sam Okafor", handle:"@samokafor", role:"A&R", kind:"person", city:"London", genres:["Afrobeats"], bio:"Afrobeats A&R.", price:2 },
  { id:"8", name:"Village Underground", handle:"@villageunderground", role:"venue", kind:"venue", city:"London", genres:["Electronic","Live"], extra:"Capacity 700", price:4 },
  { id:"9", name:"Warehouse Project", handle:"@warehouseproject", role:"promoter", kind:"promoter", city:"Manchester", genres:["Techno","House"], extra:"12 events / 4 venues", price:4 },
  { id:"10", name:"Voltage Sound", handle:"@voltagesound", role:"record_company", kind:"label", city:"Berlin", genres:["Techno","House"], extra:"Roster 14", price:6 },
  { id:"11", name:"Echo Chamber Records", handle:"@echochamber", role:"record_company", kind:"label", city:"London", genres:["Electronic"], extra:"Roster 8", price:6 },
  { id:"12", name:"Northlight Music", handle:"@northlight", role:"record_company", kind:"label", city:"Manchester", genres:["Indie"], extra:"Roster 6", price:6 },
  { id:"13", name:"Jack Murphy", handle:"@jackmurphy", role:"attendee", kind:"person", city:"London", genres:["Techno"], bio:"Music lover.", price:2 },
  { id:"14", name:"Ella Watson", handle:"@ellawatson", role:"attendee", kind:"person", city:"Brighton", genres:["Indie"], bio:"Indie kid.", price:2 },
  { id:"15", name:"Funk Me I'm Famous", handle:"@funkmeimfamous", role:"Playlist Curator", kind:"person", city:"London", genres:["Funk","Disco"], trust:"Honest / Clear about style", price:6 },
  { id:"16", name:"BRAZILIAN PHONK VIRAL", handle:"@brazilianphonk", role:"Playlist Curator", kind:"person", city:"Sao Paulo", genres:["Phonk"], trust:"Kind / Clear about style", price:2 },
  { id:"17", name:"Portal Beepop", handle:"@portalbeepop", role:"Media Outlet", kind:"person", city:"Sao Paulo", genres:["Brazilian Funk","Funk"], trust:"Kind", price:2 },
  { id:"18", name:"Order of Baldwin", handle:"@orderofbaldwin", role:"YouTube/Twitch", kind:"person", city:"London", genres:["Brazilian Funk","Phonk"], price:2 },
  { id:"19", name:"Danceproject", handle:"@danceproject", role:"Playlist Curator", kind:"person", city:"Paris", genres:["Funk","House"], trust:"Honest / High Impact", price:2 },
  { id:"20", name:"Heavy Bass beats", handle:"@heavybass", role:"Playlist Curator", kind:"person", city:"London", genres:["Brazilian Funk","Bass"], trust:"Honest / Quick Sharer", price:4 }
];

export function getCardsForTab(tab: string): NetworkCard[] {
  if (tab === "everyone" || !tab) return CARDS;
  const map: Record<string, string[]> = {
    artists: ["artist","musician"],
    djs: ["dj"],
    producers: ["producer"],
    bands: ["band"],
    managers: ["manager"],
    promoters: ["promoter"],
    venues: ["venue"],
    "a-and-r": ["A&R"],
    labels: ["record_company"],
    attendees: ["attendee"],
  };
  const roles = map[tab] ?? [];
  return CARDS.filter(c => roles.includes(c.role));
}
