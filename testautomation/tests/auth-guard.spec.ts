import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

// Links to test on the Navbar (all should redirect to /login when not authenticated)
const PROTECTED_LINKS = [
  { name: 'Discover', selector: 'text=Discover' },
  { name: 'Search', selector: 'text=Search' },
  { name: 'Artists', selector: 'text=Artists' },
  { name: 'Social', selector: 'text=Social' },
  { name: 'Network', selector: 'text=Network' },
  { name: 'Industry', selector: 'text=Industry' },
]

// Sub-links inside the Discover dropdown
const DISCOVER_SUBLINKS = [
  { name: 'Overview', selector: 'text=Overview' },
  { name: 'Artists', selector: 'text=Artists' },
  { name: 'Venues', selector: 'text=Venues' },
  { name: 'Events', selector: 'text=Events' },
  { name: 'Promoters', selector: 'text=Promoters' },
  { name: 'Festivals', selector: 'text=Festivals' },
  { name: 'Labels', selector: 'text=Labels' },
]

test.describe('Auth Guard - Unauthenticated Users', () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear all cookies and localStorage to simulate a fresh unauthenticated visitor
    await context.clearCookies()
    await page.goto(BASE_URL)
    await page.evaluate(() => localStorage.clear())
    await page.goto(BASE_URL)
  })

  test('Home link stays on landing page', async ({ page }) => {
    await page.click('text=Home')
    await page.waitForTimeout(500)
    await expect(page).toHaveURL(`${BASE_URL}/`)
    console.log('✅ Home link keeps user on landing page')
  })

  test('Discover link redirects to /login', async ({ page }) => {
    await page.click('text=Discover')
    await page.waitForTimeout(800)
    await expect(page).toHaveURL(/\/login/)
    console.log('✅ Discover link redirects to /login')
  })

  test('Search link redirects to /login', async ({ page }) => {
    await page.click('text=Search')
    await page.waitForTimeout(800)
    await expect(page).toHaveURL(/\/login/)
    console.log('✅ Search link redirects to /login')
  })

  test('Artists link redirects to /login', async ({ page }) => {
    await page.click('text=Artists')
    await page.waitForTimeout(800)
    await expect(page).toHaveURL(/\/login/)
    console.log('✅ Artists link redirects to /login')
  })

  test('Social link redirects to /login', async ({ page }) => {
    await page.click('text=Social')
    await page.waitForTimeout(800)
    await expect(page).toHaveURL(/\/login/)
    console.log('✅ Social link redirects to /login')
  })

  test('Network link redirects to /login', async ({ page }) => {
    await page.click('text=Network')
    await page.waitForTimeout(800)
    await expect(page).toHaveURL(/\/login/)
    console.log('✅ Network link redirects to /login')
  })

  test('Industry link redirects to /login', async ({ page }) => {
    await page.click('text=Industry')
    await page.waitForTimeout(800)
    await expect(page).toHaveURL(/\/login/)
    console.log('✅ Industry link redirects to /login')
  })

  test('All Discover sub-links redirect to /login', async ({ page }) => {
    for (const sublink of DISCOVER_SUBLINKS) {
      await page.goto(BASE_URL)
      await page.hover('text=Discover')
      await page.waitForTimeout(300)
      
      const link = page.locator(`a:has-text("${sublink.name}")`).first()
      if (await link.count() > 0) {
        await link.click()
        await page.waitForTimeout(800)
        await expect(page).toHaveURL(/\/login/)
        console.log(`✅ Discover > ${sublink.name} redirects to /login`)
      }
    }
  })
})

test.describe('Auth Guard - Logged-in Users (All Links Work)', () => {
  test.beforeEach(async ({ page }) => {
    // Log in with a real Supabase user
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL || 'djproxyartist@ticketai.org.uk')
    await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD || 'TestPass123!')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(2000)
  })

  test('Logged-in user can navigate to Discover', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.click('text=Discover')
    await page.waitForTimeout(1000)
    // Should NOT be redirected to /login
    await expect(page).not.toHaveURL(/\/login/)
    console.log('✅ Logged-in user can access Discover')
  })

  test('Logged-in user can navigate to Artists', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.click('text=Artists')
    await page.waitForTimeout(1000)
    await expect(page).not.toHaveURL(/\/login/)
    console.log('✅ Logged-in user can access Artists')
  })

  test('Logged-in user sees profile in Navbar', async ({ page }) => {
    await page.goto(BASE_URL)
    // Look for the profile avatar (letter in a circle) or user email
    const profileVisible = await page.locator('text=djproxyartist').or(page.locator('[class*="rounded-full"]')).first().isVisible().catch(() => false)
    expect(profileVisible).toBeTruthy()
    console.log('✅ Logged-in user sees profile in Navbar')
  })
})