$ErrorActionPreference = "Continue"
$root = "C:\Users\User\ticketai"
Set-Location $root

Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  GRID CLEAN INSTALL" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

Write-Host "[1/6] Killing Node and VS Code processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process code -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "[2/6] Freeing ports 3000 and 3001..." -ForegroundColor Yellow
foreach ($port in @(3000, 3001)) {
    $listeners = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($listeners) {
        $listeners | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
    }
}

Write-Host "[3/6] Removing node_modules and package-lock.json..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    if (Test-Path "node_modules") {
        cmd /c "rmdir /s /q node_modules" 2>$null
    }
}
if (Test-Path "package-lock.json") { Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue }

Write-Host "[4/6] Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force 2>&1 | Out-Null

Write-Host "[5/6] Installing dependencies..." -ForegroundColor Yellow
$start = Get-Date
npm install 2>&1 | Tee-Object -FilePath "install-log.txt" | Out-Null
$duration = [math]::Round(((Get-Date) - $start).TotalSeconds)
Write-Host "  Install completed in $duration seconds" -ForegroundColor Green

$log = Get-Content "install-log.txt" -Raw -ErrorAction SilentlyContinue
$tarErrors = ([regex]::Matches($log, 'TAR_ENTRY_ERROR')).Count

Write-Host "[6/6] Verifying installation..." -ForegroundColor Yellow
$checks = @("node_modules", "node_modules\typescript", "node_modules\next", "node_modules\react", "node_modules\@types\react")
$allGood = $true
foreach ($c in $checks) {
    if (Test-Path $c) {
        Write-Host "  OK  $c" -ForegroundColor Green
    } else {
        Write-Host "  MISSING  $c" -ForegroundColor Red
        $allGood = $false
    }
}

if (Test-Path ".next") { Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue }

Write-Host ""
if ($allGood -and $tarErrors -eq 0) {
    Write-Host "  All dependencies installed successfully" -ForegroundColor Green
    Write-Host "  Next step: npm run dev" -ForegroundColor Cyan
} else {
    Write-Host "  Issues detected:" -ForegroundColor Red
    if (-not $allGood) { Write-Host "    - Some packages missing" -ForegroundColor Red }
    if ($tarErrors -gt 0) { Write-Host "    - $tarErrors TAR errors" -ForegroundColor Red }
    Write-Host "  Turn off Windows Defender and run again." -ForegroundColor Yellow
}
