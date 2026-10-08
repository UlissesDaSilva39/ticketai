# TicketAI - DB Audit (fixed)

$env_vars = Get-Content .\.env.local -Raw
$url = (($env_vars -split "`n" | Where-Object { $_ -match '^NEXT_PUBLIC_SUPABASE_URL=' }) -replace '^NEXT_PUBLIC_SUPABASE_URL=','').Trim()
$key = (($env_vars -split "`n" | Where-Object { $_ -match '^SUPABASE_SERVICE_ROLE_KEY=' }) -replace '^SUPABASE_SERVICE_ROLE_KEY=','').Trim()

if (-not $url -or -not $key) {
  Write-Host "Missing env vars in .env.local" -ForegroundColor Red
  exit 1
}

function Get-Count {
  param([string]$Table, [string]$Extra = "")
  $uri = "$url/rest/v1/$Table?select=*&limit=0$Extra"
  $req = [System.Net.WebRequest]::Create($uri)
  $req.Method = "GET"
  $req.Headers.Add("apikey", $key)
  $req.Headers.Add("Authorization", "Bearer $key")
  $req.Headers.Add("Prefer", "count=exact")
  try {
    $resp = $req.GetResponse()
    $rangeHeader = $resp.Headers["Content-Range"]
    $resp.Close()

    # Windows PowerShell returns the header as an array - take the first element
    $range = if ($rangeHeader -is [array]) { $rangeHeader[0] } else { $rangeHeader }
    $count = ($range -split '/')[-1]
    return $count
  } catch {
    return $null
  }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  TicketAI - DB Audit" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "URL: $url"
Write-Host ""

# ---------- 1. Tables + row counts ----------
Write-Host "--- 1. Tables + row counts ---" -ForegroundColor Yellow
$tables = @(
  'profiles','events','venues','promoters','organizers','orders','tickets',
  'notifications','notification_preferences','typing_state','reminders_sent',
  'posts','post_likes','post_comments','profile_comments',
  'artist_tracks','merch','share_events',
  'friendships','follows','conversations','messages','event_reviews','event_likes','event_interest'
)
$results = @{}
foreach ($t in $tables) {
  $c = Get-Count $t
  $results[$t] = $c
  if ($null -eq $c) {
    Write-Host ("  {0,-28} MISSING" -f $t) -ForegroundColor DarkGray
  } else {
    Write-Host ("  {0,-28} {1,6} rows" -f $t, $c)
  }
}

# ---------- 2. Profiles by role ----------
Write-Host ""
Write-Host "--- 2. Profiles by role ---" -ForegroundColor Yellow
foreach ($r in @('attendee','promoter','venue','artist','admin')) {
  $c = Get-Count "profiles" "&role=eq.$r"
  Write-Host ("  {0,-15} {1,6}" -f $r, $c)
}

# ---------- 3. Newer tables status ----------
Write-Host ""
Write-Host "--- 3. Newer tables ---" -ForegroundColor Yellow
foreach ($t in @('posts','post_likes','post_comments','profile_comments','artist_tracks','merch','share_events','reminders_sent','typing_state','notification_preferences')) {
  $c = Get-Count $t
  if ($null -eq $c) {
    Write-Host ("  {0,-28} MISSING" -f $t) -ForegroundColor Red
  } else {
    $status = if ($c -eq "0") { "EMPTY" } else { "has data" }
    Write-Host ("  {0,-28} {1,6} rows  [{2}]" -f $t, $c, $status)
  }
}

# ---------- 4. Storage buckets ----------
Write-Host ""
Write-Host "--- 4. Storage buckets ---" -ForegroundColor Yellow
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
    Write-Host ("  {0,-28} public={1}  size_limit={2}" -f $b.name, $b.public, $b.file_size_limit)
  }
} catch {
  Write-Host "  Could not fetch buckets: $($_.Exception.Message)" -ForegroundColor Red
}

# ---------- 5. Data quality ----------
Write-Host ""
Write-Host "--- 5. Data quality ---" -ForegroundColor Yellow
Write-Host ("  Profiles missing username     {0,6}" -f (Get-Count "profiles" "&username=is.null"))
Write-Host ("  Profiles missing role         {0,6}" -f (Get-Count "profiles" "&role=is.null"))
Write-Host ("  Events missing venue_id       {0,6}" -f (Get-Count "events" "&venue_id=is.null"))
Write-Host ("  Events missing hero_image     {0,6}" -f (Get-Count "events" "&hero_image=is.null"))
Write-Host ("  Draft events                  {0,6}" -f (Get-Count "events" "&status=eq.draft"))
Write-Host ("  Published events              {0,6}" -f (Get-Count "events" "&status=eq.published"))

# ---------- 6. Auth users ----------
Write-Host ""
Write-Host "--- 6. Auth users ---" -ForegroundColor Yellow
$req2 = [System.Net.WebRequest]::Create("$url/auth/v1/admin/users?per_page=100")
$req2.Method = "GET"
$req2.Headers.Add("apikey", $key)
$req2.Headers.Add("Authorization", "Bearer $key")
try {
  $resp2 = $req2.GetResponse()
  $reader2 = New-Object System.IO.StreamReader($resp2.GetResponseStream())
  $json2 = $reader2.ReadToEnd()
  $resp2.Close()
  $users = ($json2 | ConvertFrom-Json).users
  Write-Host ("  Total users: {0}" -f $users.Count)
  Write-Host ""
  Write-Host "  Sample (first 5):"
  $users | Select-Object -First 5 | ForEach-Object {
    $confirmed = if ($_.email_confirmed_at) { "yes" } else { "no" }
    Write-Host ("    {0,-40} confirmed={1}" -f $_.email, $confirmed)
  }
} catch {
  Write-Host "  Could not fetch users: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Audit complete" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
