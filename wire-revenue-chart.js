const fs = require("fs");
const p = "app/organizer/analytics/page.tsx";
let t = fs.readFileSync(p, "utf8");
t = t.replace(/\r\n/g, "\n");
const before = t;

/* 1. Add RevenueChart import */
if (!t.includes("RevenueChart from")) {
  t = t.replace(
    'import type { Event } from "@/lib/types";',
    'import type { Event } from "@/lib/types";\nimport RevenueChart from "@/components/RevenueChart";'
  );
  console.log("1. RevenueChart import added.");
}

/* 2. Add daily + top-event aggregation right before "return (" */
if (!t.includes("dailyData")) {
  const anchor = "  return (";
  const agg = `  // Daily aggregation for the last 30 days
  const dayBuckets: Record<string, { revenue: number; tickets: number }> = {};
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dayBuckets[key] = { revenue: 0, tickets: 0 };
  }

  for (const o of orders) {
    const key = new Date(o.created_at).toISOString().slice(0, 10);
    if (dayBuckets[key]) {
      dayBuckets[key].revenue += Number(o.total_amount || 0);
      const ticketCount = (o.tickets || []).reduce((s, x) => s + Number(x.qty || 0), 0);
      dayBuckets[key].tickets += ticketCount;
    }
  }

  const dailyData = Object.entries(dayBuckets).map(([date, v]) => ({
    date: date.slice(5), // MM-DD
    revenue: Number(v.revenue.toFixed(2)),
    tickets: v.tickets,
  }));

  const topEvents = [...perEventStats]
    .filter((s) => s.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)
    .map((s) => ({
      name: s.event.title.length > 30 ? s.event.title.slice(0, 30) + "…" : s.event.title,
      revenue: Number(s.revenue.toFixed(2)),
    }));

  return (`;

  if (t.includes(anchor)) {
    t = t.replace(anchor, agg);
    console.log("2. Daily + top-event aggregation added.");
  } else {
    console.log("2. return( anchor not found.");
  }
}

/* 3. Render RevenueChart somewhere before the closing </div> */
if (!t.includes("<RevenueChart")) {
  // Find the last "</div>" in the return block and insert before it
  const lastClose = t.lastIndexOf("</div>");
  if (lastClose > -1) {
    const insert =
      '      <div className="mb-12">\n' +
      '        <h2 className="text-3xl font-bold uppercase mb-6" style={{ fontFamily: "var(--font-antonio)" }}>\n' +
      '          Charts\n' +
      '        </h2>\n' +
      '        <RevenueChart dailyData={dailyData} topEvents={topEvents} />\n' +
      '      </div>\n' +
      '    ';
    t = t.slice(0, lastClose) + insert + t.slice(lastClose);
    console.log("3. RevenueChart rendered.");
  }
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
} else {
  console.log("No changes made.");
}