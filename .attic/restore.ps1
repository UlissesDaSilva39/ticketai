# ============================================================
#  GRID — Git History Restore
#  Audits git history, then restores the deleted Sidebar.tsx
#  Run:  powershell -ExecutionPolicy Bypass -File .\restore.ps1
# ============================================================

Set-Location 'C:\Users\User\ticketai'

Write-Host ""
Write-Host "===== 1. CURRENT COMMIT =====" -ForegroundColor Cyan
git log --oneline -10

Write-Host ""
Write-Host "===== 2. HISTORY OF components/Sidebar.tsx =====" -ForegroundColor Cyan
git log --oneline --all -- components/Sidebar.tsx

Write-Host ""
Write-Host "===== 3. WORKING TREE STATUS =====" -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "===== 4. FIND LAST COMMIT THAT HAD Sidebar.tsx =====" -ForegroundColor Cyan
$lastGood = git log --all --format="%H" -- components/Sidebar.tsx | Select-Object -First 1
if ($lastGood) {
    Write-Host "Found commit: $lastGood" -ForegroundColor Green
    Write-Host ""
    Write-Host "===== 5. RESTORE Sidebar.tsx FROM THAT COMMIT =====" -ForegroundColor Cyan
    git checkout $lastGood -- components/Sidebar.tsx
    if ($LASTEXITCODE -eq 0) {
        Write-Host "RESTORED components/Sidebar.tsx" -ForegroundColor Green
        Get-Item 'components\Sidebar.tsx' | Select-Object Name, Length, LastWriteTime
    } else {
        Write-Host "Restore failed — see above" -ForegroundColor Red
    }
} else {
    Write-Host "No commit ever contained components/Sidebar.tsx" -ForegroundColor Red
    Write-Host "Falling back to restoring from components/sidebar/Sidebar.tsx" -ForegroundColor Yellow
    if (Test-Path 'components\sidebar\Sidebar.tsx') {
        Copy-Item 'components\sidebar\Sidebar.tsx' 'components\Sidebar.tsx' -Force
        Write-Host "COPIED components/sidebar/Sidebar.tsx -> components/Sidebar.tsx" -ForegroundColor Green
    } else {
        Write-Host "Neither file exists — need manual restore" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "===== 6. RESTORE config/navigation.ts FROM BACKUP =====" -ForegroundColor Cyan
$navBackup = Get-ChildItem -Directory "_backup_nav_cfg_*" -ErrorAction SilentlyContinue |
             Sort-Object LastWriteTime -Descending | Select-Object -First 1
if ($navBackup -and (Test-Path (Join-Path $navBackup.FullName 'navigation.ts.bak'))) {
    Copy-Item (Join-Path $navBackup.FullName 'navigation.ts.bak') 'config\navigation.ts' -Force
    Write-Host "Restored config/navigation.ts from $($navBackup.Name)" -ForegroundColor Green
} elseif ((git log --all --oneline -- config/navigation.ts | Measure-Object).Count -gt 0) {
    git checkout HEAD -- config/navigation.ts
    Write-Host "Restored config/navigation.ts from HEAD" -ForegroundColor Green
} else {
    Write-Host "No backup found for navigation.ts" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "===== 7. VERIFY =====" -ForegroundColor Cyan
foreach ($p in @('components\Sidebar.tsx','config\navigation.ts')) {
    if (Test-Path $p) {
        $f = Get-Item $p
        Write-Host ("OK   {0,-30} {1} bytes" -f $f.Name, $f.Length) -ForegroundColor Green
    } else {
        Write-Host ("MISS {0}" -f $p) -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "===== DONE — Now run:  npm run dev =====" -ForegroundColor Cyan