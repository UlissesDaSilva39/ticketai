import { test, expect, gotoPromoters, getFirstCard, getFirstMessageButton } from './fixtures';

test.describe('GRID Promoters — page structure', () => {
  test.beforeEach(async ({ page }) => {
    await gotoPromoters(page);
  });

  test('renders the hero with dual CTAs', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'PROMOTERS', level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /Browse events by promoter/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Run a night on GRID/i })).toBeVisible();
  });

  test('renders all 4 promoter OS pillars', async ({ page }) => {
    const pillars = [
      'Find and book venues',
      'Book artists in minutes',
      'Sell tickets and fill the room',
      'Get paid the same day',
    ];
    for (const title of pillars) {
      await expect(page.getByRole('heading', { name: title })).toBeVisible();
    }
  });

  test('renders the venue availability table with 5 rows', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /14 venues free this Saturday/i })).toBeVisible();
    const rows = page.locator('table tbody tr');
    await expect(rows).toHaveCount(5);
  });

  test('renders the 4 unit economics stats', async ({ page }) => {
    for (const k of ['0%', '3%', 'T+1', '0']) {
      await expect(page.getByText(k, { exact: true }).first()).toBeVisible();
    }
  });

  test('renders the promoter grid with cards', async ({ page }) => {
    const cards = page.locator('#promoters article');
    await expect(cards).toHaveCount(6);
    await expect(page.getByText(/6 promoters ·/i)).toBeVisible();
  });

  test('renders Distribution, Workspace, Proof, FAQ, DualCTA sections', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /fill the room/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /One screen\. Every ticket/i })).toBeVisible();
    await expect(page.getByText('Trusted by')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Answers, not asterisks/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /FIND YOUR NEXT NIGHT OUT/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /RUN A NIGHT ON GRID/i })).toBeVisible();
  });
});

test.describe('GRID Promoters — filters', () => {
  test.beforeEach(async ({ page }) => {
    await gotoPromoters(page);
  });

  test('city filter chips toggle active state', async ({ page }) => {
    const londonChip = page.getByRole('button', { name: 'London', exact: true });
    await expect(londonChip).toHaveClass(/border-neutral-300/);
    await londonChip.click();
    await expect(londonChip).toHaveClass(/border-black/);
  });

  test('genre filter chips toggle active state', async ({ page }) => {
    const technoChip = page.getByRole('button', { name: 'Techno', exact: true });
    await technoChip.click();
    await expect(technoChip).toHaveClass(/border-black/);
  });

  test('when chips toggle on and off', async ({ page }) => {
    const weekendChip = page.getByRole('button', { name: 'This weekend', exact: true });
    await weekendChip.click();
    await expect(weekendChip).toHaveClass(/border-black/);
    await weekendChip.click();
    await expect(weekendChip).toHaveClass(/border-neutral-300/);
  });

  test('filters bar is sticky on scroll', async ({ page }) => {
    const filters = page.locator('section.sticky').first();
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(300);
    const afterY = (await filters.boundingBox())?.y ?? 0;
    expect(afterY).toBeLessThan(200);
  });
});

test.describe('GRID Promoters — promoter cards', () => {
  test.beforeEach(async ({ page }) => {
    await gotoPromoters(page);
  });

  test('each card has GET TICKETS, Message, and View profile', async ({ page }) => {
    const card = await getFirstCard(page);
    await expect(card.getByRole('link', { name: /GET TICKETS/i })).toBeVisible();
    await expect(card.getByRole('button', { name: /^Message$/ })).toBeVisible();
    await expect(card.getByRole('link', { name: /View profile/i })).toBeVisible();
  });

  test('GET TICKETS link points to an event page', async ({ page }) => {
    const card = await getFirstCard(page);
    const link = card.getByRole('link', { name: /GET TICKETS/i });
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^\/events\//);
  });

  test('View profile link points to promoter page', async ({ page }) => {
    const card = await getFirstCard(page);
    const link = card.getByRole('link', { name: /View profile/i });
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^\/promoters\//);
  });

  test('verified badge appears on verified cards', async ({ page }) => {
    await expect(page.getByText('VERIFIED').first()).toBeVisible();
  });

  test('social links open in new tab', async ({ page }) => {
    const card = await getFirstCard(page);
    const igLink = card.locator('a[href*="instagram.com"]').first();
    await expect(igLink).toHaveAttribute('target', '_blank');
    await expect(igLink).toHaveAttribute('rel', /noreferrer/);
  });
});

