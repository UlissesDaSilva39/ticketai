$ErrorActionPreference = "Continue"
Set-Location "C:\Users\User\ticketai"

$target = "33e5dd4"

$layoutFiles = @(
    "grid/src/app/globals.css",
    "grid/src/app/feed/page.tsx",
    "grid/src/components/sidebar/LeftSidebar.tsx",
    "grid/src/components/sidebar/RightSidebar.tsx",
    "grid/src/components/sidebar/PromotedMerch.tsx",
    "grid/src/components/sidebar/Footer.tsx"
)

function Section($t) {
    Write-Host ""
    Write-Host ("=" * 70) -ForegroundColor DarkCyan
    Write-Host "  $t" -ForegroundColor Cyan
    Write-Host ("=" * 70) -ForegroundColor DarkCyan
}

Section "0. Environment"
if (-not (Test-Path ".git")) {
    Write-Host "No .git folder here. Aborting." -ForegroundColor Red
    exit 1
}
git --version
Write-Host ""
Write-Host "Branch:" -ForegroundColor Cyan
git rev-parse --abbrev-ref HEAD
Write-Host ""
Write-Host "HEAD:" -ForegroundColor Cyan
git log -1 --pretty=format:"%h  %ad  %an  %s" --date=iso
Write-Host ""

Section "1. Working tree status"
$status = git status --short
if ($status) { $status } else { Write-Host "clean." -ForegroundColor Green }

Section "2. All commits from yesterday"
$y = git log --since="yesterday 00:00" --until="today 00:00" --pretty=format:"%h  %ad  %an  %s" --date=iso
if ($y) { $y | ForEach-Object { Write-Host "    $_" } } else { Write-Host "    (none)" -ForegroundColor Yellow }

Section "3. Commits today"
$t = git log --since="today 00:00" --pretty=format:"%h  %ad  %an  %s" --date=iso
if ($t) { $t | ForEach-Object { Write-Host "    $_" -ForegroundColor Yellow } } else { Write-Host "    (none)" -ForegroundColor DarkGray }

Section "4. Target commit"
git rev-parse --verify $target 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Target $target not found." -ForegroundColor Red
    exit 1
}
git log -1 $target --pretty=format:"%h  %ad  %an  %s" --date=iso
Write-Host ""

Section "5. What the target commit changed"
git --no-pager show $target --stat

Section "6. Diff: target .. HEAD"
git --no-pager diff "$target..HEAD" --stat

Section "7. globals.css at target"
git --no-pager show "${target}:grid/src/app/globals.css"

Section "8. feed/page.tsx at target (first 80 lines)"
git --no-pager show "${target}:grid/src/app/feed/page.tsx" | Select-Object -First 80

Section "9. Layout files in target"
foreach ($f in $layoutFiles) {
    git cat-file -e "${target}:$f" 2>$null
    if ($LASTEXITCODE -eq 0) { Write-Host "    PRESENT  $f" -ForegroundColor Green }
    else                     { Write-Host "    absent   $f" -ForegroundColor DarkGray }
}

Section "10. Confirm restore"
Write-Host "Restore these files from $target ?" -ForegroundColor Cyan
Write-Host "Uncommitted changes to them will be lost." -ForegroundColor Yellow
Write-Host "Undo afterwards with:  git restore ." -ForegroundColor DarkGray
Write-Host ""
$answer = Read-Host "Type 'yes' to proceed, anything else to abort"
if ($answer -ne "yes") {
    Write-Host "Aborted. Nothing changed." -ForegroundColor Yellow
    exit 0
}

Section "11. Restoring"
foreach ($f in $layoutFiles) {
    git cat-file -e "${target}:$f" 2>$null
    if ($LASTEXITCODE -eq 0) {
        git restore --source=$target -- $f
        Write-Host "    restored $f" -ForegroundColor Green
    } else {
        Write-Host "    skipped  $f (not in target)" -ForegroundColor DarkGray
    }
}

Section "12. Git status after restore"
git status --short

Section "13. Restart dev server"
$gridDir = "C:\Users\User\ticketai\grid"

Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique |
    ForEach-Object {
        if ($_ -and $_ -ne 0) {
            Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
            Write-Host "    killed PID $_ on port 3000" -ForegroundColor Yellow
        }
    }

$nextDir = Join-Path $gridDir ".next"
if (Test-Path $nextDir) {
    Remove-Item $nextDir -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "    .next cleared" -ForegroundColor Green
}

Write-Host ""
Write-Host "==> Starting dev server. KEEP THIS WINDOW OPEN." -ForegroundColor Green
Write-Host ""

Set-Location $gridDir
npm run dev