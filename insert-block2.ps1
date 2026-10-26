cd C:\Users\User\ticketai
$stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$bk1 = "_backup_home_$stamp"
New-Item -ItemType Directory -Path $bk1 -Force | Out-Null
$homeFile = 'app\page.tsx'
if (-not (Test-Path $homeFile)) { Write-Host "FAIL: page.tsx not found" -ForegroundColor Red; exit 1 }
if (-not (Test-Path 'sections.txt')) { Write-Host "FAIL: sections.txt not found" -ForegroundColor Red; exit 1 }
Copy-Item $homeFile (Join-Path $bk1 'page.tsx.bak') -Force
$content = Get-Content $homeFile -Raw
if ($content -match 'See it in action') { Write-Host "SKIP: already present"; exit 0 }
$idx = $content.LastIndexOf('READY TO MOVE')
if ($idx -lt 0) { $idx = $content.LastIndexOf('Ready to move') }
if ($idx -lt 0) { Write-Host "FAIL: READY TO MOVE marker not found" -ForegroundColor Red; exit 1 }
$sectionStart = $content.LastIndexOf('<section', $idx)
if ($sectionStart -lt 0) { Write-Host "FAIL: section marker not found" -ForegroundColor Red; exit 1 }
$sections = Get-Content 'sections.txt' -Raw
$newContent = $content.Substring(0, $sectionStart) + $sections + "`r `n" + $content.Substring($sectionStart)
Set-Content -Path $homeFile -Value $newContent -Encoding UTF8
$newSize = (Get-Item $homeFile).Length
Write-Host "OK: Wrote $homeFile ($newSize bytes, was $($content.Length))" -ForegroundColor Green
$verify = Get-Content $homeFile -Raw
$ok = $true
foreach ($p in @('See it in action','Why not just use','45,000+','Face-Value Resale','Is GRID free')) {
    if ($verify -match [regex]::Escapee($p)) { Write-Host "OK: $p" } else { Write-Host "FAIL: $p" -ForegroundColor Red; $ok = $false }
}
if (-not $ok) { Write-Host "Some checks failed but file was written" -ForegroundColor Yellow } else { Write-Host "All sections present" -ForegroundColor Green }

