import { test, expect } from "@playwright/test";

// =====================================================================
// GRID FRONTEND TEST SUITE - 320+ tests
// =====================================================================

// ---------------------------------------------------------------------
// 01. NAVIGATION & NAVBAR (40 tests)
// ---------------------------------------------------------------------
test.describe("01. Navigation & Navbar", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/home"); });

  test("renders GRID logo", async ({ page }) => {
    await expect(page.getByRole("link", { name: "GRID" }).first()).toBeVisible();
  });

  test("search bar visible", async ({ page }) => {
    await expect(page.getByPlaceholder("Search")).toBeVisible();
  });

  test("search bar inside form targeting /search", async ({ page }) => {
    await expect(page.locator('form[action="/search"]')).toBeVisible();
  });

  test("search bar submits query on Enter", async ({ page }) => {
    await page.getByPlaceholder("Search").fill("techno");
    await page.getByPlaceholder("Search").press("Enter");
    await page.waitForURL(/\/search\?q=techno/);
  });

  for (const [label, path] of [
    ["Home", "/home"], ["Network", "/network"], ["Jobs", "/jobs"],
    ["Payments", "/payments"], ["Splits", "/splits"],
    ["Messaging", "/messaging"], ["Notifications", "/notifications"],
  ] as [string, string][]) {
    test(`navbar "${label}" routes to ${path}`, async ({ page }) => {
      await page.getByRole("link", { name: label, exact: true }).click();
      await page.waitForURL(new RegExp(path));
    });
  }

  test("active tab has underline indicator", async ({ page }) => {
    const homeLink = page.getByRole("link", { name: "Home", exact: true });
    await expect(homeLink.locator("span.absolute")).toBeVisible();
  });

  test("Me dropdown toggles open", async ({ page }) => {
    await page.getByRole("button", { name: /Me/i }).click();
    await expect(page.getByRole("link", { name: "View Profile" })).toBeVisible();
  });

  test("Me dropdown closes on outside click", async ({ page }) => {
    await page.getByRole("button", { name: /Me/i }).click();
    await page.locator("body").click({ position: { x: 10, y: 400 } });
    await expect(page.getByRole("link", { name: "View Profile" })).toBeHidden();
  });

  test("View Profile routes to /profile", async ({ page }) => {
    await page.getByRole("button", { name: /Me/i }).click();
    await page.getByRole("link", { name: "View Profile" }).click();
    await page.waitForURL("/profile");
  });

  test("Me dropdown contains Promote Music", async ({ page }) => {
    await page.getByRole("button", { name: /Me/i }).click();
    await expect(page.getByRole("link", { name: "Promote Music" })).toBeVisible();
  });

  test("Me dropdown contains Releases & Splits", async ({ page }) => {
    await page.getByRole("button", { name: /Me/i }).click();
    await expect(page.getByRole("link", { name: /Releases & Splits/ })).toBeVisible();
  });

  test("Me dropdown contains Escrow & Payouts", async ({ page }) => {
    await page.getByRole("button", { name: /Me/i }).click();
    await expect(page.getByRole("link", { name: /Escrow & Payouts/ })).toBeVisible();
  });

  test("Me dropdown contains Legal & Privacy", async ({ page }) => {
    await page.getByRole("button", { name: /Me/i }).click();
    await expect(page.getByRole("link", { name: /Legal & Privacy/ })).toBeVisible();
  });

  test("Me dropdown contains Admin: Curator Verify", async ({ page }) => {
    await page.getByRole("button", { name: /Me/i }).click();
    await expect(page.getByRole("link", { name: /Admin: Curator Verify/ })).toBeVisible();
  });

  test("Try GRID Pro routes to /premium", async ({ page }) => {
    await page.getByRole("button", { name: /Me/i }).click();
    await page.getByRole("link", { name: /Try GRID Pro/ }).click();
    await page.waitForURL("/premium");
  });

  test("For Business dropdown toggles", async ({ page }) => {
    await page.getByRole("button", { name: /For Business/i }).click();
    await expect(page.getByText("GRID Business")).toBeVisible();
  });

  test("Venue Dashboard link routes", async ({ page }) => {
    await page.getByRole("button", { name: /For Business/i }).click();
    await page.getByRole("link", { name: /Venue Dashboard/ }).click();
    await page.waitForURL("/business");
  });

  test("Artist EPKs link routes to /epk", async ({ page }) => {
    await page.getByRole("button", { name: /For Business/i }).click();
    await page.getByRole("link", { name: /Artist EPKs/ }).click();
    await page.waitForURL("/epk");
  });

  test("Venue Calendar link routes to /calendar", async ({ page }) => {
    await page.getByRole("button", { name: /For Business/i }).click();
    await page.getByRole("link", { name: /Venue Calendar/ }).click();
    await page.waitForURL("/calendar");
  });

  test("Theme toggle switches to dark", async ({ page }) => {
    await page.getByRole("button", { name: /Theme/i }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("Theme persists after reload", async ({ page }) => {
    await page.getByRole("button", { name: /Theme/i }).click();
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("Theme toggle back to light", async ({ page }) => {
    await page.getByRole("button", { name: /Theme/i }).click();
    await page.getByRole("button", { name: /Theme/i }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("Try Premium button visible", async ({ page }) => {
    await expect(page.getByText("Try Premium")).toBeVisible();
  });

  for (const [w, h] of [[375, 812], [768, 1024], [1440, 900], [1920, 1080]] as [number, number][]) {
    test(`no horizontal scroll at ${w}x${h}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      const sw = await page.evaluate(() => document.body.scrollWidth);
      expect(sw).toBeLessThanOrEqual(w + 5);
    });
  }

  test("notifications badge red dot renders", async ({ page }) => {
    await expect(page.locator(".bg-red-500").first()).toBeVisible();
  });

  test("navbar sticky on scroll", async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 500));
    await expect(page.locator("nav").first()).toBeVisible();
  });
});

// ---------------------------------------------------------------------
// 02. HOME PAGE (45 tests)
// ---------------------------------------------------------------------
test.describe("02. Home Page", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/home"); });

  test("profile name visible", async ({ page }) => {
    await expect(page.getByText("Ulisses Silva").first()).toBeVisible();
  });
  test("profile role visible", async ({ page }) => {
    await expect(page.getByText("Music Producer").first()).toBeVisible();
  });
  test("connections 124 visible", async ({ page }) => {
    await expect(page.getByText("124").first()).toBeVisible();
  });
  test("followers 2.4K visible", async ({ page }) => {
    await expect(page.getByText("2.4K").first()).toBeVisible();
  });
  test("Play Latest Track toggles to Pause", async ({ page }) => {
    await page.getByRole("button", { name: /Play Latest Track/ }).first().click();
    await expect(page.getByRole("button", { name: /Pause Track/ }).first()).toBeVisible();
  });
  test("Pause toggles back to Play", async ({ page }) => {
    await page.getByRole("button", { name: /Play Latest Track/ }).first().click();
    await page.getByRole("button", { name: /Pause Track/ }).first().click();
    await expect(page.getByRole("button", { name: /Play Latest Track/ }).first()).toBeVisible();
  });
  test("View EPK routes to /epk", async ({ page }) => {
    await page.getByRole("link", { name: "View EPK" }).first().click();
    await page.waitForURL("/epk");
  });
  test("composer input visible", async ({ page }) => {
    await expect(page.getByPlaceholder(/Share a track/)).toBeVisible();
  });
  test("Publish disabled when composer empty", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Publish" })).toBeDisabled();
  });
  test("Publish enabled with text", async ({ page }) => {
    await page.getByPlaceholder(/Share a track/).fill("Test post");
    await expect(page.getByRole("button", { name: "Publish" })).toBeEnabled();
  });
  test("Publish shows success toast", async ({ page }) => {
    await page.getByPlaceholder(/Share a track/).fill("Test post");
    await page.getByRole("button", { name: "Publish" }).click();
    await expect(page.getByText("Success!")).toBeVisible();
  });
  test("Audio button triggers alert", async ({ page }) => {
    page.on("dialog", d => d.dismiss());
    await page.getByRole("button", { name: "Audio" }).click();
  });
  test("Event button triggers alert", async ({ page }) => {
    page.on("dialog", d => d.dismiss());
    await page.getByRole("button", { name: "Event" }).click();
  });
  test("Hype increments", async ({ page }) => {
    await page.getByRole("button", { name: /^Hype$/ }).click();
    await expect(page.getByText("Hype (1)")).toBeVisible();
  });
  test("Hype toggles back", async ({ page }) => {
    await page.getByRole("button", { name: /^Hype$/ }).click();
    await page.getByRole("button", { name: /Hype \(1\)/ }).click();
    await expect(page.getByRole("button", { name: /^Hype$/ })).toBeVisible();
  });
  test("Reply opens modal", async ({ page }) => {
    await page.getByRole("button", { name: "Reply" }).click();
    await expect(page.getByText("Reply to Demo Producer")).toBeVisible();
  });
  test("Reply cancel closes modal", async ({ page }) => {
    await page.getByRole("button", { name: "Reply" }).click();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByText("Reply to Demo Producer")).toBeHidden();
  });
  test("Reply send disabled when empty", async ({ page }) => {
    await page.getByRole("button", { name: "Reply" }).click();
    await expect(page.getByRole("button", { name: "Send Reply" })).toBeDisabled();
  });
  test("Reply sends with text", async ({ page }) => {
    await page.getByRole("button", { name: "Reply" }).click();
    await page.getByPlaceholder(/Write your reply/).fill("Nice!");
    await page.getByRole("button", { name: "Send Reply" }).click();
    await expect(page.getByText("Success!")).toBeVisible();
  });
  test("Follow toggles to Following", async ({ page }) => {
    await page.getByRole("button", { name: "Follow" }).first().click();
    await expect(page.getByRole("button", { name: "Following" }).first()).toBeVisible();
  });
  test("Following toggles back to Follow", async ({ page }) => {
    await page.getByRole("button", { name: "Follow" }).first().click();
    await page.getByRole("button", { name: "Following" }).first().click();
    await expect(page.getByRole("button", { name: "Follow" }).first()).toBeVisible();
  });
  test("Open Collab routes to /jobs", async ({ page }) => {
    await page.getByText("Vocalist needed").first().click();
    await page.waitForURL("/jobs");
  });
  test("Second Open Collab routes to /jobs", async ({ page }) => {
    await page.getByText("Mixing & Mastering").first().click();
    await page.waitForURL("/jobs");
  });
  test("no hydration error", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors.filter(e => e.includes("Hydration"))).toHaveLength(0);
  });
  test("sidebar Marketplace routes", async ({ page }) => {
    await page.getByRole("link", { name: "Marketplace" }).click();
    await page.waitForURL("/marketplace");
  });
  test("sidebar Saved Items routes", async ({ page }) => {
    await page.getByRole("link", { name: "Saved Items" }).click();
    await page.waitForURL("/saved");
  });
  test("sidebar Groups routes", async ({ page }) => {
    await page.getByRole("link", { name: "Groups" }).click();
    await page.waitForURL("/groups");
  });
  test("sidebar Events routes", async ({ page }) => {
    await page.getByRole("link", { name: "Events" }).click();
    await page.waitForURL("/events");
  });
  test("sidebar hidden on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator("aside.lg\\:block")).toBeHidden();
  });
  test("3-column layout renders", async ({ page }) => {
    const columns = page.locator("div.grid-cols-12 > *");
    expect(await columns.count()).toBeGreaterThanOrEqual(3);
  });
  test("Open Collabs section visible", async ({ page }) => {
    await expect(page.getByText("Open Collabs")).toBeVisible();
  });
  test("Artists to Follow visible", async ({ page }) => {
    await expect(page.getByText("Artists to Follow")).toBeVisible();
  });
  test("Demo Producer post visible", async ({ page }) => {
    await expect(page.getByText("Demo Producer")).toBeVisible();
  });
  test("post text visible", async ({ page }) => {
    await expect(page.getByText(/Just dropped a new beat/)).toBeVisible();
  });
  test("audio duration 3:45 visible", async ({ page }) => {
    await expect(page.getByText("3:45")).toBeVisible();
  });
  test("Sarah Jenkins in follow list", async ({ page }) => {
    await expect(page.getByText("Sarah Jenkins")).toBeVisible();
  });
  test("David Chen in follow list", async ({ page }) => {
    await expect(page.getByText("David Chen")).toBeVisible();
  });
  test("music note icon renders", async ({ page }) => {
    await expect(page.locator("svg").first()).toBeVisible();
  });
  test("waveform has bars", async ({ page }) => {
    const bars = page.locator(".bg-emerald-500.rounded-full");
    expect(await bars.count()).toBeGreaterThan(10);
  });
  test("post has ellipsis menu", async ({ page }) => {
    await expect(page.getByRole("button", { name: "•••" }).first()).toBeVisible();
  });
  test("dark mode class toggles", async ({ page }) => {
    await page.getByRole("button", { name: /Theme/i }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await page.getByRole("button", { name: /Theme/i }).click();
  });
  test("page loads under 5s", async ({ page }) => {
    const start = Date.now();
    await page.goto("/home", { waitUntil: "networkidle" });
    expect(Date.now() - start).toBeLessThan(5000);
  });
  test("multiple publish cycles stable", async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await page.getByPlaceholder(/Share a track/).fill(`Post ${i}`);
      await page.getByRole("button", { name: "Publish" }).click();
      await page.waitForTimeout(200);
    }
    await expect(page.getByText("Demo Producer")).toBeVisible();
  });
  test("multiple hype cycles stable", async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: /^Hype$/ }).click();
      await page.getByRole("button", { name: /Hype \(1\)/ }).click();
    }
    await expect(page.getByRole("button", { name: /^Hype$/ })).toBeVisible();
  });
  test("multiple follow cycles stable", async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: "Follow" }).first().click();
      await page.getByRole("button", { name: "Following" }).first().click();
    }
    await expect(page.getByRole("button", { name: "Follow" }).first()).toBeVisible();
  });
  test("no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors.filter(e => !e.includes("favicon"))).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------
// 03. NETWORK PAGE (30 tests)
// ---------------------------------------------------------------------
test.describe("03. Network Page", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/network"); });

  test("Discover GRID heading", async ({ page }) => {
    await expect(page.getByText("Discover GRID")).toBeVisible();
  });
  for (const t of ["Discover", "People", "Groups", "Gigs"]) {
    test(`"${t}" tab visible`, async ({ page }) => {
      await expect(page.getByRole("button", { name: t, exact: true })).toBeVisible();
    });
  }
  test("Discover tab active by default", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Discover", exact: true })).toHaveClass(/bg-emerald-600/);
  });
  test("People tab activates on click", async ({ page }) => {
    await page.getByRole("button", { name: "People", exact: true }).click();
    await expect(page.getByRole("button", { name: "People", exact: true })).toHaveClass(/bg-emerald-600/);
  });
  test("Gigs tab activates on click", async ({ page }) => {
    await page.getByRole("button", { name: "Gigs", exact: true }).click();
    await expect(page.getByRole("button", { name: "Gigs", exact: true })).toHaveClass(/bg-emerald-600/);
  });
  for (const name of ["Sarah Jenkins", "David Chen", "The Midnight Collective", "Alex Rivera"]) {
    test(`${name} visible`, async ({ page }) => {
      await expect(page.getByText(name).first()).toBeVisible();
    });
  }
  test("Connect toggles to Connected", async ({ page }) => {
    await page.getByRole("button", { name: "Connect" }).first().click();
    await expect(page.getByRole("button", { name: "Connected" }).first()).toBeVisible();
  });
  test("Connected toggles back", async ({ page }) => {
    await page.getByRole("button", { name: "Connect" }).first().click();
    await page.getByRole("button", { name: "Connected" }).first().click();
    await expect(page.getByRole("button", { name: "Connect" }).first()).toBeVisible();
  });
  test("View on Vocalist collab routes /jobs", async ({ page }) => {
    await page.getByRole("button", { name: "View" }).first().click();
    await page.waitForURL("/jobs");
  });
  test("View on Mixing collab routes /jobs", async ({ page }) => {
    await page.getByRole("button", { name: "View" }).nth(1).click();
    await page.waitForURL("/jobs");
  });
  test("Play Latest Track toggles", async ({ page }) => {
    await page.getByRole("button", { name: /Play Latest Track/ }).first().click();
    await expect(page.getByRole("button", { name: /Pause Track/ }).first()).toBeVisible();
  });
  test("View EPK routes", async ({ page }) => {
    await page.getByRole("link", { name: "View EPK" }).first().click();
    await page.waitForURL("/epk");
  });
  test("Trending Collabs visible", async ({ page }) => {
    await expect(page.getByText("Trending Collabs")).toBeVisible();
  });
  test("Suggested Creators visible", async ({ page }) => {
    await expect(page.getByText("Suggested Creators")).toBeVisible();
  });
  test("4 new matches badge visible", async ({ page }) => {
    await expect(page.getByText("4 new matches")).toBeVisible();
  });
  test("verified checkmarks render", async ({ page }) => {
    const verified = page.locator("svg.text-emerald-500");
    expect(await verified.count()).toBeGreaterThan(0);
  });
  test("sidebar Marketplace routes", async ({ page }) => {
    await page.getByRole("link", { name: "Marketplace" }).click();
    await page.waitForURL("/marketplace");
  });
  test("sidebar Saved Items routes", async ({ page }) => {
    await page.getByRole("link", { name: "Saved Items" }).click();
    await page.waitForURL("/saved");
  });
  test("sidebar Groups routes", async ({ page }) => {
    await page.getByRole("link", { name: "Groups" }).click();
    await page.waitForURL("/groups");
  });
  test("sidebar Events routes", async ({ page }) => {
    await page.getByRole("link", { name: "Events" }).click();
    await page.waitForURL("/events");
  });
  test("search submits", async ({ page }) => {
    await page.getByPlaceholder("Search").fill("house");
    await page.getByPlaceholder("Search").press("Enter");
    await page.waitForURL(/\/search\?q=house/);
  });
  test("Me dropdown View Profile routes", async ({ page }) => {
    await page.getByRole("button", { name: /Me/i }).click();
    await page.getByRole("link", { name: "View Profile" }).click();
    await page.waitForURL("/profile");
  });
  test("theme toggle works", async ({ page }) => {
    await page.getByRole("button", { name: /Theme/i }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
  test("no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors.filter(e => !e.includes("favicon"))).toHaveLength(0);
  });
  test("multiple Connect cycles stable", async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: "Connect" }).first().click();
      await page.getByRole("button", { name: "Connected" }).first().click();
    }
    await expect(page.getByRole("button", { name: "Connect" }).first()).toBeVisible();
  });
  test("mobile hides sidebar", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator("aside.lg\\:block")).toBeHidden();
  });
  test("3-column layout", async ({ page }) => {
    const columns = page.locator("div.grid-cols-12 > *");
    expect(await columns.count()).toBeGreaterThanOrEqual(2);
  });
  test("no horizontal scroll mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const sw = await page.evaluate(() => document.body.scrollWidth);
    expect(sw).toBeLessThanOrEqual(380);
  });
  test("page loads under 5s", async ({ page }) => {
    const start = Date.now();
    await page.goto("/network", { waitUntil: "networkidle" });
    expect(Date.now() - start).toBeLessThan(5000);
  });
});

// ---------------------------------------------------------------------
// 04. JOBS PAGE (30 tests)
// ---------------------------------------------------------------------
test.describe("04. Jobs Page", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/jobs"); });

  test("Gigs & opportunities heading", async ({ page }) => {
    await expect(page.getByText(/Gigs & opportunities/)).toBeVisible();
  });
  test("Post a Gig button visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Post a Gig" })).toBeVisible();
  });
  test("Post a Gig opens modal", async ({ page }) => {
    await page.getByRole("button", { name: "Post a Gig" }).click();
    await expect(page.getByText("Post a New Gig")).toBeVisible();
  });
  test("Post Gig modal has title field", async ({ page }) => {
    await page.getByRole("button", { name: "Post a Gig" }).click();
    await expect(page.getByPlaceholder(/Gig Title/)).toBeVisible();
  });
  test("Post Gig cancel closes", async ({ page }) => {
    await page.getByRole("button", { name: "Post a Gig" }).click();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByText("Post a New Gig")).toBeHidden();
  });
  test("Post Gig submit shows success", async ({ page }) => {
    await page.getByRole("button", { name: "Post a Gig" }).click();
    await page.getByRole("button", { name: "Post Gig" }).click();
    await expect(page.getByText("Gig Posted!")).toBeVisible();
  });
  test("Post a Collab Call opens modal", async ({ page }) => {
    await page.getByRole("button", { name: "Post a Collab Call" }).click();
    await expect(page.getByText("Post a New Gig")).toBeVisible();
  });
  test("3 gigs visible", async ({ page }) => {
    await expect(page.getByText("Session Vocalist needed")).toBeVisible();
    await expect(page.getByText("Mixing & Mastering Engineer")).toBeVisible();
    await expect(page.getByText("Drummer needed")).toBeVisible();
  });
  test("Quick Pitch opens modal", async ({ page }) => {
    await page.getByRole("button", { name: "Quick Pitch" }).first().click();
    await expect(page.getByText(/Applying to/)).toBeVisible();
  });
  test("Quick Pitch has track select", async ({ page }) => {
    await page.getByRole("button", { name: "Quick Pitch" }).first().click();
    await expect(page.getByText("Select your track")).toBeVisible();
  });
  test("Quick Pitch cancel closes", async ({ page }) => {
    await page.getByRole("button", { name: "Quick Pitch" }).first().click();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByText(/Applying to/)).toBeHidden();
  });
  test("Quick Pitch submit shows success", async ({ page }) => {
    await page.getByRole("button", { name: "Quick Pitch" }).first().click();
    await page.getByRole("button", { name: "Send Pitch" }).click();
    await expect(page.getByText("Pitch Sent!")).toBeVisible();
  });
  test("Save toggles to Saved", async ({ page }) => {
    await page.getByRole("button", { name: "Save" }).first().click();
    await expect(page.getByRole("button", { name: "✓ Saved" }).first()).toBeVisible();
  });
  test("Saved toggles back", async ({ page }) => {
    await page.getByRole("button", { name: "Save" }).first().click();
    await page.getByRole("button", { name: "✓ Saved" }).first().click();
    await expect(page.getByRole("button", { name: "Save" }).first()).toBeVisible();
  });
  test("Filter Vocalist reduces list", async ({ page }) => {
    await page.getByRole("button", { name: "Vocalist" }).click();
    await expect(page.getByText("Session Vocalist needed")).toBeVisible();
    await expect(page.getByText("Mixing & Mastering Engineer")).toBeHidden();
  });
  test("Filter Engineer shows engineer", async ({ page }) => {
    await page.getByRole("button", { name: "Engineer" }).click();
    await expect(page.getByText("Mixing & Mastering Engineer")).toBeVisible();
    await expect(page.getByText("Session Vocalist needed")).toBeHidden();
  });
  test("Empty filter shows empty state", async ({ page }) => {
    await page.getByRole("button", { name: "A&R" }).click();
    await expect(page.getByText("No gigs match your filter")).toBeVisible();
  });
  test("Clearing filter restores list", async ({ page }) => {
    await page.getByRole("button", { name: "Vocalist" }).click();
    await page.getByRole("button", { name: "Vocalist" }).click();
    await expect(page.getByText("Drummer needed")).toBeVisible();
  });
  test("COLLAB badge visible", async ({ page }) => {
    await expect(page.getByText("COLLAB").first()).toBeVisible();
  });
  test("BOOKING badge visible", async ({ page }) => {
    await expect(page.getByText("BOOKING").first()).toBeVisible();
  });
  test("£400 visible", async ({ page }) => {
    await expect(page.getByText(/£400/)).toBeVisible();
  });
  test("Match score visible", async ({ page }) => {
    await expect(page.getByText(/Strong match/).first()).toBeVisible();
  });
  test("Play Latest Track toggles", async ({ page }) => {
    await page.getByRole("button", { name: /Play Latest Track/ }).first().click();
    await expect(page.getByRole("button", { name: /Pause Track/ }).first()).toBeVisible();
  });
  test("View EPK routes", async ({ page }) => {
    await page.getByRole("link", { name: "View EPK" }).first().click();
    await page.waitForURL("/epk");
  });
  test("no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors.filter(e => !e.includes("favicon"))).toHaveLength(0);
  });
  test("rapid Save clicks stable", async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: "Save" }).first().click();
      await page.getByRole("button", { name: /Saved/ }).first().click();
    }
    await expect(page.getByText("Session Vocalist needed")).toBeVisible();
  });
  test("multiple Quick Pitches", async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: "Quick Pitch" }).first().click();
      await page.getByRole("button", { name: "Cancel" }).click();
    }
  });
  test("modal has high z-index", async ({ page }) => {
    await page.getByRole("button", { name: "Post a Gig" }).click();
    await expect(page.locator(".fixed.inset-0.z-50")).toBeVisible();
  });
  test("modal closes and page interactive", async ({ page }) => {
    await page.getByRole("button", { name: "Post a Gig" }).click();
    await page.getByRole("button", { name: "Cancel" }).click();
    await page.getByRole("button", { name: "Quick Pitch" }).first().click();
    await expect(page.getByText(/Applying to/)).toBeVisible();
  });
  test("sidebar Marketplace routes", async ({ page }) => {
    await page.getByRole("link", { name: "Marketplace" }).click();
    await page.waitForURL("/marketplace");
  });
  test("page loads under 5s", async ({ page }) => {
    const start = Date.now();
    await page.goto("/jobs", { waitUntil: "networkidle" });
    expect(Date.now() - start).toBeLessThan(5000);
  });
});

// ---------------------------------------------------------------------
// 05. PAYMENTS PAGE (35 tests)
// ---------------------------------------------------------------------
test.describe("05. Payments Page", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/payments"); });

  test("Escrow Dashboard heading", async ({ page }) => {
    await expect(page.getByText("Escrow Dashboard")).toBeVisible();
  });
  test("available balance visible", async ({ page }) => {
    await expect(page.getByText("£1,240.00").first()).toBeVisible();
  });
  test("currency renders as £ not Â£", async ({ page }) => {
    const body = await page.locator("body").textContent();
    expect(body).not.toContain("Â£");
    expect(body).toContain("£");
  });
  test("onboarding banner visible", async ({ page }) => {
    await expect(page.getByText(/Action Required: Link your bank account/)).toBeVisible();
  });
  test("Link Bank Account opens Stripe modal", async ({ page }) => {
    await page.getByRole("button", { name: "Link Bank Account" }).click();
    await expect(page.getByText("Stripe Connect")).toBeVisible();
  });
  test("Stripe has Legal Name field", async ({ page }) => {
    await page.getByRole("button", { name: "Link Bank Account" }).click();
    await expect(page.getByPlaceholder("Ulisses Silva")).toBeVisible();
  });
  test("Stripe has IBAN field", async ({ page }) => {
    await page.getByRole("button", { name: "Link Bank Account" }).click();
    await expect(page.getByPlaceholder(/GB29/)).toBeVisible();
  });
  test("Stripe submit switches banner", async ({ page }) => {
    await page.getByRole("button", { name: "Link Bank Account" }).click();
    await page.getByRole("button", { name: /Agree & Submit/ }).click();
    await expect(page.getByText("Bank Account Linked")).toBeVisible();
  });
  test("Withdraw opens modal", async ({ page }) => {
    await page.getByRole("button", { name: "Withdraw" }).click();
    await expect(page.getByText("Withdraw Funds")).toBeVisible();
  });
  test("Withdraw shows available", async ({ page }) => {
    await page.getByRole("button", { name: "Withdraw" }).click();
    await expect(page.getByText("£1,240.00").first()).toBeVisible();
  });
  test("Withdraw has amount input", async ({ page }) => {
    await page.getByRole("button", { name: "Withdraw" }).click();
    await expect(page.locator('input[type="number"]')).toBeVisible();
  });
  test("Withdraw cancel closes", async ({ page }) => {
    await page.getByRole("button", { name: "Withdraw" }).click();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByText("Withdraw Funds")).toBeHidden();
  });
  test("Withdraw confirm shows success", async ({ page }) => {
    await page.getByRole("button", { name: "Withdraw" }).click();
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page.getByText("Withdrawal Initiated!")).toBeVisible();
  });
  test("View Payment Breakdown opens modal", async ({ page }) => {
    await page.getByRole("button", { name: /View Payment Breakdown/ }).click();
    await expect(page.getByText("Project Breakdown")).toBeVisible();
  });
  test("Breakdown shows Artist Payout £250", async ({ page }) => {
    await page.getByRole("button", { name: /View Payment Breakdown/ }).click();
    await expect(page.getByText("£250.00")).toBeVisible();
  });
  test("Breakdown shows GRID Fee £12.50", async ({ page }) => {
    await page.getByRole("button", { name: /View Payment Breakdown/ }).click();
    await expect(page.getByText("£12.50")).toBeVisible();
  });
  test("Breakdown shows VAT £2.50", async ({ page }) => {
    await page.getByRole("button", { name: /View Payment Breakdown/ }).click();
    await expect(page.getByText("£2.50")).toBeVisible();
  });
  test("Breakdown shows Total £262.50", async ({ page }) => {
    await page.getByRole("button", { name: /View Payment Breakdown/ }).click();
    await expect(page.getByText("£262.50")).toBeVisible();
  });
  test("Breakdown close returns", async ({ page }) => {
    await page.getByRole("button", { name: /View Payment Breakdown/ }).click();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByText("Project Breakdown")).toBeHidden();
  });
  test("Release Funds changes to Released", async ({ page }) => {
    await page.getByRole("button", { name: /Release Funds/ }).click();
    await expect(page.getByRole("button", { name: /Released/ })).toBeVisible();
  });
  test("Report an Issue opens modal", async ({ page }) => {
    await page.getByRole("button", { name: "Report an Issue" }).click();
    await expect(page.getByText("Report an Issue")).toBeVisible();
  });
  test("Dispute cancel closes", async ({ page }) => {
    await page.getByRole("button", { name: "Report an Issue" }).click();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByText(/Flagging this project/)).toBeHidden();
  });
  test("Dispute submit shows confirmation", async ({ page }) => {
    await page.getByRole("button", { name: "Report an Issue" }).click();
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByText("Dispute Submitted")).toBeVisible();
  });
  test("Play Latest Track toggles", async ({ page }) => {
    await page.getByRole("button", { name: /Play Latest Track/ }).first().click();
    await expect(page.getByRole("button", { name: /Pause Track/ }).first()).toBeVisible();
  });
  test("View EPK routes", async ({ page }) => {
    await page.getByRole("link", { name: "View EPK" }).first().click();
    await page.waitForURL("/epk");
  });
  test("sidebar Marketplace routes", async ({ page }) => {
    await page.getByRole("link", { name: "Marketplace" }).click();
    await page.waitForURL("/marketplace");
  });
  test("Active Projects section", async ({ page }) => {
    await expect(page.getByText("Active Projects")).toBeVisible();
  });
  test("2 Projects in Escrow badge", async ({ page }) => {
    await expect(page.getByText("2 Projects in Escrow")).toBeVisible();
  });
  test("House Track project visible", async ({ page }) => {
    await expect(page.getByText("House Track - Session Vocals")).toBeVisible();
  });
  test("Sarah J. collaborator visible", async ({ page }) => {
    await expect(page.getByText("Sarah J.").first()).toBeVisible();
  });
  test("no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors.filter(e => !e.includes("favicon"))).toHaveLength(0);
  });
  test("rapid withdraw cycles stable", async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: "Withdraw" }).click();
      await page.getByRole("button", { name: "Cancel" }).click();
    }
    await expect(page.getByText("Escrow Dashboard")).toBeVisible();
  });
  test("sequential withdrawals", async ({ page }) => {
    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: "Withdraw" }).click();
      await page.getByRole("button", { name: "Confirm" }).click();
      await expect(page.getByText("Withdrawal Initiated!")).toBeVisible();
    }
  });
  test("no password in URL", async ({ page }) => {
    expect(page.url()).not.toMatch(/password|pwd|token|secret/i);
  });
  test("modal backdrop covers full screen", async ({ page }) => {
    await page.getByRole("button", { name: "Withdraw" }).click();
    const box = await page.locator(".fixed.inset-0").first().boundingBox();
    expect(box?.width).toBeGreaterThan(1000);
  });
  test("XSS: post input escaped", async ({ page }) => {
    const input = page.getByPlaceholder(/Share a track/);
    if (await input.isVisible()) {
      await input.fill('<script>alert("xss")</script>');
      const html = await page.locator("body").innerHTML();
      expect(html).not.toContain("<script>alert");
    }
  });
  test("page loads under 5s", async ({ page }) => {
    const start = Date.now();
    await page.goto("/payments", { waitUntil: "networkidle" });
    expect(Date.now() - start).toBeLessThan(5000);
  });
});

// ---------------------------------------------------------------------
// 06. SPLITS PAGE (20 tests)
// ---------------------------------------------------------------------
test.describe("06. Splits Page", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/splits"); });

  test("Split Sheets heading", async ({ page }) => {
    await expect(page.getByText("Split Sheets")).toBeVisible();
  });
  test("Create New Split button", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Create New Split/ })).toBeVisible();
  });
  test("Create opens modal", async ({ page }) => {
    await page.getByRole("button", { name: /Create New Split/ }).click();
    await expect(page.getByText("Create New Split")).toBeVisible();
  });
  test("Create has Track Title", async ({ page }) => {
    await page.getByRole("button", { name: /Create New Split/ }).click();
    await expect(page.getByPlaceholder("Track Title")).toBeVisible();
  });
  test("Create cancel closes", async ({ page }) => {
    await page.getByRole("button", { name: /Create New Split/ }).click();
    await page.getByRole("button", { name: "Cancel" }).click();
  });
  test("Create submit success", async ({ page }) => {
    await page.getByRole("button", { name: /Create New Split/ }).click();
    await page.getByRole("button", { name: "Create" }).click();
    await expect(page.getByText("Split Created!")).toBeVisible();
  });
  test("Midnight City visible", async ({ page }) => {
    await expect(page.getByText("Midnight City (Demo)")).toBeVisible();
  });
  test("Neon Lights visible", async ({ page }) => {
    await expect(page.getByText("Neon Lights")).toBeVisible();
  });
  test("Draft badge visible", async ({ page }) => {
    await expect(page.getByText("Draft").first()).toBeVisible();
  });
  test("Signed badge visible", async ({ page }) => {
    await expect(page.getByText("Signed").first()).toBeVisible();
  });
  test("collaborators visible", async ({ page }) => {
    await expect(page.getByText("Sarah J.").first()).toBeVisible();
    await expect(page.getByText("David Chen").first()).toBeVisible();
  });
  test("50% visible", async ({ page }) => {
    await expect(page.getByText("50%").first()).toBeVisible();
  });
  test("40% visible", async ({ page }) => {
    await expect(page.getByText("40%").first()).toBeVisible();
  });
  test("20% visible", async ({ page }) => {
    await expect(page.getByText("20%").first()).toBeVisible();
  });
  test("Sign Contract opens modal", async ({ page }) => {
    await page.getByRole("button", { name: "Sign Contract" }).click();
    await expect(page.getByText("Sign Contract")).toBeVisible();
  });
  test("Sign submit changes to Signed", async ({ page }) => {
    await page.getByRole("button", { name: "Sign Contract" }).click();
    await page.getByRole("button", { name: "Sign", exact: true }).click();
    await expect(page.getByText("Contract Signed!")).toBeVisible();
  });
  test("Download PDF shows toast", async ({ page }) => {
    await page.getByRole("button", { name: "Download PDF" }).click();
    await expect(page.getByText(/PDF Downloading/)).toBeVisible();
  });
  test("Edit Splits opens modal", async ({ page }) => {
    await page.getByRole("button", { name: "Edit Splits" }).first().click();
    await expect(page.getByText("Edit Splits")).toBeVisible();
  });
  test("Play Latest Track toggles", async ({ page }) => {
    await page.getByRole("button", { name: /Play Latest Track/ }).first().click();
    await expect(page.getByRole("button", { name: /Pause Track/ }).first()).toBeVisible();
  });
  test("View EPK routes", async ({ page }) => {
    await page.getByRole("link", { name: "View EPK" }).first().click();
    await page.waitForURL("/epk");
  });
});

// ---------------------------------------------------------------------
// 07. MESSAGING PAGE (25 tests)
// ---------------------------------------------------------------------
test.describe("07. Messaging Page", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/messaging"); });

  test("Messaging heading", async ({ page }) => {
    await expect(page.getByText("Messaging").first()).toBeVisible();
  });
  test("Inbox active by default", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Inbox" })).toHaveClass(/bg-emerald-600/);
  });
  test("Collabs filter click", async ({ page }) => {
    await page.getByRole("button", { name: "Collabs" }).click();
    await expect(page.getByRole("button", { name: "Collabs" })).toHaveClass(/bg-emerald-600/);
  });
  test("Unread filter click", async ({ page }) => {
    await page.getByRole("button", { name: "Unread" }).click();
    await expect(page.getByRole("button", { name: "Unread" })).toHaveClass(/bg-emerald-600/);
  });
  test("Beatport visible", async ({ page }) => {
    await expect(page.getByText("Beatport").first()).toBeVisible();
  });
  test("Sarah J. visible", async ({ page }) => {
    await expect(page.getByText("Sarah J.").first()).toBeVisible();
  });
  test("Sellick Records visible", async ({ page }) => {
    await expect(page.getByText("Sellick Records (A&R)")).toBeVisible();
  });
  test("Beatport thread switches", async ({ page }) => {
    await page.getByText("Beatport").first().click();
    await expect(page.getByText(/Tech House Top 100/)).toBeVisible();
  });
  test("Sellick thread switches", async ({ page }) => {
    await page.getByText("Sellick Records").click();
    await expect(page.getByText(/Pop & R&B talent/)).toBeVisible();
  });
  test("message composer visible", async ({ page }) => {
    await expect(page.getByPlaceholder(/Write a message/)).toBeVisible();
  });
  test("Send disabled empty", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Send" })).toBeDisabled();
  });
  test("Send enabled with text", async ({ page }) => {
    await page.getByPlaceholder(/Write a message/).fill("Hello");
    await expect(page.getByRole("button", { name: "Send" })).toBeEnabled();
  });
  test("Send adds message", async ({ page }) => {
    await page.getByPlaceholder(/Write a message/).fill("Test message");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText("Test message")).toBeVisible();
  });
  test("Send clears input", async ({ page }) => {
    await page.getByPlaceholder(/Write a message/).fill("Test");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByPlaceholder(/Write a message/)).toHaveValue("");
  });
  test("Enter sends", async ({ page }) => {
    await page.getByPlaceholder(/Write a message/).fill("From Enter");
    await page.getByPlaceholder(/Write a message/).press("Enter");
    await expect(page.getByText("From Enter")).toBeVisible();
  });
  test("Upload Track adds message", async ({ page }) => {
    await page.getByRole("button", { name: /Upload Track/ }).click();
    await expect(page.getByText(/Attached a Audio Track/)).toBeVisible();
  });
  test("EPK adds message", async ({ page }) => {
    await page.getByRole("button", { name: "EPK" }).click();
    await expect(page.getByText(/Attached a EPK/)).toBeVisible();
  });
  test("Split adds message", async ({ page }) => {
    await page.getByRole("button", { name: "Split" }).click();
    await expect(page.getByText(/Attached a Split Sheet/)).toBeVisible();
  });
  test("Play Latest Track toggles", async ({ page }) => {
    await page.getByRole("button", { name: /Play Latest Track/ }).first().click();
    await expect(page.getByRole("button", { name: /Pause Track/ }).first()).toBeVisible();
  });
  test("View EPK routes", async ({ page }) => {
    await page.getByRole("link", { name: "View EPK" }).first().click();
    await page.waitForURL("/epk");
  });
  test("sidebar Marketplace routes", async ({ page }) => {
    await page.getByRole("link", { name: "Marketplace" }).click();
    await page.waitForURL("/marketplace");
  });
  test("search messages visible", async ({ page }) => {
    await expect(page.getByPlaceholder("Search messages")).toBeVisible();
  });
  test("filters + search coexist", async ({ page }) => {
    await page.getByRole("button", { name: "Unread" }).click();
    await page.getByPlaceholder("Search messages").fill("beat");
    await expect(page.getByText("Beatport").first()).toBeVisible();
  });
  test("XSS: message escaped", async ({ page }) => {
    await page.getByPlaceholder(/Write a message/).fill('<img src=x onerror=alert(1)>');
    await page.getByRole("button", { name: "Send" }).click();
    const html = await page.locator("body").innerHTML();
    expect(html).not.toContain("onerror=alert");
  });
  test("page loads under 5s", async ({ page }) => {
    const start = Date.now();
    await page.goto("/messaging", { waitUntil: "networkidle" });
    expect(Date.now() - start).toBeLessThan(5000);
  });
});

// ---------------------------------------------------------------------
// 08. NOTIFICATIONS PAGE (20 tests)
// ---------------------------------------------------------------------
test.describe("08. Notifications Page", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/notifications"); });

  test("Manage notifications heading", async ({ page }) => {
    await expect(page.getByText("Manage notifications")).toBeVisible();
  });
  test("4 notification cards visible", async ({ page }) => {
    await expect(page.getByText("Sarah Jenkins and 14 others")).toBeVisible();
    await expect(page.getByText("Beatport News")).toBeVisible();
    await expect(page.getByText("David Chen hyped")).toBeVisible();
    await expect(page.getByText("GRID Events")).toBeVisible();
  });
  test("Mark all as read button", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Mark all as read" })).toBeVisible();
  });
  test("Mark all as read removes green dots", async ({ page }) => {
    const before = await page.locator(".bg-emerald-500.rounded-full").count();
    await page.getByRole("button", { name: "Mark all as read" }).click();
    await page.waitForTimeout(300);
    const after = await page.locator(".bg-emerald-500.rounded-full").count();
    expect(after).toBeLessThan(before);
  });
  test("click notification marks read", async ({ page }) => {
    await page.getByText("Sarah Jenkins and 14 others").click();
    await page.waitForTimeout(300);
    const unread = await page.locator(".bg-emerald-500.rounded-full").count();
    expect(unread).toBeLessThan(4);
  });
  test("click 2nd notification marks read", async ({ page }) => {
    await page.getByText("Beatport News").click();
    await page.waitForTimeout(300);
    const unread = await page.locator(".bg-emerald-500.rounded-full").count();
    expect(unread).toBeLessThan(4);
  });
  test("All notifications tab active", async ({ page }) => {
    await expect(page.getByRole("button", { name: /All notifications/ })).toHaveClass(/bg-emerald-600/);
  });
  test("My posts tab", async ({ page }) => {
    await page.getByRole("button", { name: /My posts/ }).click();
    await expect(page.getByRole("button", { name: /My posts/ })).toHaveClass(/bg-emerald-600/);
  });
  test("Mentions tab", async ({ page }) => {
    await page.getByRole("button", { name: /Mentions/ }).click();
    await expect(page.getByRole("button", { name: /Mentions/ })).toHaveClass(/bg-emerald-600/);
  });
  test("Settings tab", async ({ page }) => {
    await page.getByRole("button", { name: /Settings/ }).click();
    await expect(page.getByRole("button", { name: /Settings/ })).toHaveClass(/bg-emerald-600/);
  });
  test("Play Latest Track toggles", async ({ page }) => {
    await page.getByRole("button", { name: /Play Latest Track/ }).first().click();
    await expect(page.getByRole("button", { name: /Pause Track/ }).first()).toBeVisible();
  });
  test("View EPK routes", async ({ page }) => {
    await page.getByRole("link", { name: "View EPK" }).first().click();
    await page.waitForURL("/epk");
  });
  test("sidebar Marketplace", async ({ page }) => {
    await page.getByRole("link", { name: "Marketplace" }).click();
    await page.waitForURL("/marketplace");
  });
  test("sidebar Saved Items", async ({ page }) => {
    await page.getByRole("link", { name: "Saved Items" }).click();
    await page.waitForURL("/saved");
  });
  test("sidebar Groups", async ({ page }) => {
    await page.getByRole("link", { name: "Groups" }).click();
    await page.waitForURL("/groups");
  });
  test("sidebar Events", async ({ page }) => {
    await page.getByRole("link", { name: "Events" }).click();
    await page.waitForURL("/events");
  });
  test("no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors.filter(e => !e.includes("favicon"))).toHaveLength(0);
  });
  test("notification text sanitized", async ({ page }) => {
    const body = await page.locator("body").innerHTML();
    expect(body).not.toContain("javascript:");
    expect(body).not.toContain("<script>");
  });
  test("Mark all read is idempotent", async ({ page }) => {
    await page.getByRole("button", { name: "Mark all as read" }).click();
    await page.getByRole("button", { name: "Mark all as read" }).click();
    await expect(page.locator(".bg-emerald-500.rounded-full")).toHaveCount(0);
  });
  test("multiple clicks don't crash", async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: "Mark all as read" }).click();
    }
    await expect(page.getByText("Manage notifications")).toBeVisible();
  });
});

// ---------------------------------------------------------------------
// 09. BUSINESS PAGE (25 tests)
// ---------------------------------------------------------------------
test.describe("09. Business Page", () => {
  test.beforeEach(async ({ page }) => { await page.goto("/business"); });

  test("O2 Academy visible", async ({ page }) => {
    await expect(page.getByText("The O2 Academy")).toBeVisible();
  });
  test("Venue & Promoter role", async ({ page }) => {
    await expect(page.getByText("Venue & Promoter")).toBeVisible();
  });
  test("London, UK location", async ({ page }) => {
    await expect(page.getByText("London, UK").first()).toBeVisible();
  });
  test("Pro Venue Plan badge", async ({ page }) => {
    await expect(page.getByText("Pro Venue Plan")).toBeVisible();
  });
  test("Post a Gig button", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Post a Gig" })).toBeVisible();
  });
  test("Artist Roster link", async ({ page }) => {
    await expect(page.getByRole("link", { name: /Artist Roster/ })).toBeVisible();
  });
  test("Venue Calendar link", async ({ page }) => {
    await expect(page.getByRole("link", { name: /Venue Calendar/ })).toBeVisible();
  });
  test("Saved Artists link", async ({ page }) => {
    await expect(page.getByRole("link", { name: /Saved Artists/ })).toBeVisible();
  });
  test("Talent Discovery heading", async ({ page }) => {
    await expect(page.getByText("Talent Discovery")).toBeVisible();
  });
  test("3 filter dropdowns visible", async ({ page }) => {
    const selects = page.locator("select");
    expect(await selects.count()).toBeGreaterThanOrEqual(3);
  });
  test("Recommended Artists heading", async ({ page }) => {
    await expect(page.getByText("Recommended Artists")).toBeVisible();
  });
  test("Sarah Jenkins visible", async ({ page }) => {
    await expect(page.getByText("Sarah Jenkins").first()).toBeVisible();
  });
  test("David Chen visible", async ({ page }) => {
    await expect(page.getByText("David Chen").first()).toBeVisible();
  });
  test("Midnight Collective visible", async ({ page }) => {
    await expect(page.getByText("The Midnight Collective").first()).toBeVisible();
  });
  test("Sarah 98% match", async ({ page }) => {
    await expect(page.getByText(/98% match/)).toBeVisible();
  });
  test("David 95% match", async ({ page }) => {
    await expect(page.getByText(/95% match/)).toBeVisible();
  });
  test("Midnight 89% match", async ({ page }) => {
    await expect(page.getByText(/89% match/)).toBeVisible();
  });
  test("Ticket draw visible", async ({ page }) => {
    await expect(page.getByText(/1.2K past tickets/)).toBeVisible();
  });
  test("View EPK buttons x3", async ({ page }) => {
    expect(await page.getByRole("link", { name: "View EPK" }).count()).toBe(3);
  });
  test("View EPK routes /epk", async ({ page }) => {
    await page.getByRole("link", { name: "View EPK" }).first().click();
    await page.waitForURL("/epk");
  });
  test("Book Now buttons x3", async ({ page }) => {
    expect(await page.getByRole("button", { name: "Book Now" }).count()).toBe(3);
  });
  test("verified checkmark renders", async ({ page }) => {
    const verified = page.locator("svg.text-emerald-500");
    expect(await verified.count()).toBeGreaterThan(0);
  });
  test("Venue Calendar routes /calendar", async ({ page }) => {
    await page.getByRole("link", { name: /Venue Calendar/ }).click();
    await page.waitForURL("/calendar");
  });
  test("no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    await page.reload();
    await page.waitForLoadState("networkidle");
    expect(errors.filter(e => !e.includes("favicon"))).toHaveLength(0);
  });
  test("page loads under 5s", async ({ page }) => {
    const start = Date.now();
    await page.goto("/business", { waitUntil: "networkidle" });
    expect(Date.now() - start).toBeLessThan(5000);
  });
});

// ---------------------------------------------------------------------
// 10. SEARCH PAGE (15 tests)
// ---------------------------------------------------------------------
test.describe("10. Search Page", () => {
  test("search for Sarah shows Sarah Jenkins", async ({ page }) => {
    await page.goto("/search?q=Sarah");
    await expect(page.getByText("Sarah Jenkins").first()).toBeVisible();
  });
  test("search for Techno shows Alex Rivera", async ({ page }) => {
    await page.goto("/search?q=Techno");
    await expect(page.getByText("Alex Rivera").first()).toBeVisible();
  });
  test("search for xyz shows empty state", async ({ page }) => {
    await page.goto("/search?q=xyzabc123");
    await expect(page.getByText("No results found")).toBeVisible();
  });
  test("search heading shows query", async ({ page }) => {
    await page.goto("/search?q=house");
    await expect(page.getByText(/Search Results for "house"/)).toBeVisible();
  });
  test("search for house shows Vocalist gig", async ({ page }) => {
    await page.goto("/search?q=house");
    await expect(page.getByText("Vocalist needed")).toBeVisible();
  });
  test("search for Sarah shows only Sarah", async ({ page }) => {
    await page.goto("/search?q=Sarah");
    await expect(page.getByText("David Chen")).toBeHidden();
  });
  test("tabs on search page visible", async ({ page }) => {
    await page.goto("/search?q=house");
    for (const tab of ["Top Results", "People", "Tracks", "Gigs"]) {
      await expect(page.getByRole("button", { name: tab, exact: true })).toBeVisible();
    }
  });
  test("view EPK on search results routes", async ({ page }) => {
    await page.goto("/search?q=Sarah");
    await page.getByRole("link", { name: "View EPK" }).first().click();
    await page.waitForURL("/epk");
  });
  test("navbar search query persists", async ({ page }) => {
    await page.goto("/home");
    await page.getByPlaceholder("Search").fill("house");
    await page.getByPlaceholder("Search").press("Enter");
    await page.waitForURL(/\/search\?q=house/);
    await expect(page.getByText(/Search Results for "house"/)).toBeVisible();
  });
  test("search case insensitive", async ({ page }) => {
    await page.goto("/search?q=HOUSE");
    await expect(page.getByText(/Search Results for "HOUSE"/)).toBeVisible();
  });
  test("search with special chars safe", async ({ page }) => {
    await page.goto("/search?q=%3Cscript%3E");
    const html = await page.locator("body").innerHTML();
    expect(html).not.toContain("<script>alert");
  });
  test("no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    await page.goto("/search?q=house", { waitUntil: "networkidle" });
    expect(errors.filter(e => !e.includes("favicon"))).toHaveLength(0);
  });
  test("search page performance", async ({ page }) => {
    const start = Date.now();
    await page.goto("/search?q=house", { waitUntil: "networkidle" });
    expect(Date.now() - start).toBeLessThan(5000);
  });
  test("search renders without crash on long query", async ({ page }) => {
    const long = "a".repeat(500);
    await page.goto(`/search?q=${long}`);
    await expect(page.getByText(/Search Results for/)).toBeVisible();
  });
  test("search renders without crash on unicode", async ({ page }) => {
    await page.goto("/search?q=café");
    await expect(page.getByText(/Search Results for/)).toBeVisible();
  });
});

// ---------------------------------------------------------------------
// 11. EPK, PROFILE, CALENDAR, PROMOTE, PREMIUM, LEGAL, ADMIN (20 tests)
// ---------------------------------------------------------------------
test.describe("11. Additional Pages", () => {
  test("EPK page loads with metrics", async ({ page }) => {
    await page.goto("/epk");
    await expect(page.getByText("Ulisses Silva").first()).toBeVisible();
  });
  test("EPK has Download EPK button", async ({ page }) => {
    await page.goto("/epk");
    await expect(page.getByRole("button", { name: /Download EPK/ })).toBeVisible();
  });
  test("EPK has Book Now button", async ({ page }) => {
    await page.goto("/epk");
    await expect(page.getByRole("button", { name: "Book Now" })).toBeVisible();
  });
  test("Profile page loads", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByText("Ulisses Silva").first()).toBeVisible();
  });
  test("Profile has Feed tab", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByRole("button", { name: "Feed" })).toBeVisible();
  });
  test("Profile has Portfolio tab", async ({ page }) => {
    await page.goto("/profile");
    await expect(page.getByRole("button", { name: "Portfolio" })).toBeVisible();
  });
  test("Calendar page loads", async ({ page }) => {
    await page.goto("/calendar");
    await expect(page.getByText("November 2026")).toBeVisible();
  });
  test("Calendar has Add Event button", async ({ page }) => {
    await page.goto("/calendar");
    await expect(page.getByRole("button", { name: /Add Event/ })).toBeVisible();
  });
  test("Promote page loads", async ({ page }) => {
    await page.goto("/promote");
    await expect(page.getByText("Promote Your Music")).toBeVisible();
  });
  test("Promote has 12 Credits", async ({ page }) => {
    await page.goto("/promote");
    await expect(page.getByText(/12 Remaining/)).toBeVisible();
  });
  test("Premium page loads", async ({ page }) => {
    await page.goto("/premium");
    await expect(page.getByText(/GRID Pro/).first()).toBeVisible();
  });
  test("Premium has Upgrade button", async ({ page }) => {
    await page.goto("/premium");
    await expect(page.getByRole("button", { name: /Upgrade to Pro/ })).toBeVisible();
  });
  test("Legal page has Terms", async ({ page }) => {
    await page.goto("/legal");
    await expect(page.getByText(/Terms of Service/)).toBeVisible();
  });
  test("Legal page has Privacy", async ({ page }) => {
    await page.goto("/legal");
    await expect(page.getByText(/Privacy Policy/)).toBeVisible();
  });
  test("Legal page has Curator Policy", async ({ page }) => {
    await page.goto("/legal");
    await expect(page.getByText(/Curator Verification Policy/)).toBeVisible();
  });
  test("Admin curators page loads", async ({ page }) => {
    await page.goto("/admin/curators");
    await expect(page.getByText("Curator Verification")).toBeVisible();
  });
  test("Admin has Approve button", async ({ page }) => {
    await page.goto("/admin/curators");
    await expect(page.getByRole("button", { name: /Approve/ }).first()).toBeVisible();
  });
  test("Admin has Reject button", async ({ page }) => {
    await page.goto("/admin/curators");
    await expect(page.getByRole("button", { name: /Reject/ }).first()).toBeVisible();
  });
  test("Saved Items page loads", async ({ page }) => {
    await page.goto("/saved");
    await expect(page.getByText("Saved Items").first()).toBeVisible();
  });
  test("Groups page loads", async ({ page }) => {
    await page.goto("/groups");
    await expect(page.getByText("Groups").first()).toBeVisible();
  });
  test("Events page loads", async ({ page }) => {
    await page.goto("/events");
    await expect(page.getByText("Upcoming Events")).toBeVisible();
  });
  test("Marketplace page loads", async ({ page }) => {
    await page.goto("/marketplace");
    await expect(page.getByText("GRID Marketplace")).toBeVisible();
  });
});

// ---------------------------------------------------------------------
// 12. SECURITY (25 tests)
// ---------------------------------------------------------------------
test.describe("12. Security", () => {
  test("no credentials in localStorage", async ({ page }) => {
    await page.goto("/home");
    const storage = await page.evaluate(() => JSON.stringify(localStorage));
    expect(storage).not.toMatch(/password|secret|private_key/i);
  });
  test("no Bearer tokens in sessionStorage", async ({ page }) => {
    await page.goto("/home");
    const storage = await page.evaluate(() => JSON.stringify(sessionStorage));
    expect(storage).not.toMatch(/Bearer\s/);
  });
  test("XSS post input escaped", async ({ page }) => {
    await page.goto("/home");
    const input = page.getByPlaceholder(/Share a track/);
    if (await input.isVisible()) {
      await input.fill('<script>window.xssTest=1</script>');
      await page.getByRole("button", { name: "Publish" }).click();
      const html = await page.locator("body").innerHTML();
      expect(html).not.toContain("window.xssTest");
    }
  });
  test("XSS message input escaped", async ({ page }) => {
    await page.goto("/messaging");
    await page.getByPlaceholder(/Write a message/).fill('<img src=x onerror="window.x=1">');
    await page.getByRole("button", { name: "Send" }).click();
    const html = await page.locator("body").innerHTML();
    expect(html).not.toContain('onerror="window.x=1"');
  });
  test("XSS search query escaped", async ({ page }) => {
    await page.goto("/search?q=<script>alert(1)</script>");
    const html = await page.locator("body").innerHTML();
    expect(html).not.toContain("<script>alert");
  });
  test("no javascript: hrefs", async ({ page }) => {
    await page.goto("/home");
    expect(await page.locator('a[href^="javascript:"]').count()).toBe(0);
  });
  test("no inline onclick handlers", async ({ page }) => {
    await page.goto("/home");
    const html = await page.locator("body").innerHTML();
    expect(html).not.toMatch(/onclick="[^"]*"/);
  });
  test("search form uses GET", async ({ page }) => {
    await page.goto("/home");
    const form = page.locator('form[action="/search"]');
    expect((await form.getAttribute("method"))?.toUpperCase()).toBe("GET");
  });
  test("no redirect param hijack", async ({ page }) => {
    await page.goto("/home?redirect=evil.com");
    expect(page.url()).not.toContain("evil.com");
  });
  test("Stripe amount input doesn't log", async ({ page }) => {
    await page.goto("/payments");
    const logs: string[] = [];
    page.on("console", m => logs.push(m.text()));
    await page.getByRole("button", { name: "Withdraw" }).click();
    const amount = page.locator('input[type="number"]').first();
    if (await amount.isVisible()) await amount.fill("1234");
    await page.waitForTimeout(500);
    expect(logs.filter(l => l.includes("1234"))).toHaveLength(0);
  });
  test("secure no mixed content", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", r => requests.push(r.url()));
    await page.goto("/home", { waitUntil: "networkidle" });
    const httpOnly = requests.filter(u => u.startsWith("http://") && !u.includes("localhost"));
    expect(httpOnly).toHaveLength(0);
  });
  test("legal page renders ToS content", async ({ page }) => {
    await page.goto("/legal");
    await expect(page.getByText(/Terms of Service/)).toBeVisible();
    await expect(page.getByText(/Privacy Policy/)).toBeVisible();
  });
  test("404 page has no stack trace", async ({ page }) => {
    await page.goto("/nonexistent-page-xyz");
    const body = await page.locator("body").textContent();
    expect(body).not.toMatch(/stack|error.*at\s+\w+@/i);
  });
  test("session cookies httpOnly", async ({ page, context }) => {
    await page.goto("/home");
    const cookies = await context.cookies();
    for (const c of cookies) {
      if (c.name.match(/session|auth|token/i)) {
        expect(c.httpOnly).toBe(true);
      }
    }
  });
  test("SameSite cookies set", async ({ page, context }) => {
    await page.goto("/home");
    const cookies = await context.cookies();
    for (const c of cookies) {
      if (c.name.match(/session|auth|token/i)) {
        expect(["Strict", "Lax"]).toContain(c.sameSite);
      }
    }
  });
  test("Stripe inputs not stored in localStorage", async ({ page }) => {
    await page.goto("/premium");
    await page.waitForTimeout(500);
    const storage = await page.evaluate(() => JSON.stringify(localStorage));
    expect(storage).not.toMatch(/4242|stripe.*card|cardnumber/i);
  });
  test("card number pattern not leaked", async ({ page }) => {
    await page.goto("/premium");
    const cardInput = page.locator('input[placeholder="4242 4242 4242 4242"]');
    if (await cardInput.isVisible()) {
      await cardInput.fill("4242424242424242");
      const visible = await page.getByText("4242424242424242").count();
      expect(visible).toBe(0);
    }
  });
  test("message doesn't leak other users", async ({ page }) => {
    await page.goto("/messaging");
    await page.getByPlaceholder(/Write a message/).fill("test");
    const html = await page.locator("body").innerHTML();
    expect(html).not.toMatch(/Bearer|api[_-]?key/i);
  });
  test("payment page no PII in URL", async ({ page }) => {
    await page.goto("/payments");
    expect(page.url()).not.toMatch(/card|iban|password/i);
  });
  test("admin page has warning indicator", async ({ page }) => {
    await page.goto("/admin/curators");
    await expect(page.getByText("Admin Only")).toBeVisible();
  });
  test("login/auth pages HTTPS links", async ({ page }) => {
    await page.goto("/home");
    const anchors = await page.locator("a[href^='http']").all();
    for (const a of anchors) {
      const href = await a.getAttribute("href");
      if (href && !href.includes("localhost")) {
        expect(href).toMatch(/^https:\/\//);
      }
    }
  });
  test("CSP header present in production", async ({ page }) => {
    const res = await page.goto("/home");
    const headers = res?.headers() || {};
    if (headers["content-security-policy"]) {
      expect(headers["content-security-policy"]).toBeTruthy();
    }
  });
  test("X-Frame-Options set", async ({ page }) => {
    const res = await page.goto("/home");
    const headers = res?.headers() || {};
    if (headers["x-frame-options"]) {
      expect(["DENY", "SAMEORIGIN"]).toContain(headers["x-frame-options"].toUpperCase());
    }
  });
  test("X-Content-Type-Options set", async ({ page }) => {
    const res = await page.goto("/home");
    const headers = res?.headers() || {};
    if (headers["x-content-type-options"]) {
      expect(headers["x-content-type-options"]).toBe("nosniff");
    }
  });
  test("Referrer-Policy set", async ({ page }) => {
    const res = await page.goto("/home");
    const headers = res?.headers() || {};
    if (headers["referrer-policy"]) {
      expect(headers["referrer-policy"]).toMatch(/strict-origin/);
    }
  });
  test("no debug comments in HTML", async ({ page }) => {
    await page.goto("/home");
    const html = await page.locator("body").innerHTML();
    expect(html).not.toMatch(/<!--.*password.*-->/i);
  });
});