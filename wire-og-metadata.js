const fs = require("fs");
const p = "app/event/[id]/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

const oldBlock = `    openGraph: {
      title: event.title,
      description: desc,
      type: "website",
      images: event.hero_image
        ? [{ url: event.hero_image, width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: desc,
      images: event.hero_image ? [event.hero_image] : [],
    },`;

const newBlock = `    openGraph: {
      title: event.title,
      description: desc,
      type: "website",
      images: [
        {
          url: "/api/og?event=" + id,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: desc,
      images: ["/api/og?event=" + id],
    },`;

if (t.includes(oldBlock)) {
  t = t.replace(oldBlock, newBlock);
  fs.writeFileSync(p, t);
  console.log("Event metadata now points at /api/og?event=<id>.");
} else {
  console.log("Anchor miss. Current block:");
  const i = t.indexOf("openGraph:");
  console.log(JSON.stringify(t.slice(i - 100, i + 500)));
}