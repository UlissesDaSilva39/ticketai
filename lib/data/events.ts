export interface GridEvent {
  id: string;
  title: string;
  description: string;
  type: "concert" | "club-night" | "festival" | "meetup" | "workshop";
  venue: string;
  city: string;
  date: string;
  time: string;
  capacity: number;
  ticketsSold: number;
  pricePence: number;
  artistId: string;
  artistName: string;
  artistColor: string;
  color: string;
  isFeatured: boolean;
  lineup: string[];
}

export const GRID_EVENTS: GridEvent[] = [
  {
    id: "event-001",
    title: "Midnight Sessions: Sarah Jenkins Live",
    description: "Intimate house vocal showcase. Sarah performs her latest releases from the Toolroom catalogue, plus exclusive new material from her upcoming EP. Limited capacity.",
    type: "club-night",
    venue: "Night Tales",
    city: "London",
    date: "2026-12-15",
    time: "22:00",
    capacity: 250,
    ticketsSold: 187,
    pricePence: 1500,
    artistId: "1",
    artistName: "Sarah Jenkins",
    artistColor: "bg-pink-500",
    color: "from-pink-500 to-rose-600",
    isFeatured: true,
    lineup: ["Sarah Jenkins", "Marco Bianchi", "Priya Sharma"],
  },
  {
    id: "event-002",
    title: "Cold Matter Label Night",
    description: "Kai Andersen brings the Cold Matter roster to Copenhagen's iconic techno cathedral. Six-hour marathon with industrial and minimal sets.",
    type: "club-night",
    venue: "Culture Box",
    city: "Copenhagen",
    date: "2026-12-20",
    time: "23:00",
    capacity: 500,
    ticketsSold: 342,
    pricePence: 2500,
    artistId: "7",
    artistName: "Kai Andersen",
    artistColor: "bg-teal-600",
    color: "from-teal-600 to-cyan-700",
    isFeatured: true,
    lineup: ["Kai Andersen", "Alex Rivera", "Dmitri Volkov"],
  },
  {
    id: "event-003",
    title: "GRID Producer Meetup — London",
    description: "Monthly networking event for London producers. Share your work in progress, find collaborators, get feedback. Free for Pro members.",
    type: "meetup",
    venue: "The Camden Assembly",
    city: "London",
    date: "2026-12-08",
    time: "19:00",
    capacity: 100,
    ticketsSold: 67,
    pricePence: 0,
    artistId: "5",
    artistName: "Marco Bianchi",
    artistColor: "bg-blue-600",
    color: "from-blue-600 to-indigo-700",
    isFeatured: false,
    lineup: ["Marco Bianchi", "Open floor for all producers"],
  },
  {
    id: "event-004",
    title: "Neo-Soul Sunday: Nia Okafor",
    description: "Live band showcase of neo-soul and R&B. Nia performs tracks from her debut album plus new collaborations with UK soul artists.",
    type: "concert",
    venue: "Jazz Cafe",
    city: "London",
    date: "2026-12-22",
    time: "20:00",
    capacity: 300,
    ticketsSold: 178,
    pricePence: 2000,
    artistId: "6",
    artistName: "Nia Okafor",
    artistColor: "bg-rose-600",
    color: "from-rose-600 to-pink-700",
    isFeatured: false,
    lineup: ["Nia Okafor", "Priya Sharma", "Luna Park"],
  },
  {
    id: "event-005",
    title: "Breakbeat Babylon NYE",
    description: "Amsterdam's biggest breakbeat and jungle NYE. 12-hour marathon across 3 rooms with the Cold Matter and Jungle Babylon crews.",
    type: "festival",
    venue: "Melkweg",
    city: "Amsterdam",
    date: "2026-12-31",
    time: "20:00",
    capacity: 1500,
    ticketsSold: 987,
    pricePence: 4500,
    artistId: "9",
    artistName: "Dmitri Volkov",
    artistColor: "bg-zinc-700",
    color: "from-zinc-700 to-gray-800",
    isFeatured: true,
    lineup: ["Dmitri Volkov", "Kai Andersen", "Taimoor Khan", "+8 more"],
  },
  {
    id: "event-006",
    title: "Mix & Master Workshop — Studio X",
    description: "Hands-on mixing workshop with Studio X's lead engineer. Bring a track, leave with a finished master. Includes stems review and plugin tutorials.",
    type: "workshop",
    venue: "Studio X",
    city: "Manchester",
    date: "2026-12-12",
    time: "14:00",
    capacity: 20,
    ticketsSold: 14,
    pricePence: 12000,
    artistId: "2",
    artistName: "Taimoor Khan",
    artistColor: "bg-emerald-600",
    color: "from-emerald-600 to-teal-700",
    isFeatured: false,
    lineup: ["Studio X Engineer", "Taimoor Khan"],
  },
];

export function getEvent(id: string): GridEvent | undefined {
  return GRID_EVENTS.find((e) => e.id === id);
}

export function getUpcomingEvents(): GridEvent[] {
  return GRID_EVENTS.filter((e) => new Date(e.date) > new Date()).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function getFeaturedEvents(): GridEvent[] {
  return GRID_EVENTS.filter((e) => e.isFeatured);
}