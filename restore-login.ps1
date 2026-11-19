# restore-login.ps1 — Restore the original login page from git history or backup
$ErrorActionPreference = "Stop"
$root = (Get-Location).Path
Write-Host "Root: $root" -ForegroundColor Cyan

$loginPath = "$root\app\login\page.tsx"
if (-not (Test-Path "$root\app") -and (Test-Path "$root\src\app")) {
    $loginPath = "$root\src\app\login\page.tsx"
}
Write-Host "Login page path: $loginPath" -ForegroundColor Cyan

# ─── 1. Show git history for login page ─────────────────
Write-Host "`n=== 1. Git history for login page ===" -ForegroundColor Cyan
$gitLog = git log --oneline -- "$loginPath" 2>$null
if ($gitLog) {
    $gitLog -split "`n" | ForEach-Object { Write-Host "  $_" -ForegroundColor White }
} else {
    Write-Host "  No git history found for this file (it may be untracked)" -ForegroundColor Yellow
}

# ─── 2. Check for backup files ───────────────────────────
Write-Host "`n=== 2. Backup folders found ===" -ForegroundColor Cyan
$backupFolders = @()
foreach ($pattern in @(".login-backup-*", ".login-home-backup-*", ".home-backup-*", ".middleware-fix-backup-*", ".scaffold-backup-*")) {
    $dirs = Get-ChildItem $root -Directory -Filter $pattern -ErrorAction SilentlyContinue
    foreach ($d in $dirs) {
        $backupFolders += $d.FullName
        Write-Host "  $($d.Name)" -ForegroundColor White
    }
}
if ($backupFolders.Count -eq 0) {
    Write-Host "  None found" -ForegroundColor Yellow
}

# ─── 3. Look for app_login_page.tsx.bak in backups ───────
Write-Host "`n=== 3. Login page backups (app_login_page.tsx.*.bak) ===" -ForegroundColor Cyan
$loginBackups = @()
foreach ($folder in $backupFolders) {
    $baks = Get-ChildItem $folder -Recurse -Filter "app_login_page.tsx*.bak" -ErrorAction SilentlyContinue
    foreach ($b in $baks) {
        $loginBackups += $b.FullName
        Write-Host "  $($b.FullName)" -ForegroundColor White
        Write-Host "    ($($b.LastWriteTime), $((Get-Content $b.FullName).Count) lines)" -ForegroundColor DarkGray
    }
}
if ($loginBackups.Count -eq 0) {
    Write-Host "  None found — will need to use git" -ForegroundColor Yellow
}

# ─── 4. Choose restore source ────────────────────────────
Write-Host "`n=== 4. Restore options ===" -ForegroundColor Cyan

if ($loginBackups.Count -gt 0) {
    Write-Host "  Option A: Restore from newest backup" -ForegroundColor Green
    Write-Host "    $($loginBackups[-1])" -ForegroundColor DarkGray
}
if ($gitLog) {
    Write-Host "  Option B: Restore from git commit (enter hash)" -ForegroundColor Green
    Write-Host "    See section 1 for available hashes" -ForegroundColor DarkGray
}
Write-Host "  Option C: Abort" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Choose: A (backup), B (git hash), or C (abort)"

if ($choice -match '^(c|abort)$') {
    Write-Host "Aborted — nothing changed." -ForegroundColor Yellow
    exit 0
}

$restored = $false

if ($choice -match '^(a|backup)$') {
    if ($loginBackups.Count -eq 0) {
        Write-Host "No backups found — cannot restore from backup." -ForegroundColor Red
        exit 1
    }
    # Backup current broken version first
    $safetyBak = "$loginPath.broken-$(Get-Date -Format yyyyMMdd-HHmmss).bak"
    Copy-Item $loginPath $safetyBak -Force
    Write-Host "  [safety] saved current version to: $safetyBak" -ForegroundColor DarkYellow

    # Restore newest backup
    $newest = $loginBackups[-1]
    Copy-Item $newest $loginPath -Force
    Write-Host "  ✓ Restored from: $newest" -ForegroundColor Green
    $restored = $true

} elseif ($choice -match '^(b|git)$') {
    $hash = Read-Host "Enter commit hash"
    if (-not $hash) {
        Write-Host "No hash entered — aborting." -ForegroundColor Yellow
        exit 0
    }
    $hash = $hash.Trim()

    # Backup current broken version first
    $safetyBak = "$loginPath.broken-$(Get-Date -Format yyyyMMdd-HHmmss).bak"
    Copy-Item $loginPath $safetyBak -Force
    Write-Host "  [safety] saved current version to: $safetyBak" -ForegroundColor DarkYellow

    # Restore from git
    $relPath = $loginPath.Replace("$root\", "").Replace("\", "/")
    git checkout $hash -- $relPath
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Restored from git commit: $hash" -ForegroundColor Green
        $restored = $true
    } else {
        Write-Host "  ✗ Git checkout failed" -ForegroundColor Red
        Write-Host "    Restoring from safety backup instead..." -ForegroundColor Yellow
        Copy-Item $safetyBak $loginPath -Force
        exit 1
    }
} else {
    Write-Host "Invalid choice — aborting." -ForegroundColor Yellow
    exit 0
}

# ─── 5. Verify restored file ─────────────────────────────
if ($restored) {
    Write-Host "`n=== 5. Restored login page (first 15 lines) ===" -ForegroundColor Cyan
    Get-Content $loginPath | Select-Object -First 15 | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }

    $lineCount = (Get-Content $loginPath).Count
    Write-Host "`n  Total: $lineCount lines" -ForegroundColor White

    # Quick sanity checks
    $content = Get-Content $loginPath -Raw
    Write-Host "`n  Sanity checks:" -ForegroundColor Cyan
    if ($content -match 'export default') {
        Write-Host "    ✓ has default export" -ForegroundColor Green
    } else {
        Write-Host "    ✗ no default export" -ForegroundColor Red
    }
    if ($content -match 'use client') {
        Write-Host "    ✓ has 'use client'" -ForegroundColor Green
    } else {
        Write-Host "    ⚠ no 'use client' (may be intentional)" -ForegroundColor Yellow
    }
    if ($content -match '<form' -or $content -match 'onSubmit') {
        Write-Host "    ✓ has form / submit handler" -ForegroundColor Green
    } else {
        Write-Host "    ⚠ no form found" -ForegroundColor Yellow
    }
}

# ─── 6. Clear .next ──────────────────────────────────────
Write-Host "`n=== 6. Clear .next cache ===" -ForegroundColor Cyan
if (Test-Path "$root\.next") {
    try {
        Remove-Item "$root\.next" -Recurse -Force -ErrorAction Stop
        Write-Host "  ✓ .next cleared" -ForegroundColor Green
    } catch {
        Write-Host "  ⚠ Stop dev server and run: Remove-Item .next -Recurse -Force" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ℹ .next not present" -ForegroundColor DarkGray
}

# ─── 7. Next steps ───────────────────────────────────────
Write-Host "`n=== DONE ===" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "  1. If dev server is running, restart it (Ctrl+C, then npm run dev)" -ForegroundColor White
Write-Host "  2. Browser: Ctrl+Shift+R (hard refresh)" -ForegroundColor White
Write-Host "  3. Visit http://localhost:3000/login — should show your original form" -ForegroundColor White
Write-Host ""
Write-Host "If the restored page doesn't call /api/auth/login," -ForegroundColor Yellow
Write-Host "check its fetch URL — it might use a different endpoint." -ForegroundColor Yellow
