# fix-mojibake.ps1
# Save this file as UTF-8 (no BOM) in VS Code.
# Run from C:\Users\User\ticketai as:  powershell -File .\fix-mojibake.ps1

$ErrorActionPreference = "Stop"

# We use Unicode code point escapes so the script doesn't depend on
# how the terminal or file itself was encoded.
# Each entry: [corrupted string] = [correct string]
# The corrupted string is built from code points to guarantee it matches.

$fixes = [ordered]@{
  # "Ã‚Â·"  (U+00C3 U+201A U+00C2 U+00B7) -> "·" (U+00B7)
  ([string][char]0x00C3 + [string][char]0x201A + [string][char]0x00C2 + [string][char]0x00B7) = [string][char]0x00B7

  # "Ã‚Â£" -> "£"
  ([string][char]0x00C3 + [string][char]0x201A + [string][char]0x00C2 + [string][char]0x00A3) = [string][char]0x00A3

  # "â€"" (U+00E2 U+20AC U+201C) -> "—" (U+2014)
  ([string][char]0x00E2 + [string][char]0x20AC + [string][char]0x201C) = [string][char]0x2014

  # "â€"" (U+00E2 U+20AC U+201D) -> "—"
  ([string][char]0x00E2 + [string][char]0x20AC + [string][char]0x201D) = [string][char]0x2014

  # "â€"" (U+00E2 U+20AC U+2013) -> "–" (U+2013)
  ([string][char]0x00E2 + [string][char]0x20AC + [string][char]0x2013) = [string][char]0x2013

  # "â€™" -> "'" (U+2019)
  ([string][char]0x00E2 + [string][char]0x20AC + [string][char]0x2122) = [string][char]0x2019

  # "â€˜" -> "'"
  ([string][char]0x00E2 + [string][char]0x20AC + [string][char]0x02DC) = [string][char]0x2018

  # "â€œ" -> '"'
  ([string][char]0x00E2 + [string][char]0x20AC + [string][char]0x0153) = [string][char]0x201C

  # "â€" (partial, only two chars after the leading â) -> "—"
  ([string][char]0x00E2 + [string][char]0x20AC) = [string][char]0x2014

  # Lone "Â·" -> "·"
  ([string][char]0x00C2 + [string][char]0x00B7) = [string][char]0x00B7

  # Lone "Â£" -> "£"
  ([string][char]0x00C2 + [string][char]0x00A3) = [string][char]0x00A3
}

$targets = @(
  'components\feed\FeedPost.tsx',
  'app\my-tickets\page.tsx',
  'app\search\page.tsx',
  'app\for-promoters\page.tsx',
  'app\for-venues\page.tsx',
  'app\organizer\events\[id]\page.tsx'
)

foreach ($rel in $targets) {
  $p = Join-Path (Get-Location) $rel
  if (-not (Test-Path -LiteralPath $p)) {
    Write-Host "SKIP (not found): $rel"
    continue
  }

  $c = [IO.File]::ReadAllText($p, [Text.UTF8Encoding]::new($false))
  $before = $c

  foreach ($k in $fixes.Keys) {
    if ($c.Contains($k)) {
      $c = $c.Replace($k, $fixes[$k])
    }
  }

  if ($c -eq $before) {
    Write-Host "NO CHANGE: $rel"
    continue
  }

  Copy-Item -LiteralPath $p "$p.mojibake-bak" -Force
  [IO.File]::WriteAllText($p, $c, [Text.UTF8Encoding]::new($false))
  Write-Host "FIXED: $rel"
}