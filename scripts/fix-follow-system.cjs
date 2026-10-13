const fs = require("fs");
const path = require("path");

function W(rel, content) {
  const full = path.join(process.cwd(), rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("  ✅ " + rel + " (" + content.split("\n").length + " lines)");
}

// ---------- 1. /api/follows/status/route.ts ----------
W("app/api/follows/status/route.ts", `import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const url = new URL(req.url);
  const targetType = url.searchParams.get("targetType");
  const targetId = url.searchParams.get("targetId");

  if (!targetType || !targetId) {
    return NextResponse.json({ error: "targetType and targetId required" }, { status: 400 });
  }

  const { count } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("target_type", targetType)
    .eq("target_id", targetId);

  const { data: { user } } = await supabase.auth.getUser();

  let following = false;
  if (user) {
    const { data } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .maybeSingle();
    following = Boolean(data);
  }

  return NextResponse.json({
    following,
    count: count ?? 0,
    signedIn: Boolean(user),
  });
}
`);

// ---------- 2. /api/follows/toggle/route.ts ----------
W("app/api/follows/toggle/route.ts", `import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { targetType?: string; targetId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { targetType, targetId } = body;
  if (!targetType || !targetId) {
    return NextResponse.json({ error: "targetType and targetId required" }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .maybeSingle();

  let nowFollowing: boolean;
  if (existing) {
    const { error } = await supabase.from("follows").delete().eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    nowFollowing = false;
  } else {
    const { error } = await supabase.from("follows").insert({
      follower_id: user.id,
      target_type: targetType,
      target_id: targetId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    nowFollowing = true;
  }

  const { count } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("target_type", targetType)
    .eq("target_id", targetId);

  return NextResponse.json({ following: nowFollowing, count: count ?? 0 });
}
`);

// ---------- 3. ArtistFollowButton.tsx (fix) ----------
W("components/artist/ArtistFollowButton.tsx", `"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, UserCheck } from "lucide-react";

type Props = {
  artistSlug: string;
  initialFollowing: boolean;
  initialCount: number;
  signedIn: boolean;
};

export default function ArtistFollowButton({
  artistSlug,
  initialFollowing,
  initialCount,
  signedIn,
}: Props) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!signedIn) {
      router.push("/login?next=/artist/" + artistSlug);
      return;
    }

    setBusy(true);
    const next = !following;
    setFollowing(next);
    setCount((n) => Math.max(n + (next ? 1 : -1), 0));

    try {
      const res = await fetch("/api/artists/" + artistSlug + "/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ following: next }),
      });

      if (!res.ok) {
        setFollowing(!next);
        setCount((n) => Math.max(n + (next ? -1 : 1), 0));
      }
    } catch {
      setFollowing(!next);
      setCount((n) => Math.max(n + (next ? -1 : 1), 0));
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={following}
      aria-label={following ? "Unfollow, " + count + " followers" : "Follow, " + count + " followers"}
      className={
        "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition disabled:opacity-50 " +
        (following
          ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
          : "bg-black text-white hover:bg-gray-800")
      }
    >
      {following ? (
        <>
          <UserCheck className="h-4 w-4" />
          Following · {count}
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Follow · {count}
        </>
      )}
    </button>
  );
}
`);

// ---------- 4. tests/e2e/follow-system.spec.ts ----------
W("tests/e2e/follow-system.spec.ts", `import { test, expect } from "./fixtures/base";

/* ============================================================
 *  Follow System — Artist + Venue
 * ============================================================ */

const TEST_ARTIST_SLUG = "basement-collective";
const TEST_ARTIST_URL = "/artist/" + TEST_ARTIST_SLUG;
const TEST_VENUE_SLUG = "test-first-veneu";
const TEST_VENUE_URL = "/venue/" + TEST_VENUE_SLUG;

// ============================================================
//  Artist follow
// ============================================================
test.describe("Follow System — Artist profile", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_ARTIST_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
  });

  test("F1. artist profile loads", async ({ page }) => {
    expect(page.url()).toContain("/artist/");
  });

  test("F2. artist heading is visible", async ({ page }) => {
    const h = page.getByRole("heading", { level: 1 }).first();
    await expect(h).toBeVisible({ timeout: 15000 });
    expect((await h.innerText()).toLowerCase()).toContain("basement");
  });

  test("F3. Follow button exists + enabled", async ({ page }) => {
    const b = page.getByRole("button", { name: /follow|following/i }).first();
    await expect(b).toBeVisible({ timeout: 15000 });
    await expect(b).toBeEnabled();
  });

  test("F4. Follow button shows count", async ({ page }) => {
    const b = page.getByRole("button", { name: /follow|following/i }).first();
    await expect(b).toBeVisible({ timeout: 15000 });
    const text = await b.innerText();
    expect(/\\d+/.test(text)).toBe(true);
  });

  test("F5. clicking Follow toggles state", async ({ page }) => {
    const b = page.getByRole("button", { name: /follow|following/i }).first();
    await expect(b).toBeVisible({ timeout: 15000 });
    const before = (await b.innerText()).toLowerCase();
    const wasFollowing = before.includes("following");
    const apiCall = page.waitForResponse(
      (r) => r.url().includes("/api/artists/") && r.url().includes("/follow") && r.request().method() === "POST",
      { timeout: 10000 }
    ).catch(() => null);
    await b.click();
    const resp = await apiCall;
    await page.waitForTimeout(600);
    const after = (await b.innerText()).toLowerCase();
    expect(after.includes("following")).toBe(!wasFollowing);
    if (resp) expect(resp.status()).toBeLessThan(500);
    await b.click();
    await page.waitForTimeout(500);
  });

  test("F7. unauth API returns 401/307", async ({ request }) => {
    const res = await request.post("/api/artists/" + TEST_ARTIST_SLUG + "/follow", {
      data: { following: true },
      headers: { "Content-Type": "application/json" },
    });
    expect([401, 403, 307]).toContain(res.status());
  });
});

// ============================================================
//  Venue follow
// ============================================================
test.describe("Follow System — Venue", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_VENUE_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
    if (page.url().includes("/login")) test.skip(true, "Auth required");
  });

  test("V1. venue profile loads", async ({ page }) => {
    expect(page.url()).toContain("/venue/");
  });

  test("V2. venue Follow button exists", async ({ page }) => {
    const b = page.getByRole("button", { name: /follow|following/i }).first();
    await expect(b).toBeVisible({ timeout: 15000 });
    await expect(b).toBeEnabled();
  });

  test("V3. venue Follow button shows count", async ({ page }) => {
    const b = page.getByRole("button", { name: /follow|following/i }).first();
    await expect(b).toBeVisible({ timeout: 15000 });
    const text = await b.innerText();
    expect(/\\d+/.test(text)).toBe(true);
  });

  test("V4. clicking venue Follow toggles state", async ({ page }) => {
    const b = page.getByRole("button", { name: /follow|following/i }).first();
    await expect(b).toBeVisible({ timeout: 15000 });
    const before = (await b.innerText()).toLowerCase();
    const wasFollowing = before.includes("following");
    const apiCall = page.waitForResponse(
      (r) => r.url().includes("/api/follows/") && r.request().method() === "POST",
      { timeout: 10000 }
    ).catch(() => null);
    await b.click();
    const resp = await apiCall;
    await page.waitForTimeout(600);
    const after = (await b.innerText()).toLowerCase();
    expect(after.includes("following")).toBe(!wasFollowing);
    if (resp) expect(resp.status()).toBeLessThan(500);
    await b.click();
    await page.waitForTimeout(500);
  });

  test("V5. unauth venue API returns 401", async ({ request }) => {
    const res = await request.post("/api/follows/toggle", {
      data: { targetType: "venue", targetId: TEST_VENUE_SLUG },
      headers: { "Content-Type": "application/json" },
    });
    expect([401, 403, 307]).toContain(res.status());
  });
});
`);

console.log("");
console.log("All files written.");
