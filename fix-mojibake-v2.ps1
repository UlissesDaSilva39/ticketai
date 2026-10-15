# fix-mojibake-v2.ps1
# Fixes the corrupted UTF-8 sequences we identified in 10 files.
# Writes back as UTF-8 without BOM. Creates .bak backups first.

$ErrorActionPreference = "Stop"
Set-Location "C:\Users\User\ticketai"

# --- Define corrupted -> correct pairs using Unicode code points ---
# This avoids the terminal corrupting the characters on paste.
# Each corrupted sequence is built from the exact code points it contains.

$fixes = [ordered]@{

  # "Ã¢â‚¬Â¦" = ellipsis
  # bytes were: C3 A2 E2 82 AC C2 A6  (when read as latin1)
  # correct:    E2 80 A6                (U+2026 as UTF-8)
  ([string][char]0x00C3 + [char]0x00A2 + [char]0x20AC + [char]0x00C2 + [char]0x00A6) = [string][char]0x2026

  # "Ã¢â‚¬â€" = em dash
  ([string][char]0x00C3 + [char]0x00A2 + [char]0x20AC + [char]0x201D + [char]0x2013) = [string][char]0x2014
  ([string][char]0x00C3 + [char]0x00A2 + [char]0x20AC + [char]0x201C + [char]0x201D) = [string][char]0x2014

  # "Ã¢â‚¬Â¢" = bullet
  ([string][char]0x00C3 + [char]0x00A2 + [char]0x20AC + [char]0x00C2 + [char]0x00A2) = [string][char]0x2022

  # "Ã¢â‚¬â„¢" = right single quote
  ([string][char]0x00C3 + [char]0x00A2 + [char]0x20AC + [char]0x2122) = [string][char]0x2019

  # "Ã¢â‚¬Å“" = left double quote
  ([string][char]0x00C3 + [char]0x00A2 + [char]0x20AC + [char]0x0153) = [string][char]0x201C

  # "Ã‚·" = middle dot
  ([string][char]0x00C3 + [char]0x201A + [char]0x00B7) = [string][char]0x00B7

  # "Ã‚£" = pound
  ([string][char]0x00C3 + [char]0x201A + [char]0x00A3) = [string][char]0x00A3
}

$targets = @(
  "app\api\og\route.tsx",
  "app\organizer\analytics\page.tsx",
  "app\organizer\campaigns\new\AIBuilder.tsx",
  "app\organizer\events\[id]\page.tsx",
  "app\promoter\analytics\page.tsx",
  "app\promoter\dashboard\page.tsx",
  "app\promoters\[id]\page.tsx",
  "app\resale\[token]\page.tsx",
  "app\tickets\[id]\page.tsx",
  "components\feed\FeedPost.tsx"
)

$totalFixed = 0

foreach ($rel in $targets) {
  $p = Join-Path (Get-Location) $rel
  if (-not (Test-Path -LiteralPath $p)) {
    Write-Host "SKIP (not found): $rel" -ForegroundColor DarkGray
    continue
  }

  $utf8NoBom = New-Object System.Text.UTF8Encoding $false
  $c = [System.IO.File]::ReadAllText($p, $utf8NoBom)
  $before = $c
  $fileFixCount = 0

  foreach ($key in $fixes.Keys) {
    while ($c.Contains($key)) {
      $c = $c.Replace($key, $fixes[$key])
      $fileFixCount++
    }
  }

  if ($fileFixCount -eq 0) {
    Write-Host "NO CHANGE: $rel" -ForegroundColor DarkGray
    continue
  }

  Copy-Item -LiteralPath $p "$p.mojibake-bak" -Force
  [System.IO.File]::WriteAllText($p, $c, $utf8NoBom)
  Write-Host ("FIXED (" + $fileFixCount + "): " + $rel) -ForegroundColor Green
  $totalFixed += $fileFixCount
}

Write-Host ""
Write-Host ("Total replacements: " + $totalFixed) -ForegroundColor Cyan
Write-Host ""
Write-Host "Now run the scan to verify:" -ForegroundColor Yellow
Write-Host "  Get-ChildItem -Path app,components -Recurse -Include *.tsx,*.ts | ForEach-Object { `$hits = Select-String -LiteralPath `$_.FullName -Encoding UTF8 -Pattern 'Â·|Â£|Ã¢' -ErrorAction SilentlyContinue; if (`$hits) { Write-Host (`$_.FullName.Replace(`"`$PWD\`",`"`") + ' (' + `$hits.Count + ' hits)') } }"