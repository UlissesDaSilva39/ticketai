export interface ProfileViewer {
  id: string;
  name: string;
  role: string;
  city: string;
  viewedAt: number;
}

export const MOCK_PROFILE_VIEWERS: ProfileViewer[] = [
  { id: "1", name: "Beatport Records", role: "Label", city: "London", viewedAt: Date.now() - 7200000 },
  { id: "2", name: "Sarah Jenkins", role: "Vocalist", city: "London", viewedAt: Date.now() - 21600000 },
  { id: "3", name: "Ministry of Sound", role: "Venue", city: "London", viewedAt: Date.now() - 43200000 },
  { id: "4", name: "Studio X", role: "Studio", city: "Manchester", viewedAt: Date.now() - 86400000 },
  { id: "5", name: "Kai Andersen", role: "Producer", city: "Copenhagen", viewedAt: Date.now() - 172800000 },
  { id: "6", name: "Sellick A&R", role: "A&R", city: "Berlin", viewedAt: Date.now() - 259200000 },
  { id: "7", name: "Toolroom Records", role: "Label", city: "London", viewedAt: Date.now() - 345600000 },
  { id: "8", name: "Luna Park", role: "Vocalist", city: "Lisbon", viewedAt: Date.now() - 432000000 },
  { id: "9", name: "Defected Records", role: "Label", city: "London", viewedAt: Date.now() - 518400000 },
  { id: "10", name: "Nia Okafor", role: "Vocalist", city: "Bristol", viewedAt: Date.now() - 604800000 },
];

export const MOCK_CHART_HISTORY = [
  { week: "This week", rank: 47 },
  { week: "Last week", rank: 63 },
  { week: "2 weeks ago", rank: 78 },
  { week: "3 weeks ago", rank: 92 },
];

export const MOCK_GENRE_STATS = [
  { genre: "House", plays: 12450, percentage: 45 },
  { genre: "Techno", plays: 8300, percentage: 30 },
  { genre: "Soul", plays: 4150, percentage: 15 },
  { genre: "Breakbeat", plays: 2770, percentage: 10 },
];

export const MOCK_APPLICATION_STATS = {
  totalApplications: 18,
  responses: 12,
  responseRate: 67,
  bookings: 4,
  industryAvgResponseRate: 12,
};

export const MOCK_VIEW_SOURCES = [
  { source: "GRID search", count: 342, percentage: 42 },
  { source: "Direct", count: 245, percentage: 30 },
  { source: "Instagram", count: 120, percentage: 15 },
  { source: "Spotify", count: 65, percentage: 8 },
  { source: "Other", count: 41, percentage: 5 },
];

export const MOCK_PROFILE_STATS = {
  totalViewsThisWeek: 813,
  newThisWeek: 34,
  followersGained: 12,
};