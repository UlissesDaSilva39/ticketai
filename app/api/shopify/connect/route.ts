import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { artistId, shopifyDomain } = await req.json();
    if (!artistId) return NextResponse.json({ error: "Missing artistId" }, { status: 400 });

    const dbPath = path.join(process.cwd(), "data", "artist-stores.json");
    
    // Read existing data
    let db: Record<string, string> = {};
    if (fs.existsSync(dbPath)) {
      db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    }

    // Update the artist's store
    if (shopifyDomain) {
      db[artistId] = shopifyDomain.replace("https://", "").replace("http://", "").replace(/\/$/, "");
    } else {
      delete db[artistId]; // Disconnect if empty
    }

    // Save back to file
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return NextResponse.json({ success: true, shopifyDomain: db[artistId] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
