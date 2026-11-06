export type NetworkCardType = {
  id: string;
  name: string;
  handle: string;
  role: string;
  kind: string;
  city: string;
  genres: string[];
  bio?: string;
  trust?: string;
  price?: number;
};

export const CARDS: NetworkCardType[] = [
  { id: "1", name: "Rachel Sterling", handle: "@rachelsterling", role: "A&R", kind: "person", city: "London", genres: ["Electronic", "Techno"], bio: "A&R at major label. Electronic focused." },
  { id: "2", name: "David Chen", handle: "@davidchen", role: "A&R", kind: "person", city: "Manchester", genres: ["Indie", "Rock"], bio: "A&R looking for indie and rock acts." },
  { id: "3", name: "Sophie Bennett", handle: "@sophiebennett", role: "A&R", kind: "person", city: "Brighton", genres: ["Jazz", "Soul"], bio: "A&R with jazz and soul background." },
  { id: "4", name: "Marcus Reid", handle: "@marcusreid", role: "A&R", kind: "person", city: "London", genres: ["Hip-hop", "Rap"], bio: "Hip hop and rap A&R." },
  { id: "5", name: "Nina Vasquez", handle: "@ninavasquez", role: "A&R", kind: "person", city: "Berlin", genres: ["Electronic"], bio: "Electronic music A&R." },
  { id: "6", name: "Felix Schwarz", handle: "@felixschwarz", role: "A&R", kind: "person", city: "Berlin", genres: ["Techno", "House"], bio: "Techno and house A&R in Berlin." },
  { id: "7", name: "Sam Okafor", handle: "@samokafor", role: "A&R", kind: "person", city: "London", genres: ["Afrobeats", "Fusion"], bio: "A&R for afrobeats and fusion." },
  { id: "8", name: "Village Underground", handle: "@villageunderground", role: "venue", kind: "venue", city: "London", genres: ["Electronic", "Live"], bio: "Iconic East London venue." },
  { id: "9", name: "Warehouse Project", handle: "@warehouseproject", role: "promoter", kind: "promoter", city: "Manchester", genres: ["Techno", "House"], bio: "The people who fill rooms." },
  { id: "10", name: "Voltage Sound", handle: "@voltagesound", role: "record_company", kind: "label", city: "Berlin", genres: ["Techno", "House"], bio: "Techno and house label." },
  { id: "11", name: "Echo Chamber Records", handle: "@echochamber", role: "record_company", kind: "label", city: "London", genres: ["Electronic"], bio: "Independent electronic label." },
  { id: "12", name: "Jack Murphy", handle: "@jackmurphy", role: "attendee", kind: "person", city: "London", genres: ["Techno", "House"], bio: "Music lover. Techno and house." },
  { id: "13", name: "Funk Me I'm Famous", handle: "@funkmeimfamous", role: "Playlist Curator", kind: "person", city: "London", genres: ["Funk", "Disco"], bio: "Top playlist curator." },
];

export function getCardsForTab(tab: string): NetworkCardType[] {
  if (tab === "everyone" || !tab) return CARDS;
  
  const roleMap: Record<string, string[]> = {
    artists: ["artist", "musician"],
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

  const rolesToMatch = roleMap[tab] || [];
  return CARDS.filter(c => rolesToMatch.includes(c.role));
}
