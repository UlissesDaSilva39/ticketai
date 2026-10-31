$ErrorActionPreference = "Continue"
Set-Location "C:\Users\User\ticketai"
$card = "components\network\PersonCard.tsx"
$hrefLine = (Select-String -Path $card -Pattern "const href" | Select-Object -First 1).Line
$m = [regex]::Match($hrefLine, 'const href = person\.username \? "([^"]+)"')
$prefix = $m.Groups[1].Value.Trim('/')
Write-Host "Card links to: /$prefix/[username]" -ForegroundColor Green
$newSource = Get-ChildItem -Path "app" -Recurse -Filter "page.tsx" | Where-Object { $r = Get-Content $_.FullName -Raw; ($r -match "Profile Song") -and ($r -match "Their Network") } | Select-Object -First 1
Write-Host "Source: $($newSource.FullName.Replace("$PWD\",""))" -ForegroundColor Green
$targets = @("app\$prefix\[username]\page.tsx","app\$prefix\[slug]\page.tsx","app\$prefix\[id]\page.tsx")
$targetFile = $null
foreach ($t in $targets) { if (Test-Path (Split-Path $t -Parent)) { $targetFile = $t; break } }
if (!$targetFile) { $targetFile = $targets[0]; New-Item -ItemType Directory -Path (Split-Path $targetFile -Parent) -Force | Out-Null }
Write-Host "Target: $targetFile" -ForegroundColor White
$srcRaw = Get-Content $newSource.FullName -Raw
$pm = [regex]::Match($srcRaw, 'params:\s*Promise<\{\s*(\w+):')
$srcParam = if ($pm.Success) { $pm.Groups[1].Value } else { "username" }
$tgtParam = if ($targetFile -match '\[(\w+)\]') { $matches[1] } else { "username" }
$final = $srcRaw
if ($srcParam -ne $tgtParam) { $final = $final -replace "params:\s*Promise<\{\s*$srcParam:\s*string\s*\}>", "params: Promise<{ $tgtParam: string }>"; $final = $final -replace "const\s+\{\s*$srcParam\s*\}\s*=\s*await\s+params;", "const { $tgtParam } = await params;"; $final = $final -replace "\b$srcParam\b", $tgtParam }
if (Test-Path $targetFile) { $bak = "$targetFile.bak-$(Get-Date -Format 'yyyyMMdd-HHmmss')"; Copy-Item $targetFile $bak -Force; Write-Host "Backup: $bak" -ForegroundColor Gray }
Set-Content -Path $targetFile -Value $final -Encoding UTF8
Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
$check = Get-Content $targetFile -Raw
Write-Host "Profile Song:  $($check -match 'Profile Song')" -ForegroundColor Green
Write-Host "Their Network: $($check -match 'Their Network')" -ForegroundColor Green
Write-Host "MessageButton: $($check -match 'MessageButton')" -ForegroundColor Green
Write-Host "FollowButton:  $($check -match 'FollowButton')" -ForegroundColor Green
