$ErrorActionPreference = 'Stop'
Set-Location 'C:\Users\User\ticketai'
$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$bk = "_backup_home_$stamp"
New-Item -ItemType Directory -Path $bk -Force | Out-Null

$homeFile = 'app\page.tsx'
if (-not (Test-Path $homeFile)) { Write-Host "FAIL: $homeFile not found" -ForegroundColor Red; exit 1 }

Copy-Item $homeFile (Join-Path $bk 'page.tsx.bak') -Force
$content = Get-Content $homeFile -Raw
Write-Host "OK: Loaded $homeFile ($($content.Length) bytes)"

if ($content -match 'See it in action' -and $content -match 'Why not just use') {
    Write-Host "SKIP: sections already present"; exit 0
}

$idx = $content.LastIndexOf('READY TO MOVE')
if ($idx -lt 0) { $idx = $content.LastIndexOf('Ready to move') }
if ($idx -lt 0) { Write-Host "FAIL: READY TO MOVE marker not found" -ForegroundColor Red; exit 1 }

$sectionStart = $content.LastIndexOf('<section', $idx)
if ($sectionStart -lt 0) { Write-Host "FAIL: <section> wrapper not found" -ForegroundColor Red; exit 1 }
Write-Host "OK: Insertion point found at char $sectionStart"

Try {
    $newSections = @'

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
                { name: 'Bandement Collective', role: 'Band - Techno', city: 'London', followers: '12k', initials: 'BC', slug: 'basement-collective' },
              ].map((a) => (
                <a key={a.name} href={'/artists/' + a.slug} className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-md hover:border-violet-300 transition">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white flex items-center justify-center font-bold">{a.initials}</div>
                    <div>
                      <div className="font-semibold flex items-center gap-1">{a.name}<span className="text-green-500 text-xs">V</span></div>
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
'

    $newContent = $content.Substring(0, $sectionStart) + $newSections + "`n `n" + $content.Substring($sectionStart)
    Set-Content -Path $homeFile -Value $newContent -Encoding UTF8
    $newSize = (Get-Item $homeFile).Length
    Write-Host "OK: Wrote $homeFile ($newSize bytes, was $($content.Length))"

    if ($newSize -lt $content.Length + 5000) {
        Write-Host "FAIL: file size increase suspiciously small" -ForegroundColor Red
        Copy-Item (Join-Path $bk 'page.tsx.bak') $homeFile -Force
        exit 1
    }

    $verify = Get-Content $homeFile -Raw
    $ok = $true
    foreach ($p in @('See it in action', 'Why not just use', '45,000+', 'Is GRID free')) {
        if ($verify -match [regex]::Escape($p)) { Write-Host "OK: $p" } else { Write-Host "FAIL: $p MISSING" -ForegroundColor Red; $ok = $false }
    }
    if (-not $ok) {
        Copy-Item (Join-Path $bk 'page.tsx.bak') $homeFile -Force
        Write-Host "Rolled back" -ForegroundColor Yellow
        exit 1
    }

    $tscOut = npx tsc --noEmit 2>&1 | Select-String "app/page.tsx"
    if ($tscOut) {
        Write-Host "FAIL: tsc errors:" -ForegroundColor Red
        $tscOut | ForEach-Object { Write-Host "  $($_.Line)" -ForegroundColor Red }
        Copy-Item (Join-Path $bk 'page.tsx.bak') $homeFile -Force
        exit 1
    } else {
        Write-Host "OK: tsc 0 errors in app/page.tsx"
    }

    git add -A 2>&1 | Out-Null
    git commit -m "feat(home): add live previews + comparison + trust counters + FAQ ($stamp)" 2>&1 | Select-Object -First 3
    git push origin HEAD 2>&1 | Select-Object -Last 3
    Write-Host "DONE. Backup: $bk" -ForegroundColor Green
} catch {
    Write-Host "FAIL - rolling back: $_" -ForegroundColor Red
    Copy-Item (Join-Path $bk 'page.tsx.bak') $homeFile -Force
    exit 1
}
