Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep 2

Write-Host "Starting dev server..." -ForegroundColor Cyan
$dev = Start-Process cmd.exe -ArgumentList "/c","npm run dev" -PassThru -WindowStyle Hidden -RedirectStandardOutput "dev-server.log" -RedirectStandardError "dev-server.err.log"

$ready = $false
for ($i = 0; $i -lt 90; $i++) {
    Start-Sleep 2
    try {
        Invoke-WebRequest http://localhost:3000 -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop | Out-Null
        $ready = $true
        Write-Host ("  ready after " + ($i*2) + "s") -ForegroundColor Green
        break
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -in 301,302,307,308) {
            $ready = $true
            Write-Host ("  ready (redirect) after " + ($i*2) + "s") -ForegroundColor Green
            break
        }
    }
}
if (-not $ready) {
    Write-Host "server failed to start" -ForegroundColor Red
    Get-Content dev-server.err.log -Tail 30 -ErrorAction SilentlyContinue
    return
}

$routes = @(
    "/", "/home", "/login", "/network", "/people",
    "/cities", "/london", "/manchester", "/berlin",
    "/artists", "/artists/samokafor", "/artists/samokafor/merch",
    "/venues", "/promoters", "/about", "/contact", "/terms", "/privacy", "/refund-policy",
    "/venue/test-first-veneu",
    "/event/3eb54bca-8851-46ba-86b5-480fc7ef9ed1",
    "/sitemap.xml", "/robots.txt"
)

Write-Host ""
Write-Host ("Warming " + $routes.Count + " routes (first-run compile: 3-5 min)...") -ForegroundColor DarkGray
foreach ($r in $routes) {
    Write-Host ("  " + $r) -ForegroundColor DarkGray
    for ($attempt = 1; $attempt -le 3; $attempt++) {
        try {
            Invoke-WebRequest ("http://localhost:3000" + $r) -UseBasicParsing -TimeoutSec 90 -ErrorAction Stop | Out-Null
            break
        } catch {
            if ($attempt -eq 3) {
                Write-Host ("    still failing: " + $r) -ForegroundColor Yellow
            } else {
                Start-Sleep 3
            }
        }
    }
}

Write-Host ""
Write-Host "Running regression..." -ForegroundColor Cyan
Write-Host ""

npx playwright test tests/full-regression.spec.ts --reporter=line

Write-Host ""
Write-Host "Stopping dev server..." -ForegroundColor DarkGray
Stop-Process -Id $dev.Id -Force -ErrorAction SilentlyContinue
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue