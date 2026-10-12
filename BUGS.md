# GRID Bug Tracker

## BUG-001: Booking Accept/Decline Persistence

**Reported:** 2026-10-11
**Fixed:** 2026-10-12
**Severity:** High
**Status:** ✅ Closed

**Root cause:** The `/api/book/respond` route used `.update(...).select().single()`. When Postgres returned an empty or multi-row response, Supabase threw "Cannot coerce the result to a single JSON object" — and the update didn't persist.

**Fix:** Removed `.select().single()` from the update chain. Also wrapped in try/catch and added `notifyServer` + email notifications after the update.

**Verification:** Accepting a booking from the artist inbox now:
1. Updates `booking_requests.status` to `accepted` in the DB
2. Inserts a row into `notifications`
3. Sends an email to the promoter

Confirmed on 2026-10-12 with a real booking request.

---

## No open bugs.
