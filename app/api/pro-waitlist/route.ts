import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "pro-waitlist.json");

type Signup = {
  email: string;
  role: string;
  monthlyRevenue: string;
  createdAt: string;
};

async function readSignups(): Promise<Signup[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw) as Signup[];
  } catch {
    return [];
  }
}

async function writeSignups(signups: Signup[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(signups, null, 2), "utf8");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const role = String(body?.role ?? "artist").trim();
    const monthlyRevenue = String(body?.monthlyRevenue ?? "unknown").trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const signups = await readSignups();
    if (signups.some((s) => s.email === email)) {
      return NextResponse.json({ ok: true, alreadyOnList: true });
    }

    signups.push({ email, role, monthlyRevenue, createdAt: new Date().toISOString() });
    await writeSignups(signups);

    return NextResponse.json({ ok: true, position: signups.length });
  } catch (err) {
    console.error("pro-waitlist POST error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const signups = await readSignups();
  return NextResponse.json({ count: signups.length });
}