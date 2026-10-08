# TicketAI - DB Audit v2 (uses REST API + count via JSON body)
$env_vars = Get-Content .\.env.local -Raw
$url = (($env_vars -split "`n" | Where-Object { $_ -match '^NEXT_PUBLIC_SUPABASE_URL=' }) -replace '^NEXT_PUBLIC_SUPABASE_URL=','').Trim()
$key = (($env_vars -split "`n" | Where-Object { $_ -match '^SUPABASE_SERVICE_ROLE_KEY=' }) -replace '^SUPABASE_SERVICE_ROLE_KEY=','').Trim()

function Get-Count2 {
  param([string]$Table, [string]$Extra = "")

  # Use the /rest/v1/{table}?select=id endpoint with a HEAD request + Prefer count
  $uri = "$url/rest/v1/$Table?select=id&limit=1$Extra"
  $req = [System.Net.HttpWebRequest]::Create($uri)
  $req.Method = "HEAD"          # HEAD is the trick - returns Content-Range without body
  $req.Headers.Add("apikey", $key)
  $req.Headers.Add("Authorization", "Bearer $key")
  $req.PreAuthenticate = $true
  $req.Headers.Add("Prefer", "count=exact")

  try {
    $resp = $req.GetResponse()
    $rangeHeader = $resp.Headers["Content-Range"]
    $resp.Close()

    if ($rangeHeader -is [array]) { $rangeHeader = $rangeHeader[0] }
    if (-not $rangeHeader) { return "0" }

    # Format: "0-0/123" or "*/0" or "0-0/*"
    if ($rangeHeader -match '/(\d+)$') { return $matches[1] }
    if ($rangeHeader -eq '0-0/*') { return "?" }
    return $rangeHeader
  } catch [System.Net.WebException] {
    return $null
  }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  TicketAI - DB Audit v2" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "URL: $url"
Write-Host ""

Write-Host "--- 1. Tables + row counts ---" -ForegroundColor Yellow
$tables = @(
  'profiles','events','venues','promoters','organizers','orders','tickets',
  'notifications','notification_preferences','typing_state','reminders_sent',
  'posts','post_likes','post_comments','profile_comments',
  'artist_tracks','merch','share_events',
  'friendships','follows','conversations','messages','event_reviews','event_likes','event_interest'
)
foreach ($t in $tables) {
  $c = Get-Count2 $t
  if ($null -eq $c) {
    Write-Host ("  {0,-28} MISSING" -f $t) -ForegroundColor DarkGray
  } elseif ($c -eq "?") {
    Write-Host ("  {0,-28} exists (count unavailable)" -f $t) -ForegroundColor DarkYellow
  } else {
    Write-Host ("  {0,-28} {1,6} rows" -f $t, $c)
  }
}

Write-Host ""
Write-Host "--- 2. Profiles by role ---" -ForegroundColor Yellow
foreach ($r in @('attendee','promoter','venue','artist','admin')) {
  $c = Get-Count2 "profiles" "&role=eq.$r"
  Write-Host ("  {0,-15} {1,6}" -f $r, $c)
}

Write-Host ""
Write-Host "--- 3. Storage buckets ---" -ForegroundColor Yellow
$req = [System.Net.WebRequest]::Create("$url/storage/v1/bucket")
$req.Method = "GET"
$req.Headers.Add("apikey", $key)
$req.Headers.Add("Authorization", "Bearer $key")
try {
  $resp = $req.GetResponse()
  $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
  $json = $reader.ReadToEnd()
  $resp.Close()
  $buckets = $json | ConvertFrom-Json
  foreach ($b in $buckets) {
    Write-Host ("  {0,-28} public={1}" -f $b.name, $b.public)
  }
} catch {
  Write-Host "  Buckets error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
