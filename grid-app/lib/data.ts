import { NetworkCard } from "./types";

export const TABS = [
  { slug: "everyone",  label: "Everyone" },
  { slug: "artists",   label: "Artists" },
  { slug: "djs",       label: "DJs" },
  { slug: "producers", label: "Producers" },
  { slug: "bands",     label: "Bands" },
  { slug: "managers",  label: "Managers" },
  { slug: "promoters", label: "Promoters" },
  { slug: "venues",    label: "Venues" },
  { slug: "a-and-r",   label: "A&R" },
  { slug: "labels",    label: "Labels" },
  { slug: "attendees", label: "Attendees" },
] as const;

// Display label for raw role values
export const ROLE_LABEL: Record<string, string> = {
  AandR: "A&R",
  "A&R": "A&R",
  record_company: "Label",
  attendee: "Attendee",
  admin: "Admin",
};

export const CARDS: NetworkCard[] = [
  { id:"1",  name:"Rachel Sterling", handle:"@rachelsterling", role:"A&R", kind:"person", city:"London", genres:["Electronic","Techno"], bio:"A&R at major label. Electronic focused." },
  { id:"2",  name:"David Chen", handle:"@davidchen", role:"A&R", kind:"person", city:"Manchester", genres:["Indie","Rock"], bio:"A&R looking for indie and rock acts." },
  { id:"3",  name:"Sophie Bennett", handle:"@sophiebennett", role:"A&R", kind:"person", city:"Brighton", genres:["Jazz","Soul"], bio:"A&R with jazz and soul background." },
  { id:"4",  name:"Marcus Reid", handle:"@marcusreid", role:"A&R", kind:"person", city:"London", genres:["Hip-hop","Rap"], bio:"Hip hop and rap A&R." },
  { id:"5",  name:"Nina Vasquez", handle:"@ninavasquez", role:"A&R", kind:"person", city:"Berlin", genres:["Electronic"], bio:"Electronic music A&R." },
  { id:"6",  name:"Oliver Kaine", handle:"@oliverkaine", role:"A&R", kind:"person", city:"Amsterdam", genres:["Ambient","Experimental"], bio:"A&R focused on ambient and experimental." },
  { id:"7",  name:"Maya Chandran", handle:"@mayachandran", role:"A&R", kind:"person", city:"London", genres:["Pop","R&B"], bio:"Pop and R&B A&R." },
  { id:"8",  name:"Felix Schwarz", handle:"@felixschwarz", role:"A&R", kind:"person", city:"Berlin", genres:["Techno","House"], bio:"Techno and house A&R in Berlin." },
  { id:"9",  name:"Zoe Hart", handle:"@zoehart", role:"A&R", kind:"person", city:"Bristol", genres:["Indie"], bio:"A&R scout for independent labels." },
  { id:"10", name:"Liam Foster", handle:"@liamfoster", role:"A&R", kind:"person", city:"Glasgow", genres:["Publishing"], bio:"A&R with publishing background." },
  { id:"11", name:"Isabella Rossi", handle:"@isabellarossi", role:"A&R", kind:"person", city:"Paris", genres:["Jazz"], bio:"A&R from Milan, jazz focused." },
  { id:"12", name:"James Whitfield", handle:"@jameswhitfield", role:"A&R", kind:"person", city:"Bristol", genres:["DnB","Bass"], bio:"A&R for DnB and bass music." },
  { id:"13", name:"Priya Nair", handle:"@priyanair", role:"A&R", kind:"person", city:"London", genres:["World"], bio:"A&R working with world music." },
  { id:"14", name:"Ethan Brooks", handle:"@ethanbrooks", role:"A&R", kind:"person", city:"Birmingham", genres:["Post-rock","Shoegaze"], bio:"A&R in post-rock and shoegaze." },
  { id:"15", name:"Charlotte Dean", handle:"@charlottedean", role:"A&R", kind:"person", city:"Leeds", genres:["Singer-songwriter"], bio:"A&R for singer-songwriters." },
  { id:"16", name:"Nathan Cole", handle:"@nathancole", role:"A&R", kind:"person", city:"London", genres:["UK Garage"], bio:"A&R focused on UK garage." },
  { id:"17", name:"Elena Petrova", handle:"@elenapetrova", role:"A&R", kind:"person", city:"Paris", genres:["Classical"], bio:"A&R with classical crossover focus." },
  { id:"18", name:"Sam Okafor", handle:"@samokafor", role:"A&R", kind:"person", city:"London", genres:["Afrobeats"], bio:"A&R for afrobeats and fusion." },
  { id:"19", name:"Amelia Grant", handle:"@ameliagrant", role:"A&R", kind:"person", city:"Dublin", genres:["Folk","Acoustic"], bio:"A&R in folk and acoustic." },
  { id:"20", name:"Echo Chamber Records", handle:"@echochamber", role:"record_company", kind:"label", city:"London", genres:["Electronic"], bio:"Independent electronic label." },
  { id:"21", name:"Northlight Music", handle:"@northlight", role:"record_company", kind:"label", city:"Manchester", genres:["Indie"], bio:"Northern UK independent label." },
  { id:"22", name:"Blue Tower Records", handle:"@bluetower", role:"record_company", kind:"label", city:"Paris", genres:["Jazz","Soul"], bio:"Jazz and soul label." },
  { id:"23", name:"Voltage Sound", handle:"@voltagesound", role:"record_company", kind:"label", city:"Berlin", genres:["Techno","House"], bio:"Techno and house label." },
  { id:"24", name:"Paper Boat Records", handle:"@paperboat", role:"record_company", kind:"label", city:"Bristol", genres:["Indie","Folk"], bio:"Indie and folk label." },
  { id:"25", name:"Tide & Time", handle:"@tideandtime", role:"record_company", kind:"label", city:"Amsterdam", genres:["Ambient"], bio:"Ambient label." },
  { id:"26", name:"Hexagon Music", handle:"@hexagonmusic", role:"record_company", kind:"label", city:"London", genres:["Hip-hop","R&B"], bio:"Hip hop and R&B label." },
  { id:"27", name:"Cathedral Sound", handle:"@cathedralsound", role:"record_company", kind:"label", city:"Glasgow", genres:["Post-rock","Shoegaze"], bio:"Post-rock and shoegaze label." },
  { id:"28", name:"Marble Records", handle:"@marblesrecords", role:"record_company", kind:"label", city:"Bristol", genres:["DnB"], bio:"Drum and bass label." },
  { id:"29", name:"Kinfolk Records", handle:"@kinfolkrecords", role:"record_company", kind:"label", city:"Dublin", genres:["Folk","Acoustic"], bio:"Folk and acoustic label." },
  { id:"30", name:"Jack Murphy", handle:"@jackmurphy", role:"attendee", kind:"person", city:"London", genres:["Techno","House"], bio:"Music lover. Techno and house." },
  { id:"31", name:"Ella Watson", handle:"@ellawatson", role:"attendee", kind:"person", city:"Brighton", genres:["Indie"], bio:"Indie kid." },
  { id:"32", name:"Ryan Stewart", handle:"@ryanstewart", role:"attendee", kind:"person", city:"Bristol", genres:["DnB"], bio:"DnB head." },
  { id:"33", name:"Mia Chen", handle:"@miachen", role:"attendee", kind:"person", city:"London", genres:["Jazz","Soul"], bio:"Jazz and soul lover." },
  { id:"34", name:"Luke Harrison", handle:"@lukeharrison", role:"attendee", kind:"person", city:"Manchester", genres:["Live music"], bio:"Live music obsessive." },
  { id:"35", name:"Amelia Foster", handle:"@ameliafoster", role:"attendee", kind:"person", city:"Bristol", genres:["Folk","Acoustic"], bio:"Folk and acoustic." },
  { id:"36", name:"Owen Bennett", handle:"@owenbennett", role:"attendee", kind:"person", city:"Glasgow", genres:["Post-rock"], bio:"Post-rock fan." },
  { id:"37", name:"Ruby Sinclair", handle:"@rubysinclair", role:"attendee", kind:"person", city:"Birmingham", genres:["Shoegaze"], bio:"Shoegaze forever." },
  { id:"38", name:"Theo James", handle:"@theojames", role:"attendee", kind:"person", city:"London", genres:["Garage","Bass"], bio:"Garage and bass." },
  { id:"39", name:"Lily Moore", handle:"@lilymoore", role:"attendee", kind:"person", city:"Leeds", genres:["Singer-songwriter"], bio:"Singer-songwriter fan." },
  { id:"40", name:"Daniel Kim", handle:"@danielkim", role:"attendee", kind:"person", city:"London", genres:["Electronic"], bio:"Electronic music producer." },
  { id:"41", name:"Sophia Adams", handle:"@sophiaadams", role:"attendee", kind:"person", city:"Berlin", genres:["Techno"], bio:"Techno and Berlin scene." },
  { id:"42", name:"Alex Morgan", handle:"@alexmorgan_old_0af6c954", role:"A&R", kind:"person", city:"London", genres:["A&R"], bio:"A&R scout looking for new talent." },
  { id:"43", name:"Henry Walker", handle:"@henrywalker", role:"attendee", kind:"person", city:"Amsterdam", genres:["Ambient","Experimental"], bio:"Ambient and experimental." },
  { id:"44", name:"Zara Patel", handle:"@zarapatel", role:"attendee", kind:"person", city:"London", genres:["World"], bio:"World music fan." },
  { id:"45", name:"Josh Taylor", handle:"@joshtaylor", role:"attendee", kind:"person", city:"Bristol", genres:["DnB"], bio:"Drum and bass DJ." },
  { id:"46", name:"Ivy Robinson", handle:"@ivyrobinson", role:"attendee", kind:"person", city:"Manchester", genres:["Indie","Alternative"], bio:"Indie and alternative." },
  { id:"47", name:"Max Harris", handle:"@maxharris", role:"attendee", kind:"person", city:"London", genres:["House","Disco"], bio:"House and disco." },
  { id:"48", name:"Freya Clarke", handle:"@freyaclarke", role:"attendee", kind:"person", city:"Paris", genres:["Soul","Funk"], bio:"Soul and funk." },
  { id:"49", name:"Cole Anderson", handle:"@coleanderson", role:"attendee", kind:"person", city:"Dublin", genres:["Punk","Rock"], bio:"Punk and rock." },
  { id:"50", name:"Harper Lewis", handle:"@harperlewis", role:"attendee", kind:"person", city:"Barcelona", genres:["Synth pop"], bio:"Synth pop fan." },
  { id:"51", name:"Demo User", handle:"@demo", role:"attendee", kind:"person", city:"London", genres:[], bio:"" },
  { id:"52", name:"ulissesdasilva39@gmail.com", handle:"@ulisses", role:"admin", kind:"admin", city:"London", genres:[], bio:"Promoter test", hidden:true },
  { id:"53", name:"Playwright Test", handle:"@playwright_test", role:"admin", kind:"admin", city:"London", genres:[], bio:"", hidden:true },
  { id:"54", name:"Alex Morgan", handle:"@alexmorgan", role:"attendee", kind:"person", city:"London", genres:["electronic"], bio:"A&R scout looking for new talent." },
];

// Public cards = hide admin/test accounts
export const PUBLIC_CARDS = CARDS.filter(c => !c.hidden);

export function getCardsForTab(tab: string): NetworkCard[] {
  if (tab === "everyone" || !tab) return PUBLIC_CARDS;

  const map: Record<string, string[]> = {
    artists:   ["artist","musician"],
    djs:       ["dj"],
    producers: ["producer"],
    bands:     ["band"],
    managers:  ["manager"],
    promoters: ["promoter"],
    venues:    ["venue"],
    "a-and-r": ["A&R"],
    labels:    ["record_company"],
    attendees: ["attendee"],
  };
  const roles = map[tab] ?? [];
  return PUBLIC_CARDS.filter(c => roles.includes(c.role));
}

// Display role label ("record_company" -> "Label")
export function roleLabel(role: string): string {
  if (role === "record_company") return "Label";
  if (role === "A&R") return "A&R";
  return role.charAt(0).toUpperCase() + role.slice(1);
}
