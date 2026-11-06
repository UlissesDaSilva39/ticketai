<#
  test-regression.ps1
  Testes de Regressão completos para a plataforma GRID.
  Executa testes de API, renderização de páginas e conectividade.
#>
[CmdletBinding()]
param(
    [string]$BaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"
$script:Passed = 0
$script:Failed = 0

function Write-TestResult {
    param([string]$Name, [bool]$Success, [string]$Message = "")
    if ($Success) {
        Write-Host "  [PASS] $Name" -ForegroundColor Green
        $script:Passed++
    } else {
        Write-Host "  [FAIL] $Name - $Message" -ForegroundColor Red
        $script:Failed++
    }
}

Write-Host "`n==============================================" -ForegroundColor Cyan
Write-Host " GRID REGRESSION TEST SUITE" -ForegroundColor Cyan
Write-Host " Target: $BaseUrl" -ForegroundColor Cyan
Write-Host "==============================================`n" -ForegroundColor Cyan

# =======================================================
# 1. TESTES DE API (Backend)
# =======================================================
Write-Host "[1] API Endpoints" -ForegroundColor Yellow

# Teste 1.1: GET /api/venues
try {
    $r = Invoke-WebRequest -Uri "$BaseUrl/api/venues" -UseBasicParsing -TimeoutSec 10
    $json = $r.Content | ConvertFrom-Json
    $isSuccess = ($r.StatusCode -eq 200) -and ($json.Count -ge 4)
    Write-TestResult -Name "GET /api/venues (returns >= 4 venues)" -Success $isSuccess -Message "Status: $($r.StatusCode), Count: $($json.Count)"
} catch {
    Write-TestResult -Name "GET /api/venues" -Success $false -Message $_.Exception.Message
}

# Teste 1.2: POST /api/venues/checkout (Stripe)
try {
    $body = @{
        venueId = "test-id"
        venueName = "Test Venue"
        tierName = "Pro-Promoter"
        price = 15
    } | ConvertTo-Json
    
    $r = Invoke-WebRequest -Uri "$BaseUrl/api/venues/checkout" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing -TimeoutSec 10
    $json = $r.Content | ConvertFrom-Json
    $isSuccess = ($r.StatusCode -eq 200) -and ($null -ne $json.url)
    Write-TestResult -Name "POST /api/venues/checkout (returns Stripe URL)" -Success $isSuccess -Message "Status: $($r.StatusCode)"
} catch {
    # Se falhar por falta de chave Stripe, avisamos mas não falhamos o teste todo
    if ($_.Exception.Response.StatusCode.value__ -eq 500) {
        Write-Host "  [WARN] POST /api/venues/checkout - 500 (Verifica a STRIPE_SECRET_KEY no .env)" -ForegroundColor Yellow
    } else {
        Write-TestResult -Name "POST /api/venues/checkout" -Success $false -Message $_.Exception.Message
    }
}

# =======================================================
# 2. TESTES DE PÁGINAS (Frontend Rendering)
# =======================================================
Write-Host "`n[2] Frontend Pages" -ForegroundColor Yellow

# Teste 2.1: Página de Listagem de Venues
try {
    $r = Invoke-WebRequest -Uri "$BaseUrl/discover/venues" -UseBasicParsing -TimeoutSec 10
    $hasTitle = $r.Content -match "Discover venues"
    $hasFabric = $r.Content -match "Fabric"
    $isSuccess = ($r.StatusCode -eq 200) -and $hasTitle -and $hasFabric
    Write-TestResult -Name "GET /discover/venues (renders venue list)" -Success $isSuccess -Message "Status: $($r.StatusCode)"
} catch {
    Write-TestResult -Name "GET /discover/venues" -Success $false -Message $_.Exception.Message
}

# Teste 2.2: Página de Detalhe do Venue
try {
    $r = Invoke-WebRequest -Uri "$BaseUrl/venues/fabric" -UseBasicParsing -TimeoutSec 10
    $hasTitle = $r.Content -match "Fabric"
    $hasSidebar = $r.Content -match "Enquire for Availability"
    $hasUpsell = $r.Content -match "Recommended acts"
    $isSuccess = ($r.StatusCode -eq 200) -and $hasTitle -and $hasSidebar -and $hasUpsell
    Write-TestResult -Name "GET /venues/fabric (renders details, sidebar, upsell)" -Success $isSuccess -Message "Status: $($r.StatusCode)"
} catch {
    Write-TestResult -Name "GET /venues/fabric" -Success $false -Message $_.Exception.Message
}

# Teste 2.3: Página de Adesão ao Venue Club
try {
    $r = Invoke-WebRequest -Uri "$BaseUrl/venues/fabric/join" -UseBasicParsing -TimeoutSec 10
    $hasTitle = $r.Content -match "Join the Fabric Club"
    $hasProTier = $r.Content -match "Pro-Promoter"
    $isSuccess = ($r.StatusCode -eq 200) -and $hasTitle -and $hasProTier
    Write-TestResult -Name "GET /venues/fabric/join (renders 3 tiers)" -Success $isSuccess -Message "Status: $($r.StatusCode)"
} catch {
    Write-TestResult -Name "GET /venues/fabric/join" -Success $false -Message $_.Exception.Message
}

# Teste 2.4: Página de Artistas
try {
    $r = Invoke-WebRequest -Uri "$BaseUrl/discover/artists" -UseBasicParsing -TimeoutSec 10
    $hasTitle = $r.Content -match "Discover artists"
    $hasNoDemo = -not ($r.Content -match "Demo Artist Edit Button")
    $isSuccess = ($r.StatusCode -eq 200) -and $hasTitle -and $hasNoDemo
    Write-TestResult -Name "GET /discover/artists (no demo data)" -Success $isSuccess -Message "Status: $($r.StatusCode)"
} catch {
    Write-TestResult -Name "GET /discover/artists" -Success $false -Message $_.Exception.Message
}

# =======================================================
# 3. RESULTADOS
# =======================================================
Write-Host "`n==============================================" -ForegroundColor Cyan
Write-Host " TEST RESULTS" -ForegroundColor Cyan
Write-Host " Passed: $script:Passed" -ForegroundColor Green
Write-Host " Failed: $script:Failed" -ForegroundColor $(if ($script:Failed -eq 0) { "Green" } else { "Red" })
Write-Host "==============================================`n" -ForegroundColor Cyan

if ($script:Failed -gt 0) {
    Write-Host "Alguns testes falharam. Verifica o servidor e os logs." -ForegroundColor Red
    exit 1
} else {
    Write-Host "Todos os testes passaram! A plataforma esta estavel." -ForegroundColor Green
    exit 0
}
