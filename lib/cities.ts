export type City = {
  slug: string;
  name: string;
  country: string;
  blurb: string;
};

export const CITIES: City[] = [
  { slug: "london",      name: "London",      country: "United Kingdom", blurb: "The capital of UK nightlife — from Fabric to Printworks." },
  { slug: "manchester",  name: "Manchester",  country: "United Kingdom", blurb: "Warehouse Project, Hidden, and the UK's best warehouse scene." },
  { slug: "birmingham",  name: "Birmingham",  country: "United Kingdom", blurb: "The UK's second city — O2 Academy, Lab11, and more." },
  { slug: "bristol",     name: "Bristol",     country: "United Kingdom", blurb: "Bass music capital — Motion, Thekla, Lakota." },
  { slug: "brighton",    name: "Brighton",    country: "United Kingdom", blurb: "Seaside rave central — Concorde 2, Patterns." },
  { slug: "leeds",       name: "Leeds",       country: "United Kingdom", blurb: "Northern powerhouse — Belgrave, Brudenell Social Club." },
  { slug: "glasgow",     name: "Glasgow",     country: "United Kingdom", blurb: "Scotland's clubbing heart — SWG3, Sub Club, Barrowlands." },
  { slug: "liverpool",   name: "Liverpool",   country: "United Kingdom", blurb: "Merseyside's music city — Invisible Wind Factory." },
  { slug: "newcastle",   name: "Newcastle",   country: "United Kingdom", blurb: "Geordie nightlife — World Headquarters, Digital." },
  { slug: "paris",       name: "Paris",       country: "France",         blurb: "Fête de la Musique and the Parisian electronic underground." },
  { slug: "berlin",      name: "Berlin",      country: "Germany",        blurb: "The world capital of techno — Berghain, Watergate, Sisyphos." },
  { slug: "amsterdam",   name: "Amsterdam",   country: "Netherlands",    blurb: "ADE every October — Shelter, Paradiso, De School." },
  { slug: "barcelona",   name: "Barcelona",   country: "Spain",          blurb: "Sónar, Razzmatazz, and beachside raves." },
  { slug: "madrid",      name: "Madrid",      country: "Spain",          blurb: "Mondo Disko, Fabrik, and Madrid's warehouse revival." },
  { slug: "dublin",      name: "Dublin",      country: "Ireland",        blurb: "Dublin's club scene — District 8, Button Factory." },
  { slug: "new-york",    name: "New York",    country: "United States",  blurb: "Brooklyn Mirage, Nowadays, and the city that never sleeps." },
  { slug: "los-angeles", name: "Los Angeles", country: "United States",  blurb: "LA's warehouse scene — Sound, Academy, Grand Park." },
  { slug: "chicago",     name: "Chicago",     country: "United States",  blurb: "The birthplace of house music — Smartbar, Spybar." },
  { slug: "miami",       name: "Miami",       country: "United States",  blurb: "Ultra, Club Space, and Miami Music Week." },
  { slug: "san-francisco", name: "San Francisco", country: "United States", blurb: "SF's Great Northern, Public Works, and the legendary Midway." },
  { slug: "toronto",     name: "Toronto",     country: "Canada",         blurb: "Toronto's Coda, Nest, and Union events." },
  { slug: "montreal",    name: "Montreal",    country: "Canada",         blurb: "Stereo, Newspeak, and MTL's legendary afterhours." },
  { slug: "vancouver",   name: "Vancouver",   country: "Canada",         blurb: "Vancouver's underground — Celebrities, Fortune Sound Club." },
  { slug: "sydney",      name: "Sydney",      country: "Australia",      blurb: "Sydney's club scene — Home the Venue, Chinese Laundry." },
  { slug: "melbourne",   name: "Melbourne",   country: "Australia",      blurb: "Melbourne's Revolver, Sub Club, and Chapel Street." },
  { slug: "brisbane",    name: "Brisbane",    country: "Australia",      blurb: "The Tivoli, The Zoo, and Brisbane's warehouse scene." },
  { slug: "perth",       name: "Perth",       country: "Australia",      blurb: "Perth's clubbing heart — Metropolis Fremantle." },
];

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug.toLowerCase());
}

export function slugToCityName(slug: string): string {
  return getCity(slug)?.name ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
