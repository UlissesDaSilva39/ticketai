const fs = require("fs");
const manifest = {
  name: "TicketAI",
  short_name: "TicketAI",
  description: "Find your next event. Tickets, lineups, friends, reviews.",
  start_url: "/",
  scope: "/",
  display: "standalone",
  orientation: "portrait",
  background_color: "#000000",
  theme_color: "#00FF87",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
  ]
};
fs.writeFileSync("public/manifest.webmanifest", JSON.stringify(manifest, null, 2));
console.log("public/manifest.webmanifest written:", JSON.stringify(manifest).length, "chars");