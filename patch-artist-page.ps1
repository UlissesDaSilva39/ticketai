$ErrorActionPreference = "Stop"
$path = "app\artist\[slug]\page.tsx"

if (-not (Test-Path -LiteralPath $path)) {
  Write-Host "SOURCE NOT FOUND" -ForegroundColor Red
  exit 1
}

$backup = "app\artist\[slug]\page.tsx.pre-upgrade.bak"
Copy-Item -LiteralPath $path -Destination $backup -Force
Write-Host "Backup saved" -ForegroundColor Green

$content = Get-Content -LiteralPath $path -Raw -Encoding utf8
$contentN = $content -replace "\`r\`n", "\`n"

if ($contentN -like "*ArtistMusicSection*") { Write-Host "Already patched"; exit 0 }

$anchorA = "IMPORT_SUPABASE_MARKER"
$replacementA = "import { createServerSupabase } from \"@/lib/supabase/server\";\nimport ArtistMusicSection from \"@/components/artist/ArtistMusicSection\";\nimport ArtistBookingSection from \"@/components/artist/ArtistBookingSection\";\nimport ArtistMessageButton from \"@/components/artist/ArtistMessageButton\";"
$anchorB = "                {artist.bio}\n              \u003c/p\u003e\n            \u003c/section\u003e"
$replacementB = "                {artist.bio}\n              \u003c/p\u003e\n            \u003c/section\u003e\n\n            \u003cArtistMusicSection\n              spotifyUrl={artist.spotify}\n              artistName={artist.name}\n            /\u003e"
$anchorC = "                \u003c/ul\u003e\n              )}\n            \u003c/section\u003e\n          \u003c/div\u003e\n\n          \u003caside className=\"space-y-6\"\u003e"
$replacementC = "                \u003c/ul\u003e\n              )}\n            \u003c/section\u003e\n\n            \u003cArtistBookingSection\n              artistSlug={artist.slug}\n              artistName={artist.name}\n            /\u003e\n          \u003c/div\u003e\n\n          \u003caside className=\"space-y-6\"\u003e"
$anchorD = "            \u003csection className=\"bg-white border border-gray-200 rounded-2xl p-6\"\u003e\n              \u003ch3 className=\"text-xs font-bold uppercase tracking-wider text-gray-500 mb-3\"\u003e\n                Details"
$replacementD = "            \u003cArtistMessageButton\n              artistSlug={artist.slug}\n              artistName={artist.name}\n            /\u003e\n\n            \u003csection className=\"bg-white border border-gray-200 rounded-2xl p-6\"\u003e\n              \u003ch3 className=\"text-xs font-bold uppercase tracking-wider text-gray-500 mb-3\"\u003e\n                Details"

$missing = @()
if ($contentN -notlike "*$anchorA*") { $missing += "A" }
if ($contentN -notlike "*$anchorB*") { $missing += "B" }
if ($contentN -notlike "*$anchorC*") { $missing += "C" }
if ($contentN -notlike "*$anchorD*") { $missing += "D" }

if ($missing.Count -gt 0) {
  Write-Host ("Anchors not found: " + ($missing -join ", ")) -ForegroundColor Red
  Write-Host "File unchanged. Backup at $backup."
  exit 1
}

$contentN = $contentN.Replace($anchorA, $replacementA)
$contentN = $contentN.Replace($anchorB, $replacementB)
$contentN = $contentN.Replace($anchorC, $replacementC)
$contentN = $contentN.Replace($anchorD, $replacementD)

Set-Content -LiteralPath $path -Value $contentN -Encoding utf8 -NoNewline

Write-Host "page.tsx patched OK." -ForegroundColor Green
Write-Host ("File size now: " + (Get-Item -LiteralPath $path).Length + " bytes")
