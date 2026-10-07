export type City = {
  slug: string;
  name: string;
  country: string;
  description: string;
};

export const CITIES: City[] = [
  { slug: "london",      name: "London",      country: "UK", description: "The best of London's nightlife, live music, and cultural events." },
  { slug: "manchester",  name: "Manchester",  country: "UK", description: "Manchester's thriving music and events scene." },
  { slug: "birmingham",  name: "Birmingham",  country: "UK", description: "What's on in Birmingham - clubs, gigs, and shows." },
  { slug: "bristol",     name: "Bristol",     country: "UK", description: "Bristol's legendary music and event culture." },
  { slug: "leeds",       name: "Leeds",       country: "UK", description: "Leeds events - from grassroots gigs to big nights out." },
  { slug: "glasgow",     name: "Glasgow",     country: "UK", description: "Glasgow's music, comedy, and cultural calendar." },
  { slug: "brighton",    name: "Brighton",    country: "UK", description: "Brighton seafront gigs, festivals, and club nights." },
  { slug: "paris",       name: "Paris",       country: "FR", description: "Paris events - concerts, clubbing, and culture." },
  { slug: "berlin",      name: "Berlin",      country: "DE", description: "Berlin's world-famous nightlife and live music." },
  { slug: "amsterdam",   name: "Amsterdam",   country: "NL", description: "Amsterdam events, from intimate gigs to festivals." },
  { slug: "barcelona",   name: "Barcelona",   country: "ES", description: "Barcelona's music, culture, and nightlife." },
  { slug: "dublin",      name: "Dublin",      country: "IE", description: "Dublin's live music and event scene." },
  { slug: "new-york",    name: "New York",    country: "US", description: "NYC - the city that never sleeps." },
  { slug: "los-angeles", name: "Los Angeles", country: "US", description: "LA's concerts, clubs, and cultural events." },
  { slug: "miami",       name: "Miami",       country: "US", description: "Miami's nightlife, festivals, and live shows." },
  { slug: "chicago",     name: "Chicago",     country: "US", description: "Chicago events, from house music to comedy." },
  { slug: "san-francisco", name: "San Francisco", country: "US", description: "SF's music, tech, and cultural events." },
  { slug: "toronto",     name: "Toronto",     country: "CA", description: "Toronto's events and entertainment calendar." },
  { slug: "vancouver",   name: "Vancouver",   country: "CA", description: "Vancouver events and live music." },
  { slug: "montreal",    name: "Montreal",    country: "CA", description: "Montreal's festivals and nightlife." },
  { slug: "calgary",     name: "Calgary",     country: "CA", description: "Calgary events and entertainment." },
  { slug: "sydney",      name: "Sydney",      country: "AU", description: "Sydney's music, culture, and events." },
  { slug: "melbourne",   name: "Melbourne",   country: "AU", description: "Melbourne's live music and cultural scene." },
  { slug: "brisbane",    name: "Brisbane",    country: "AU", description: "Brisbane events and nightlife." },
  { slug: "perth",       name: "Perth",       country: "AU", description: "Perth events and live music." },
];

export function findCity(slug: string): City | undefined {
  const s = slug.toLowerCase();
  return CITIES.find((c) => c.slug === s || c.name.toLowerCase() === s);
}