# ============================================================
# check-login.ps1 — Full diagnostic for the /home redirect issue
# ============================================================
$ErrorActionPreference = "Continue"
$out = @()

function Section($title) {
    $line = "`n========== $title =========="
    Write-Host $line -ForegroundColor Cyan
    $script:out += $line
}

function Info($text, $color = "White") {
    Write-Host "  $text" -ForegroundColor $color
    $script:out += "  $text"
}

# ─── 1. LOGIN PAGE ────────────────────────────────────────
Section "1. LOGIN PAGE FILE"

$loginFiles = Get-ChildItem -Recurse -Include "page.tsx","page.jsx" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -match '\\login\\' -and $_.FullName -notmatch 'node_modules|\.next' }

if ($loginFiles) {
    foreach ($f in $loginFiles) {
        Info "FILE: $($f.FullName)" Green
    }
    $loginContent = Get-Content $loginFiles[0].FullName -Raw
    Info "--- CONTENT ---" DarkGray
    $script:out += $loginContent
    Write-Host $loginContent -ForegroundColor Gray
} else {
    Info "NO login page file found" Red
}

# ─── 2. LOGIN API ROUTE ───────────────────────────────────
Section "2. LOGIN API ROUTE"

$apiFiles = Get-ChildItem -Recurse -Include "route.ts","route.js" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch 'node_modules|\.next' -and $_.FullName -match 'login|auth|signin|session' }

if ($apiFiles) {
    foreach ($f in $apiFiles) {
        Info "FILE: $($f.FullName)" Green
    }
    $apiContent = Get-Content $apiFiles[0].FullName -Raw
    Info "--- CONTENT ---" DarkGray
    $script:out += $apiContent
    Write-Host $apiContent -ForegroundColor Gray
} else {
    Info "NO login API route found (this is likely the bug!)" Red
}

# ─── 3. FILES THAT SET COOKIES ────────────────────────────
Section "3. FILES THAT SET COOKIES"

$cookieSetters = @()
Get-ChildItem -Recurse -Include "*.ts","*.tsx","*.js","*.jsx" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch 'node_modules|\.next|\.bak' } |
    ForEach-Object {
        $c = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
        if ($c -match 'Set-Cookie|cookies\(\)\.set|cookies\.set\(') {
            $rel = $_.FullName.Replace((Get-Location).Path, "").TrimStart('\','/')
            $cookieSetters += $rel
        }
    }

if ($cookieSetters.Count -gt 0) {
    foreach ($s in $cookieSetters) { Info $s Yellow }
} else {
    Info "NO file sets cookies anywhere — login never creates a session!" Red
}

# ─── 4. MIDDLEWARE COOKIE NAME ────────────────────────────
Section "4. MIDDLEWARE EXPECTED COOKIE"

$mw = "middleware.ts"
if (-not (Test-Path $mw)) { $mw = "src\middleware.ts" }

if (Test-Path $mw) {
    Info "FILE: $mw" Green
    $mwContent = Get-Content $mw -Raw
    if ($mwContent -match 'AUTH_COOKIE_NAME\s*=\s*(?:process\.env\.NEXT_PUBLIC_AUTH_COOKIE_NAME\s*\?\?\s*)?"([^"]+)"') {
        Info "Middleware expects cookie: '$($Matches[1])'" Yellow
    } else {
        Info "Could not parse AUTH_COOKIE_NAME" Red
    }
    if ($mwContent -match 'PROTECTED_PATHS\s*=\s*\[([^\]]+)\]') {
        Info "Protected paths: $($Matches[1].Trim())" White
    }
} else {
    Info "NO middleware file found" Red
}

# ─── 5. ENV VARS ──────────────────────────────────────────
Section "5. ENV CONFIG"

$envFile = ".env.local"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match 'NEXT_PUBLIC_AUTH_COOKIE_NAME\s*=\s*(\S+)') {
        Info "NEXT_PUBLIC_AUTH_COOKIE_NAME = $($Matches[1])" Yellow
    } else {
        Info "NEXT_PUBLIC_AUTH_COOKIE_NAME not set in .env.local" Yellow
    }
} else {
    Info ".env.local not found" Red
}

# ─── 6. DEV SERVER REACHABLE? ─────────────────────────────
Section "6. DEV SERVER CHECK"

try {
    $r = Invoke-WebRequest -Uri "http://localhost:3000/" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Info "Server is UP (HTTP $($r.StatusCode))" Green
} catch {
    Info "Server not reachable at localhost:3000" Red
}

# ─── 7. DIAGNOSIS ─────────────────────────────────────────
Section "7. DIAGNOSIS"

$hasLoginPage = ($loginFiles.Count -gt 0)
$hasApiRoute  = ($apiFiles.Count -gt 0)
$hasCookie    = ($cookieSetters.Count -gt 0)

if (-not $hasLoginPage) {
    Info "BUG: No login page exists" Red
} elseif (-not $hasApiRoute) {
    Info "BUG: No login API route — login form has nowhere to POST" Red
    Info "FIX: Create app/api/auth/login/route.ts (see below)" Yellow
} elseif (-not $hasCookie) {
    Info "BUG: Login API exists but never sets a cookie" Red
    Info "FIX: Add response.cookies.set('ticketai_session', ...) to the route" Yellow
} else {
    Info "Login page ✓  Login API ✓  Cookie setter ✓" Green
    Info "If /home still redirects, check browser DevTools → Cookies for 'ticketai_session'" Yellow
    Info "Cookie might be set with wrong path or name — check section 3 vs section 4" Yellow
}

# ─── 8. WRITE REPORT ──────────────────────────────────────
$reportPath = "login-report.txt"
$script:out -join "`n" | Set-Content -Path $reportPath -Encoding UTF8
Write-Host "`n=== Full report saved to: $reportPath ===" -ForegroundColor Green