test.describe('GRID Promoters — message modal', () => {
  test.beforeEach(async ({ page }) => {
    await gotoPromoters(page);
  });

  test('clicking Message opens the modal', async ({ page }) => {
    await (await getFirstMessageButton(page)).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: /^Message / })).toBeVisible();
  });

  test('modal shows recipient name in heading', async ({ page }) => {
    const card = await getFirstCard(page);
    const promoterName = (await card.locator('h3').first().textContent())?.trim() ?? '';
    await (await getFirstMessageButton(page)).click();
    await expect(page.getByRole('heading', { name: `Message ${promoterName}` })).toBeVisible();
  });

  test('modal has subject + body fields', async ({ page }) => {
    await (await getFirstMessageButton(page)).click();
    await expect(page.locator('#message-subject')).toBeVisible();
    await expect(page.locator('#message-body')).toBeVisible();
  });

  test('textarea autofocuses on open', async ({ page }) => {
    await (await getFirstMessageButton(page)).click();
    await expect(page.locator('#message-body')).toBeFocused();
  });

  test('Escape closes the modal', async ({ page }) => {
    await (await getFirstMessageButton(page)).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('clicking backdrop closes the modal', async ({ page }) => {
    await (await getFirstMessageButton(page)).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.mouse.click(10, 10);
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('X button closes the modal', async ({ page }) => {
    await (await getFirstMessageButton(page)).click();
    await page.getByRole('button', { name: /close/i }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('character counter updates as user types', async ({ page }) => {
    await (await getFirstMessageButton(page)).click();
    await page.locator('#message-body').fill('Hello there');
    await expect(page.getByText('11 / 1000')).toBeVisible();
  });

  test('submitting with short body shows server error', async ({ page }) => {
    await page.route('**/api/messages', (route) =>
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Message too short.' }),
      })
    );

    await (await getFirstMessageButton(page)).click();
    await page.locator('#message-body').fill('hey');
    await page.getByRole('button', { name: /send message/i }).click();
    await expect(page.getByText('Message too short.')).toBeVisible();
  });

  test('successful send shows confirmation', async ({ page }) => {
    await page.route('**/api/messages', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, threadId: 't_1' }),
      })
    );

    await (await getFirstMessageButton(page)).click();
    await page.locator('#message-body').fill('Hi, is there a guestlist for Saturday?');
    await page.getByRole('button', { name: /send message/i }).click();
    await expect(page.getByText(/Message sent/i)).toBeVisible();
    await expect(page.getByRole('link', { name: '/messages' })).toBeVisible();
  });

  test('Cancel closes without sending', async ({ page }) => {
    let posted = false;
    await page.route('**/api/messages', (route) => {
      posted = true;
      route.fulfill({ status: 200, body: '{"ok":true}' });
    });

    await (await getFirstMessageButton(page)).click();
    await page.locator('#message-body').fill('test');
    await page.getByRole('button', { name: /^Cancel$/ }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    expect(posted).toBe(false);
  });

  test('Send button disables while sending', async ({ page }) => {
    await page.route('**/api/messages', async (route) => {
      await new Promise((r) => setTimeout(r, 500));
      route.fulfill({ status: 200, body: '{"ok":true}' });
    });

    await (await getFirstMessageButton(page)).click();
    await page.locator('#message-body').fill('Hello world');
    await page.getByRole('button', { name: /send message/i }).click();
    await expect(page.getByRole('button', { name: /Sending/i })).toBeDisabled();
  });

  test('modal is bottom-sheet on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await (await getFirstMessageButton(page)).click();
    const dialog = page.getByRole('dialog').locator('> div');
    const box = await dialog.boundingBox();
    expect(box!.y).toBeGreaterThan(200);
    expect(box!.width).toBeCloseTo(390, 0);
  });
});

test.describe('GRID Promoters — accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await gotoPromoters(page);
  });

  test('modal has aria-modal and aria-labelledby', async ({ page }) => {
    await (await getFirstMessageButton(page)).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    await expect(dialog).toHaveAttribute('aria-labelledby', 'message-modal-title');
  });

  test('all buttons have accessible names', async ({ page }) => {
    const buttons = page.getByRole('button');
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      const name = await buttons.nth(i).getAttribute('aria-label')
        ?? await buttons.nth(i).textContent();
      expect(name?.trim().length).toBeGreaterThan(0);
    }
  });

  test('card images have alt attribute', async ({ page }) => {
    const images = page.locator('#promoters article img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toHaveAttribute('alt', /.*/);
    }
  });
});

test.describe('GRID Promoters — no console errors', () => {
  test('page loads with zero console errors', async ({ page, consoleErrors }) => {
    await gotoPromoters(page);
    await page.waitForTimeout(1000);
    expect(consoleErrors).toEqual([]);
  });

  test('opening the modal produces zero console errors', async ({ page, consoleErrors }) => {
    await gotoPromoters(page);
    await (await getFirstMessageButton(page)).click();
    await page.waitForTimeout(300);
    expect(consoleErrors).toEqual([]);
  });
});

test.describe('GRID Promoters — navigation', () => {
  test('hero primary CTA scrolls to promoter grid', async ({ page }) => {
    await gotoPromoters(page);
    await page.getByRole('link', { name: /Browse events by promoter/i }).click();
    await page.waitForTimeout(500);
    expect(await page.locator('#promoters').isVisible()).toBe(true);
  });

  test('hero secondary CTA links to apply page', async ({ page }) => {
    await gotoPromoters(page);
    const link = page.getByRole('link', { name: /Run a night on GRID/i });
    await expect(link).toHaveAttribute('href', '/promoters/apply');
  });

  test('DualCTA bottom links are correct', async ({ page }) => {
    await gotoPromoters(page);
    await expect(page.getByRole('link', { name: /Browse events →/i }).last())
      .toHaveAttribute('href', '#promoters');
    await expect(page.getByRole('link', { name: /Start free →/i }))
      .toHaveAttribute('href', '/promoters/apply');
  });
});

test.describe('GRID Promoters — API integration', () => {
  test('POST /api/messages without auth returns 401', async ({ request }) => {
    const res = await request.post('/api/messages', {
      data: { toSlug: 'fresh-talent-uk', body: 'Hello there, testing.' },
    });
    expect(res.status()).toBe(401);
  });

  test('POST /api/messages with too-short body returns 400 or 401', async ({ request }) => {
    const res = await request.post('/api/messages', {
      data: { toSlug: 'fresh-talent-uk', body: 'hi' },
    });
    expect([400, 401]).toContain(res.status());
  });
});