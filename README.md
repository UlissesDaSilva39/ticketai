# GRID

**The music industry network.** GRID is where artists, producers, venues and the music industry meet:
build a profile and EPK, find collabs and gigs, message anyone, sell and license music, prepare releases,
and get paid.

Built with **Next.js 16** (App Router), **Supabase** (auth, Postgres, storage), **Stripe** (payments),
**Resend** (email) and **Tailwind CSS**, deployed on **Vercel**.

---

## Features

| Area | What members can do | Where |
|---|---|---|
| Profiles & EPK | Profile, photos, tracks, bio, rider and a booking button on one link | `/epk`, `/u/[username]` |
| Network | Connections, invitations, suggestions, who viewed your profile | `/network` |
| Jobs & collabs | Post and apply to gigs, sessions and collabs; matches on the home feed | `/jobs`, `/home` |
| Messages | One-to-one chat (new chats per week: Free 5, Pro 30, Premium unlimited) | `/messages` |
| Marketplace | Sell beats, sample packs, services and merch (buyer pays +10% GRID fee) | `/marketplace` |
| Licensing | License tracks for Creator, Commercial and Sync use with a signed standard agreement | `/licensing` |
| Release builder | Prepare releases (cover art, tracks, credits, date) with store checks. *Early access: delivery to stores is not live yet* | `/distribution` |
| Split sheets | Agree ownership splits before release | `/splits` |
| Seller balance | Earnings from sales and licences, 7-day hold, withdrawals | `/seller` |
| Events & tickets | Discover events, buy tickets, club memberships | `/events`, `/clubs/...` |
| In-app guide | "Remi" explains GRID and gives a guided tour (content in `lib/guide/content.ts`) | bottom-right button |
| GRID Pro / Premium | Paid plans with higher limits and priority in matches | `/pro` |

---

## Run it on your computer

You need **Node.js 22** and **npm**.

```bash
npm install
```

Create a file called `.env.local` in the project folder (see [Settings](#settings-environment-variables)), then:

```bash
npm run dev
```

Open **http://localhost:3001** (the dev server uses port 3001).

| Command | What it does |
|---|---|
| `npm run dev` | Start the app for development on port 3001 |
| `npm run build` | Production build (type check included), the same as Vercel and CI |
| `npm run start` | Run the production build locally |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run seed` | Load sample data into Supabase |

---

## Settings (environment variables)

Put these in `.env.local` on your computer and in **Vercel → Settings → Environment Variables**
(tick **Production** and **Preview**). **Never commit real values**: `.env*` files are git-ignored.

**Required**

| Name | What it is |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key (`sb_publishable_…`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase secret key (`sb_secret_…`), server only |
| `NEXT_PUBLIC_ROOT_URL`, `NEXT_PUBLIC_BASE_URL` | The site address, e.g. `http://localhost:3001` or your Vercel URL |
| `CRON_SECRET` | Long random text; Vercel sends it to the daily reminder job |

**Optional** (the app builds without them; the related feature shows an error until set)

| Name | Used for |
|---|---|
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Payments |
| `RESEND_API_KEY`, `RESEND_FROM` | Emails |
| `OPENAI_API_KEY`, `GEMINI_API_KEY`, `ZAI_API_KEY`, `DEEPSEEK_API_KEY` | AI features |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` | Spotify import |
| `TICKETMASTER_API_KEY` | Event import |
| `WALLETWALLET_API_KEY` | Wallet passes |
| `NEXT_PUBLIC_ENV` | `production` on the live site |

---

## Database (Supabase)

SQL migrations live in `supabase/migrations/`. Run new ones in **Supabase → SQL Editor** (paste the file and
click **Run**). Each recent one is safe to run more than once and ends with a quick check query.

Recent migrations:

| File | Adds |
|---|---|
| `20261125_clubs_and_saved_events.sql` | Club tiers, memberships, saved events |
| `20261126000000_licence_deals.sql` | Licensing listings and deals |
| `20261127000000_distribution_releases.sql` | Release builder |
| `20261128000000_catalogue_submissions.sql` | "Submit your catalogue" form |

Every new table has Row Level Security on. Most writes happen on the server with the service key after validation.

**Auth URLs:** in Supabase → Authentication → URL Configuration, set the **Site URL** to the live address and
add `<address>/auth/callback` to **Redirect URLs** (for local work: `http://localhost:3001/auth/callback`).

---

## CI/CD: how changes go live

1. Work on a branch (e.g. `feature/my-change`) and push it.
2. **GitHub Actions CI** (`.github/workflows/ci.yml`) runs a clean install, a type check and a production build.
3. **Vercel** builds a preview link for the branch (needs the settings above ticked for **Preview**).
4. Open a pull request into `main`. When CI is green, click **Merge**.
5. Vercel deploys `main` to production automatically (about 3 minutes).

A scheduled job (`vercel.json`) sends event reminders once a day.

---

## Project structure

```
app/                 Pages and API routes (Next.js App Router)
  api/               Server endpoints (licensing, distribution, marketplace, stripe, …)
components/          Shared UI (guide, licensing, nav, …)
lib/                 Server and shared logic (supabase clients, licensing, distribution, email, …)
supabase/migrations/ Database changes (run in the Supabase SQL Editor)
proxy.ts             Session refresh and members-only page protection
.github/workflows/   CI
```

Folders `grid-app/`, `grid-network/`, `backups/` and `GRID-Discover/` are old copies and are not part of the
deployed app.

---

## Before taking real payments

- Have a UK media solicitor review the licence agreement in `lib/licensing/agreement.ts`.
- Switch Stripe from test keys to live keys.
- Make sure the Terms and Privacy pages are complete (UK GDPR).
