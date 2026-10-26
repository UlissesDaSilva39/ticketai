# GRID - add-home-all.ps1 - insert sections + verify + commit + push (all-in-one)
$ErrorActionPreference = 'Stop'
Set-Location 'C:\Users\User\ticketai'

$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$bk = "_backup_home_$stamp"
New-Item -ItemType Directory -Path $bk -Force | Out-Null

function Ok($m){ Write-Host "  OK   $m" -ForegroundColor Green }
function Warn($m){ Write-Host "  WARN $m" -ForegroundColor Yellow }
function Skip($m){ Write-Host "  SKIP $m" -ForegroundColor DarkGray }
function Fail($m){ Write-Host "  FAIL $m" -ForegroundColor Red }

$homeFile = 'app\page.tsx'

# ======================================================================
# STEP 1 - PREFLIGHT
# ======================================================================
Write-Host ""
Write-Host "[1/5] Preflight checks" -ForegroundColor Cyan

if (-not (Test-Path $homeFile)) {
    Fail "$homeFile not found - wrong folder?"
    exit 1
}

Copy-Item $homeFile (Join-Path $bk 'page.tsx.bak') -Force
$content = Get-Content $homeFile -Raw
Ok "Loaded $homeFile ($($content.Length) bytes)"
Ok "Backup saved to $bk\page.tsx.bak"

# Already has sections?
if ($content -match 'See it in action' -and $content -match 'Why not just use') {
    Skip "Sections already present - nothing to do"
    exit 0
}

# Find insertion point
$idx = $content.LastIndexOf('READY TO MOVE')
if ($idx -lt 0) { $idx = $content.LastIndexOf('Ready to move') }
if ($idx -lt 0) {
    Fail "Could not find 'READY TO MOVE' marker in page.tsx"
    exit 1
}

$sectionStart = $content.LastIndexOf('<section', $idx)
if ($sectionStart -lt 0) {
    Fail "Could not find <section> wrapper before 'READY TO MOVE'"
    exit 1
}
Ok "Insertion point found at char $sectionStart"

