$ErrorActionPreference = "Stop"
Set-Location "C:\Users\User\ticketai"
$TicketId = "98ad2ac0-63d5-4585-a23d-64e6d66f2e8b"
Write-Host "Diagnostic v2 starting..." -ForegroundColor Cyan

$raw = [System.IO.File]::ReadAllText("$PWD\.env.local")
$raw = $raw -replace "`r`n", "`n" -replace "`r", "`n" -replace "^\uFEFF", ""
$lines = $raw -split "`n"

$envMap = @{}
foreach ($l in $lines) {
    if ($l -match "^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$") {
        $k = $matches[1]; $v = $matches[2].Trim()
        if ($v.StartsWith('"') -and $v.EndsWith('"')) { $v = $v.Substring(1, $v.Length - 2) }
        elseif ($v.StartsWith("'") -and $v.EndsWith("'")) { $v = $v.Substring(1, $v.Length - 2) }
        $envMap[$k] = $v
    }
}

$supabaseUrl    = $envMap["NEXT_PUBLIC_SUPABASE_URL"]
$serviceRoleKey = $envMap["SUPABASE_SERVICE_ROLE_KEY"]

Write-Host ("URL present: " + [bool]$supabaseUrl) -ForegroundColor Green
Write-Host ("Key length : " + $serviceRoleKey.Length) -ForegroundColor Green
Write-Host ("Key tail   : " + ([int[]][char[]]$serviceRoleKey[-3..-1] -join ",")) -ForegroundColor Green

if ($serviceRoleKey.Length -lt 100) {
    Write-Host "Service key too short - placeholder in .env.local" -ForegroundColor Red
    exit 1
}

$headers = @{
    "apikey" = $serviceRoleKey
    "Authorization" = "Bearer $serviceRoleKey"
    "Accept" = "application/json"
}

try {
    $ticket = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/tickets?id=eq.$TicketId&select=*" -Headers $headers -Method Get
    Write-Host "Query OK" -ForegroundColor Green
} catch {
    $code = $_.Exception.Response.StatusCode.value__
    Write-Host ("HTTP " + $code) -ForegroundColor Red
    exit 1
}

if (-not $ticket -or $ticket.Count -eq 0) {
    Write-Host "Ticket row NOT FOUND" -ForegroundColor Red
    $recent = Invoke-RestMethod -Uri "$supabaseUrl/rest/v1/tickets?select=id,user_id,event_id,status,created_at&order=created_at.desc&limit=5" -Headers $headers -Method Get
    if ($recent.Count -eq 0) {
        Write-Host "tickets table is EMPTY" -ForegroundColor Red
    } else {
        $recent | Format-Table -AutoSize | Out-String | Write-Host
    }
} else {
    $t = $ticket[0]
    Write-Host "Ticket EXISTS" -ForegroundColor Green
    Write-Host ("  id       = " + $t.id)
    Write-Host ("  user_id  = " + $t.user_id)
    Write-Host ("  event_id = " + $t.event_id)
    Write-Host ("  status   = " + $t.status)
}

Write-Host "--- ticket page lines 40-70 ---" -ForegroundColor Yellow
$all = Get-Content -LiteralPath "app\tickets\[id]\page.tsx"
for ($i = 39; $i -lt [Math]::Min(70, $all.Count); $i++) {
    Write-Host ("  " + ($i+1).ToString().PadLeft(4) + ": " + $all[$i])
}
