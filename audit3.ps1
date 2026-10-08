# TicketAI - DB Audit v3 (PowerShell 7, correct count handling)
$env_vars = Get-Content .\.env.local -Raw
$url = (($env_vars -split "`n" | Where-Object { $_ -match '^NEXT_PUBLIC_SUPABASE_URL=' }) -replace '^NEXT_PUBLIC_SUPABASE_URL=','').Trim()
$key = (($env_vars -split "`n" | Where-Object { $_ -match '^SUPABASE_SERVICE_ROLE_KEY=' }) -replace '^SUPABASE_SERVICE_ROLE_KEY=','').Trim()

$headers = @{
  "apikey"        = $key
  "Authorization" = "Bearer $key"
  "Prefer"        = "count=exact"
}

function Get-Count3 {
  param([string]$Table, [string]$Extra = "")
  $uri = "$url/rest/v1/$Table?select=id&limit=1$Extra"
  try {
    $resp = Invoke-WebRequest -Uri $uri -Headers $headers -Method GET -SkipHttpErrorCheck
    $range = $resp.Headers['Content-Range']
    if ($range -is [array]) { $range = $range[0] }
    if ($range -match '/(\d+)$') { return $matches[1] }
    if ($range -match '/\*$') { return "exists" }
    return $range
  } catch {
    return $null
  }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  TicketAI - DB Audit v3" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "URL: $url"
Write-Host ""

Write-Host "--- 1. Tables ---" -ForegroundColor Yellow
$tables = @(
  'profiles','events','venues','promoters','organizers','orders','tickets',
  'notifications','notification_preferences','typing_state','reminders_sent',
  'posts','post_likes','post_comments','profile_comments',
  'artist_tracks','merch','share_events',
  'friendships','follows','conversations','messages','event_reviews','event_likes','event_interest'
)
foreach ($t in $tables) {
  $c = Get-Count3 $t
  if ($null -eq $c) {
    Write-Host ("  {0,-28} MISSING" -f $t) -ForegroundColor DarkGray
  } else {
    Write-Host ("  {0,-28} {1,10} rows" -f $t, $c)
  }
}

Write-Host ""
Write-Host "--- 2. Profiles by role ---" -ForegroundColor Yellow
foreach ($r in @('attendee','promoter','venue','artist','admin')) {
  $c = Get-Count3 "profiles" "&role=eq.$r"
  Write-Host ("  {0,-15} {1,6}" -f $r, $c)
}

Write-Host ""
Write-Host "--- 3. Storage buckets ---" -ForegroundColor Yellow
try {
  $buckets = Invoke-RestMethod -Uri "$url/storage/v1/bucket" -Headers @{ apikey=$key; Authorization="Bearer $key" } -Method GET
  foreach ($b in $buckets) {
    Write-Host ("  {0,-28} public={1}" -f $b.name, $b.public)
  }
} catch {
  Write-Host "  Buckets error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
