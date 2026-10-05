const fs = require("fs");
const p = "app/search/page.tsx";
let t = fs.readFileSync(p, "utf8");
t = t.replace(/\r\n/g, "\n");
const before = t;

/* 1. Extend searchParams type + read new params */
t = t.replace(
  'searchParams: Promise<{ q?: string; type?: string; sort?: string }>;',
  'searchParams: Promise<{ q?: string; type?: string; sort?: string; city?: string; when?: string; price?: string }>;'
);

t = t.replace(
  `  const sort = params.sort || "upcoming";`,
  `  const sort = params.sort || "upcoming";
  const city = params.city || "";
  const when = params.when || "";
  const price = params.price || "";`
);

/* 2. Add city filter — look up venue ids by city, then filter events */
const insertAfterType = `  if (type !== "all") {
    query = query.eq("event_type", type);
  }`;

const withCity = `  if (type !== "all") {
    query = query.eq("event_type", type);
  }

  // City filter — via venue lookup
  if (city) {
    const { data: venueRows } = await supabase
      .from("venues")
      .select("id")
      .ilike("city", city);
    const venueIds = (venueRows || []).map((v) => v.id);
    if (venueIds.length > 0) {
      query = query.in("venue_id", venueIds);
    } else {
      // No venues match — force no results
      query = query.eq("id", "00000000-0000-0000-0000-000000000000");
    }
  }

  // When filter
  if (when === "7days" || when === "weekend") {
    const end = new Date();
    end.setDate(end.getDate() + (when === "weekend" ? 3 : 7));
    query = query
      .gte("start_date", new Date().toISOString())
      .lte("start_date", end.toISOString());
  } else if (when === "30days") {
    const end = new Date();
    end.setDate(end.getDate() + 30);
    query = query
      .gte("start_date", new Date().toISOString())
      .lte("start_date", end.toISOString());
  }`;

if (t.includes(insertAfterType)) {
  t = t.replace(insertAfterType, withCity);
  console.log("1. City + When query filters added.");
} else {
  console.log("1. anchor miss");
}

/* 3. Price filter (after fetch) — must come after 'const eventList = ...' */
const oldEventListLine = `  const eventList = (events as Event[]) || [];`;

const newEventListBlock = `  let eventList = (events as Event[]) || [];

  // Price filter — post-fetch because ticket_types is JSON
  if (price) {
    const priceOf = (e: Event): number => {
      const types = Array.isArray(e.ticket_types) ? e.ticket_types : [];
      if (types.length === 0) return 0;
      return Math.min(...types.map((t) => Number(t.price || 0)));
    };
    eventList = eventList.filter((e) => {
      const p = priceOf(e);
      if (price === "free") return p === 0;
      if (price === "under20") return p > 0 && p < 20;
      if (price === "20-50") return p >= 20 && p <= 50;
      if (price === "50plus") return p > 50;
      return true;
    });
  }`;

if (t.includes(oldEventListLine)) {
  t = t.replace(oldEventListLine, newEventListBlock);
  console.log("2. Price filter added.");
} else {
  console.log("2. anchor miss");
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
} else {
  console.log("No changes made.");
}