# ======================================================================
# STEP 2 - BUILD BRIDGE SECTIONS
# ======================================================================
Write-Host ""
Write-Host "[2/5] Building new sections" -ForegroundColor Cyan
$insert = @B
      {/* ============== LIVE PREVIEWS ============== */}
      <section className="bg-gray-50 border-y border-gray-200 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3">See it in action</h2>
            <p className="text-gray-600">Real pages from GRID - click any to explore.</p>
          </div>
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-1">Artist Pages</div>
                <h3 className="text-2xl font-bold">Your career, one URL</h3>
              </div>
              <a href="/artists" className="text-sm font-medium text-violet-600 hover:text-violet-700">Browse artists</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'DJ Poxy', role: 'DJ - House', city: 'London', followers: '150k', initials: 'DP', slug: 'dj-poxy' },
                { name: 'Paper Lions', role: 'Band - Jazz Fusion', city: 'Paris', followers: '45k', initials: 'PL', slug: 'paper-lions' },
                { name: 'Basement Collective', role: 'Band - Techno', city: 'London', followers: '12k', initials: 'BC', slug: 'basement-collective' },
              ].map((a) => (
                <a key={a.name} href={'/artists/' + a.slug} className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-md hover:border-violet-300 transition">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white flex items-center justify-center font-bold">
                      {a.initials}
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-1">
                        {a.name}
                        <span className="text-green-500 text-xs">V</span>
                      </div>
                      <div className="text-sm text-gray-500">{a.role} - {a.city}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{a.followers} followers</span>
                    <span className="text-violet-600 font-medium">View profile</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-1">Event Pages</div>
                <h3 className="text-2xl font-bold">Sell tickets your way</h3>
              </div>
              <a href="/discover/events" className="text-sm font-medium text-violet-600 hover:text-violet-700">Browse events</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Paper Lions Jazz Night', venue: 'The Blue Note - London', date: 'Tue, 3 Nov - 19:16', price: '25', sold: '87%', tag: 'Selling fast' },
                { title: 'Basement Collective Presents', venue: 'Basement 44 - London', date: 'Mon, 2 Nov - 17:16', price: '20', sold: '93%', tag: 'Selling fast' },
                { title: 'Analog Dreams Live', venue: 'Fabric - London', date: 'Sat, 24 Oct - 18:16', price: '16', sold: '93%', tag: 'Last tickets' },
              ].map((e) => (
                <a key={e.title} href="/discover/events" className="rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-md hover:border-violet-300 transition">
                  <div className="h-32 bg-gradient-to-br from-violet-200 to-pink-200 relative">
                    <div className="absolute bottom-3 right-3 rounded-full bg-red-500 text-white text-xs px-2 py-1 font-medium">
                      {e.tag}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-1">{e.title}</h4>
                    <div className="text-xs text-gray-500 mb-3">{e.venue}<br/>{e.date}</div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <div className="text-xs text-gray-500">From</div>
                        <div className="font-bold">{e.price}</div>
                      </div>
                      <div className="text-xs text-gray-500">{e.sold} sold</div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-1">Promoter Pages</div>
                <h3 className="text-2xl font-bold">The people who fill rooms</h3>
              </div>
              <a href="/discover/promoters" className="text-sm font-medium text-violet-600 hover:text-violet-700">Browse promoters</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Nightshift Presents', city: 'London', since: '2019', events: 24, initials: 'NP' },
                { name: 'Techno Nation', city: 'London', since: '2016', events: 31, initials: 'TN' },
                { name: 'Electronic Europe', city: 'Amsterdam', since: '2017', events: 19, initials: 'EE' },
              ].map((p) => (
                <a key={p.name} href="/discover/promoters" className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-md hover:border-violet-300 transition">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white flex items-center justify-center font-bold">
                      {p.initials}
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-1">
                        {p.name}
                        <span className="text-green-500 text-xs">V</span>
                      </div>
                      <div className="text-sm text-gray-500">{p.city} - Since {p.since}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{p.events} events</span>
                    <span className="text-violet-600 font-medium">View</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== COMPARISON ============== */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3">Why not just use...?</h2>
          <p className="text-gray-600">RA, Dice, Eventbrite and Bandcamp each solve one piece. GRID solves all of them.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 pr-4 font-semibold">Feature</th>
                <th className="px-3 py-4 font-semibold text-violet-600">GRID</th>
                <th className="px-3 py-4 font-semibold text-gray-400">RA</th>
                <th className="px-3 py-4 font-semibold text-gray-400">Dice</th>
                <th className="px-3 py-4 font-semibold text-gray-400">Eventbrite</th>
                <th className="px-3 py-4 font-semibold text-gray-400">Bandcamp</th>
              </tr>
            </thead>
            <tbody>
              {[
                { f: 'Artist page with music + booking', grid: 'V', ra: '-', dice: '-', eb: '-', bc: '}' },
                { f: 'Direct booking (accept/decline)', grid: 'V', ra: '-', dice: '-', eb: '-', bc: '-' },
                { f: 'Sell tickets on your own page', grid: 'V', ra: '-', dice: '}', eb: 'V', bc: 'V' },
                { f: 'Promoter discovery', grid: 'V', ra: 'V', dice: '}', eb: '-', bc: '-' },
                { f: 'Venue listing + booking', grid: 'V', ra: '}', dice: '-', eb: '-', bc: '-' },
                { f: 'Analytics dashboard', grid: 'V', ra: '}', dice: 'V', eb: 'V', bc: '}' },
                { f: 'Social network (follow + DM)', grid: 'V', ra: '-', dice: '-', eb: '-', bc: '-' },
                { f: 'Industry marketplace', grid: 'V', ra: '-', dice: '-', eb: '-', bc: '-' },
                { f: 'Rider system', grid: 'V', ra: '-', dice: '-', eb: '-', bc: '-' },
                { f: 'Free to join', grid: 'V', ra: '-', dice: '-', eb: 'V', bc: 'V' },
              ].map((row) => (
                <tr key={row.f} className="border-b border-gray-100">
                  <td className="py-3 pr-4 text-gray-700">{row.f}</td>
                  <td className="text-center px-3 py-3 font-bold text-green-600">{row.grid}</td>
                  <td className="text-center px-3 py-3 text-gray-400">{row.ra}</td>
                  <td className="text-center px-3 py-3 text-gray-400">{row.dice}</td>
                  <td className="text-center px-3 py-3 text-gray-400">{row.eb}</td>
                  <td className="text-center px-3 py-3 text-gray-400">{row.bc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">V Full support - ~ Grid - - Not available</p>
      </section>

      {/* ============== TRUST COUNTERS ============== */}
      <section className="bg-gray-50 border-y border-gray-200 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Artists', value: '45,000+' },
              { label: 'Promoters', value: '12,000+' },
              { label: 'Venues', value: '8,000+' },
              { label: 'Events', value: '120,000+' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-violet-600">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-12 text-center">Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Is GRID free?', a: 'Yes. Free forever. No card needed. Only pay when you sell tickets (5% fee).' },
            { q: 'How is this different from Resident Advisor?', a: 'RA is a listings site. GRID is a full career platform - booking, ticketing, analytics, marketplace, and a social network, all in one place.' },
            { q: 'How is this different from Dice?', a: 'Dice is fan-focused. GRID is built for the entire industry - artists, promoters, venues, and every role behind the scenes.' },
            { q: 'Can I keep my Bandcamp?', a: 'Yes. GRID does not own your music. Keep selling on Bandcamp. Use GRID for booking, live shows, and analytics.' },
            { q: 'What is the marketplace?', a: 'Hire producers, engineers, designers, photographers, and every role in live music - with escrow, references, and riders. Like Fiverr, but for live music.' },
          ].map((item) => (
            <details key={item.q} className="rounded-lg border border-gray-200 bg-white p-5 group">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">
                {item.q}
                <span className="text-gray-400 group-open:rotate-45 transition">+</span>
              </summary>
              <p className="text-sm text-gray-600 mt-3">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
@@

Ok "Built $($insert.Length) chars of new sections"

# ======================================================================
# STEP 3 - INSERT
# ======================================================================
Write-Host ""
Write-Host "[3/5] Inserting into $homeFile" -ForegroundColor Cyan

try {
    $newContent = $content.Substring(0, $sectionStart) + $insert + "`r `n" + $content.Substring($sectionStart)
    Set-Content -Path $homeFile -Value $newContent -Encoding UTF8
    $newSize = (Get-Item $homeFile).Length
    Ok "Wrote $homeFile ($newSize bytes, was $($content.Length))"
    if ($newSize -lt $content.Length + 5000) {
        Fail "File size increase is suspiciously small - possible truncation"
        Copy-Item (Join-Path $bk 'page.tsx.bak') $homeFile -Force
        exit 1
    }
} catch {
    Fail "Write failed: $_"
    Copy-Item (Join-Path $bk 'page.tsx.bak') $homeFile -Force
    exit 1
}

# ======================================================================
# STEP 4 - VERIFY
# ======================================================================
Write-Host ""
Write-Host "[4/5] Verifying" -ForegroundColor Cyan
$verify = Get-Content $homeFile -Raw
$verifyOk = $true
foreach ($pattern in @('See it in action', 'Why not just use', '45,000+', 'Is GRID free')) {
    if ($verify -match [regex]::Escape($pattern)) {
        Ok "$pattern present"
    } else {
        Fail "$pattern MISSING"
        $verifyOk = $false
    }
}

if (-not $verifyOk) {
    Fail "Verification failed - rolling back"
    Copy-Item (Join-Path $bk 'page.tsx.bak') $homeFile -Force
    exit 1
}

# tsc check
Write-Host ""
Write-Host "  Running tsc..." -ForegroundColor DarkGray
$tscOut = npx tsc --noEmit 2>&1 | Select-String "app/page.tsx"
if ($tscOut) {
    Fail "tsc errors in app/page.tsx:"
    $tscOut | ForEach-Object { Write-Host "    $($_.Line)" -ForegroundColor Red }
    Copy-Item (Join-Path $bk 'page.tsx.bak') $homeFile -Force
    exit 1
} else {
    Ok "tsc: 0 errors in app/page.tsx"
}

# ======================================================================
# STEP 5 - COMMIT + PUSH
# ======================================================================
Write-Host ""
Write-Host "[5/5] Commit + push" -ForegroundColor Cyan
Write-Host ""

git add -A 2>&1 | Out-Null
$commitResult = git commit -m "feat(home): add live previews + comparison + trust counters + FAQ ($stamp)" 2>&1
$commitResult | ForEach-Object { Write-Host "  $($_)" -ForegroundColor Gray }

if ($LASTEXITCODE -eq 0) {
    Ok "Committed"
    git push origin HEAD 2>&1 | Select-Object -Last 3 | ForEach-Object { Write-Host "  $($_)" -ForegroundColor Gray }
    if ($LASTEXITCODE -eq 0) {
        Ok "Pushed to GitHub"
    } else {
        Warn "Push failed - run: git push origin HEAD"
    }
} else {
    Skip "Nothing to commit (or commit failed)"
}

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host " DONE" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "Backup: $bk" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Test:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host "  Open http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Hard refresh (Ctrl+Shift+R)" -ForegroundColor Cyan