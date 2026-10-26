# GRID - fix5.ps1 - repair lib/types.ts by replacing whole type blocks
$ErrorActionPreference = 'Stop'
Set-Location 'C:\Users\User\ticketai'

$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$bk = "_backup_fix5_$stamp"
New-Item -ItemType Directory -Path $bk -Force | Out-Null

function Ok($m){ Write-Host "  OK   $m" -ForegroundColor Green }
function Warn($m){ Write-Host "  WARN $m" -ForegroundColor Yellow }

$typesFile = 'lib\types.ts'
Copy-Item $typesFile "$bk\types.ts.bak" -Force
Write-Host "Backup -> $bk\types.ts.bak" -ForegroundColor Green

# Read lines
$lines = Get-Content $typesFile

# Locate Artist block
$artistStart = -1
$artistEnd = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '^export\s+type\s+Artist\s*=\s*\{') { $artistStart = $i; break }
}
if ($artistStart -ge 0) {
    for ($j = $artistStart + 1; $j -lt $lines.Count; $j++) {
        if ($lines[$j] -match '^\};') { $artistEnd = $j; break }
    }
}

# Locate Event block
$eventStart = -1
$eventEnd = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '^export\s+type\s+Event\s*=\s*\{') { $eventStart = $i; break }
}
if ($eventStart -ge 0) {
    for ($j = $eventStart + 1; $j -lt $lines.Count; $j++) {
        if ($lines[$j] -match '^\};') { $eventEnd = $j; break }
    }
}

Write-Host "Artist block: lines $($artistStart+1) - $($artistEnd+1)" -ForegroundColor Cyan
Write-Host "Event block:  lines $($eventStart+1) - $($eventEnd+1)" -ForegroundColor Cyan

if ($artistStart -lt 0 -or $artistEnd -lt 0) { Warn "Artist block not found"; exit 1 }
if ($eventStart -lt 0 -or $eventEnd -lt 0)   { Warn "Event block not found";  exit 1 }

$newArtist = @'
export type Artist = {
  id: string;
  slug: string;
  name: string;
  bio: string | null;
  city: string | null;
  avatar_url: string | null;
  verified: boolean;
  membership_url: string | null;
  username?: string;
  artist_type?: string;
  social?: { instagram?: string; twitter?: string; spotify?: string; website?: string } | null;
};
'@

$newEvent = @'
export type Event = {
  id: string;
  title: string;
  date: string;
  time?: string | null;
  description?: string | null;
  image?: string | null;
  venue_id?: string | null;
  promoter_id?: string | null;
  organizer_id: string;
  price_from?: number | null;
  price_min?: number | null;
  price_max?: number | null;
  currency?: string | null;
  ticket_url?: string | null;
  resale_claim_expires_at?: string | null;
  resale_completed_at?: string | null;
  resale_new_owner_id?: string | null;
  created_at: string;
  venue?: { id: string; slug: string; name: string; city: string | null; membership_url?: string | null } | null;
  promoter?: { id: string; slug: string; name: string } | null;
  artists?: { slug: string; name: string; verified?: boolean }[];
  organizer?: { slug: string; name: string } | null;
  hasRealPrice?: boolean;
  priceMin?: number;
  priceMax?: number;
  ticketUrl?: string;
  membership_url?: string | null;
  age_restriction?: string | null;
  doors_open_at?: string | null;
};
'@

$newArtistLines = $newArtist -split "`r?`n"
$newEventLines  = $newEvent  -split "`r?`n"

$sorted = @(
    [pscustomobject]@{ Start=$artistStart; End=$artistEnd; Lines=$newArtistLines; Name='Artist' },
    [pscustomobject]@{ Start=$eventStart;  End=$eventEnd;  Lines=$newEventLines;  Name='Event'  }
) | Sort-Object Start -Descending

$out = New-Object System.Collections.Generic.List[string]
for ($i = 0; $i -lt $lines.Count; $i++) { $out.Add($lines[$i]) | Out-Null }

foreach ($block in $sorted) {
    for ($k = $block.End; $k -ge $block.Start; $k--) {
        $out.RemoveAt($k)
    }
    $idx = $block.Start
    foreach ($nl in $block.Lines) {
        $out.Insert($idx, $nl) | Out-Null
        $idx++
    }
    Ok "Replaced $($block.Name) type block"
}

$out -join "`r`n" | Set-Content -Path $typesFile -Encoding UTF8
Write-Host ""
Ok "Wrote $typesFile"

Write-Host ""
Write-Host "===== RUNNING tsc --noEmit =====" -ForegroundColor Cyan
npx tsc --noEmit 2>&1 | Tee-Object -FilePath "_tsc_fix5.txt" | Select-Object -Last 40

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "===== ALL GREEN - 0 ERRORS =====" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "===== Errors remain - see _tsc_fix5.txt =====" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "===== COMMIT =====" -ForegroundColor Cyan
git add -A 2>&1 | Out-Null
git commit -m "fix: replace Event and Artist type blocks cleanly ($stamp)" 2>&1 | Select-Object -First 3

Write-Host ""
Write-Host "DONE." -ForegroundColor Cyan
Write-Host "Backup: $bk" -ForegroundColor DarkGray