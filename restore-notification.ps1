param([string]$TargetCommit)

if (-not $TargetCommit -or $TargetCommit -eq "PASTE_HASH_HERE") {
    Write-Host "Please provide a valid commit hash." -ForegroundColor Red
    Write-Host "Example: .\restore-notification.ps1 -TargetCommit a1b2c3d" -ForegroundColor Yellow
    exit 1
}

$root = (Get-Location).Path
Write-Host "Restoring to commit: $TargetCommit" -ForegroundColor Cyan

# 1. Stash current changes safely
Write-Host "`n[1/3] Stashing current work (so you don't lose the login page)..." -ForegroundColor Yellow
git stash push -u -m "Backup before restoring notification fix $(Get-Date -Format 'yyyyMMdd-HHmmss')"

# 2. Reset to yesterday's commit
Write-Host "`n[2/3] Restoring code..." -ForegroundColor Yellow
git reset --hard $TargetCommit

# 3. Clear Next.js cache
Write-Host "`n[3/3] Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path "$root\.next") {
    Remove-Item "$root\.next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✓ Cache cleared." -ForegroundColor Green
}

Write-Host "`n=== DONE ===" -ForegroundColor Green
Write-Host "You are now on commit: $TargetCommit" -ForegroundColor Cyan
Write-Host "Next: run 'npm run dev' and hard refresh (Ctrl+Shift+R)."
