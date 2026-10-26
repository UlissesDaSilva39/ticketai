# GRID - Full Audit And Task List

## Priority 1 - BLOCKING

### 1. Run fix5.ps1 to repair lib/types.ts
- Script on disk (4529 bytes), verified
- Command: powershell -ExecutionPolicy Bypass -File .\fix5.ps1
- Why: Event fields duplicated inside Artist type, missing from Event type
- After: type errors drop from ~20 to ~5

### 2. Fix nav bar - duplicates still present
- Files: components/nav/Navbar.tsx, config/navigation.ts
- Current: Home, Discover, Search, Artists, Social, Network, My Tickets, My artist page
- Should be: Home, Discover, Search, Artists, Social, Network, Opportunities
- My Tickets goes to sidebar + profile dropdown only
- My artist page goes to profile dropdown only
- Also: "D Profile" renders twice (avatar + text label)

### 3. Fix events API - price_from does not exist
- Error: column events.price_from does not exist
- File: app/api/events/route.ts
- Fix: replace price_from with price_min
- After: /discover/events shows real events instead of mock fallback

## Priority 2 - Type safety

### 4. Verify remaining tsc errors after fix5.ps1
- Likely errors: set.price in DjCard, PromoterCard map, lib/artists social field
- App search showFilters state, app event attendingCount, scripts test-rss
- Each is 1-2 lines in VS Code

### 5. EventVenue.city type mismatch
- Error: Type string | null is not assignable to string | undefined
- File: lib/types.ts
- Fix: change city: string to city: string | null

### 6. Replace lib/auth.ts and lib/db.ts stubs
- Current: placeholder stubs return null
- Runtime broken: any page using auth or db returns empty
- Find real implementations and replace with re-exports

## Priority 3 - UX / Data

### 7. Event page placeholder venue description
- Currently shows: Test - First Venue in header, but "300-capacity warehouse in Shoreditch" in body
- Fix: seed real venue data

### 8. Follower counts inconsistent
- Analog Dreams: 150k on event page, 15k in artists list
- Fix: check data source

### 9. Reviews no drilldown
- Shows 4.8/5 (89 reviews) with no link
- Fix: link to /event/[id]/reviews

### 10. Verified badge only on event, not lineup
- Add VerifiedBadge to lineup items where verified: true

### 11. Fee disclosure
- From £16 + 5% fee - show actual amount
- Should be: £16.00 + £0.80 fee (5%)

### 12. Footer too thin
- Add columns: Product, Company, Legal, Support

## Priority 4 - Repo hygiene

### 13. Move backup folders out
- Move-Item _backup_* C:\Users\User\
- Delete: grid-light.ps1, restore.ps1, apply-fixes.ps1, fix3.ps1, fix4.ps1, fix5.ps1

### 14. Update .gitignore
- Add: _backup_*/, *.bak, *.ps1, _tsc_*.txt

### 15. Commit working state
- git log --oneline -5
- git status --short

## Priority 5 - Design (deferred)

### 16. Apply light-theme design system
- White nav, #f8f9fb card surface
- Purple-pink gradient CTAs
- Soft mint Verified badges
- 7-item nav
- Apply AFTER tsc is green and nav is deduplicated
- Edit in VS Code (Navbar.tsx, globals.css), not PowerShell

## Summary Table

| # | Task | Priority | File | Effort |
|---|------|----------|------|--------|
| 1 | Run fix5.ps1 | RED | lib/types.ts | 1 command |
| 2 | Remove nav duplicates | RED | Navbar.tsx / navigation.ts | ~10 lines |
| 3 | Fix price_from to price_min | RED | app/api/events/route.ts | 1 line |
| 4 | Fix remaining tsc errors | ORANGE | 5-6 files | ~15 lines |
| 5 | EventVenue.city nullable | ORANGE | lib/types.ts | 1 line |
| 6 | Replace auth/db stubs | ORANGE | lib/auth.ts, lib/db.ts | find files |
| 7 | Real venue description | YELLOW | seed data | DB fix |
| 8 | Consistent follower counts | YELLOW | data source | DB fix |
| 9 | Reviews drilldown link | YELLOW | app/event/[id]/page.tsx | 3 lines |
| 10 | Verified badges on lineup | YELLOW | app/event/[id]/page.tsx | 5 lines |
| 11 | Fee disclosure | YELLOW | app/event/[id]/page.tsx | 5 lines |
| 12 | Footer columns | YELLOW | components/Footer.tsx | 20 lines |
| 13 | Move backups out | GREEN | filesystem | 1 command |
| 14 | Update .gitignore | GREEN | .gitignore | 3 lines |
| 15 | Commit working state | GREEN | git | 1 command |
| 16 | Apply light theme | DESIGN | multiple | big task |

## Immediate Next Step

Run fix5.ps1 and paste the output. Then fix nav bar (task 2). Then events API (task 3).
