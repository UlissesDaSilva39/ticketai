param([string]$Root = ".", [switch]$DryRun)
$ErrorActionPreference = "Stop"
$stamp  = Get-Date -Format "yyyyMMdd_HHmmss"
$backup = Join-Path $Root "_backup_light_$stamp"

function Log  { param($m) Write-Host "[GRID/LIGHT] $m" -ForegroundColor Magenta }
function Warn { param($m) Write-Host "[WARN] $m"       -ForegroundColor Yellow }

# ---- 1. BACKUP -------------------------------------------------------------
if (-not $DryRun) {
    New-Item -ItemType Directory -Path $backup -Force | Out-Null
    Get-ChildItem -Path $Root -Recurse -Include *.html,*.css,*.js,*.txt |
        Where-Object { $_.FullName -notlike "*$backup*" } |
        ForEach-Object {
            $rel  = $_.FullName.Substring((Resolve-Path $Root).Path.Length).TrimStart('\')
            $dest = Join-Path $backup $rel
            New-Item -ItemType Directory -Path (Split-Path $dest) -Force | Out-Null
            Copy-Item $_.FullName $dest
        }
    Log "Backup -> $backup"
}

# ---- 2. LIGHT THEME CSS ----------------------------------------------------
$lightCss = @"
/* ================= GRID LIGHT THEME ================= */
:root{
  --bg:#ffffff; --surface:#f8f9fb; --surface-2:#eef0f4;
  --surface-hover:#e4e7ee; --border:#e2e5eb; --border-strong:#cfd4dd;
  --text:#0f1115; --text-muted:#5b6270; --text-subtle:#8a90a0;
  --accent-start:#7c3aed; --accent-end:#ec4899;
  --accent-grad:linear-gradient(90deg,var(--accent-start),var(--accent-end));
  --accent-solid:#7c3aed; --accent-soft:#f3e8ff;
  --success:#10b981; --success-soft:#d1fae5;
  --radius-sm:8px; --radius:14px; --radius-lg:20px; --radius-pill:999px;
  --nav-h:64px; --sidebar-w:240px;
  --shadow-sm:0 1px 2px rgba(15,17,21,.06);
  --shadow-md:0 4px 12px rgba(15,17,21,.08);
  --shadow-lg:0 12px 32px rgba(15,17,21,.10);
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);
  font-family:'Inter',system-ui,-apple-system,sans-serif;
  font-size:15px;line-height:1.5;-webkit-font-smoothing:antialiased;}
a{color:inherit;text-decoration:none}
h1{font-size:2.2rem;font-weight:700;letter-spacing:-.02em;margin:0 0 8px}
h2{font-size:1.4rem;font-weight:600;margin:0 0 6px}
h3{font-size:1.1rem;font-weight:600;margin:0 0 4px}
.muted{color:var(--text-muted)} .subtle{color:var(--text-subtle);font-size:.875rem}
.nav{height:var(--nav-h);background:var(--bg);border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 32px;position:sticky;top:0;z-index:100;}
.nav__logo{font-weight:800;font-size:1.15rem;letter-spacing:-.03em}
.nav__links{display:flex;gap:4px;align-items:center}
.nav__links a{color:var(--text-muted);padding:8px 14px;border-radius:var(--radius-pill);
  font-size:.9rem;font-weight:500;transition:background .15s,color .15s;}
.nav__links a:hover,.nav__links a.active{background:var(--surface-2);color:var(--text)}
.nav__actions{display:flex;gap:8px;align-items:center}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;
  padding:9px 18px;border-radius:var(--radius-pill);font-size:.9rem;font-weight:600;
  border:1px solid transparent;cursor:pointer;
  transition:transform .1s,box-shadow .15s,background .15s;white-space:nowrap;}
.btn:active{transform:scale(.98)}
.btn-primary{background:var(--accent-grad);color:#fff;box-shadow:0 4px 12px rgba(124,58,237,.22)}
.btn-primary:hover{box-shadow:0 6px 18px rgba(124,58,237,.32)}
.btn-dark{background:var(--text);color:#fff}.btn-dark:hover{background:#000}
.btn-ghost{background:transparent;color:var(--text);border:1px solid var(--border-strong)}
.btn-ghost:hover{background:var(--surface-2)}
.chip{background:var(--surface);color:var(--text-muted);border:1px solid var(--border);
  border-radius:var(--radius-pill);padding:7px 16px;font-size:.85rem;font-weight:500;
  cursor:pointer;transition:all .15s;}
.chip:hover{background:var(--surface-2);color:var(--text)}
.chip--active{background:var(--accent-soft);border-color:var(--accent-solid);
  color:var(--accent-solid);font-weight:600;}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
  padding:18px;transition:border-color .15s,box-shadow .15s,transform .15s;}
.card:hover{border-color:var(--border-strong);box-shadow:var(--shadow-md);transform:translateY(-1px)}
.card--featured{border:1px solid var(--accent-solid);box-shadow:0 0 0 4px var(--accent-soft)}
.badge-verified{display:inline-flex;align-items:center;gap:4px;
  background:var(--success-soft);color:#047857;border-radius:var(--radius-pill);
  padding:3px 10px;font-size:.72rem;font-weight:600;}
.badge-verified::before{content:'\2713';font-weight:800}
.pill{border-radius:var(--radius-pill);padding:4px 12px;font-size:.78rem;
  font-weight:600;display:inline-block;}
.pill--going{background:var(--success-soft);color:#047857}
.pill--selling{background:#fef3c7;color:#92400e}
.searchbar{display:flex;gap:8px;margin-bottom:24px}
.searchbar input{flex:1;height:52px;background:var(--surface);border:1px solid var(--border);
  border-radius:var(--radius-pill);padding:0 22px;font-size:.95rem;outline:none;
  transition:border-color .15s,box-shadow .15s;}
.searchbar input::placeholder{color:var(--text-subtle)}
.searchbar input:focus{border-color:var(--accent-solid);box-shadow:0 0 0 4px var(--accent-soft)}
.searchbar .btn-primary{height:52px;padding:0 32px;font-size:.95rem}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;align-items:center}
.toggle-row{display:flex;align-items:center;justify-content:space-between;
  padding-top:16px;border-top:1px solid var(--border);margin-top:8px;}
.toggle{display:flex;align-items:center;gap:10px;font-size:.9rem;cursor:pointer}
.toggle input{appearance:none;width:18px;height:18px;border:1.5px solid var(--border-strong);
  border-radius:5px;cursor:pointer;position:relative;transition:all .15s;}
.toggle input:checked{background:var(--accent-solid);border-color:var(--accent-solid)}
.toggle input:checked::after{content:'';position:absolute;left:5px;top:1px;
  width:5px;height:10px;border:solid #fff;border-width:0 2px 2px 0;transform:rotate(45deg);}
.results-count{color:var(--text-muted);font-size:.875rem}
.layout{display:grid;grid-template-columns:var(--sidebar-w) 1fr;
  min-height:calc(100vh - var(--nav-h));}
.sidebar{background:var(--surface);border-right:1px solid var(--border);
  padding:24px 16px;position:sticky;top:var(--nav-h);
  height:calc(100vh - var(--nav-h));overflow-y:auto;}
.sidebar h4{color:var(--text-subtle);font-size:.7rem;font-weight:700;
  letter-spacing:.09em;text-transform:uppercase;margin:18px 12px 6px;}
.sidebar h4:first-child{margin-top:0}
.sidebar a{display:flex;align-items:center;gap:10px;color:var(--text-muted);
  padding:8px 12px;border-radius:var(--radius-sm);font-size:.9rem;font-weight:500;
  transition:background .15s,color .15s;}
.sidebar a:hover{background:var(--surface-2);color:var(--text)}
.sidebar a.active{background:var(--accent-soft);color:var(--accent-solid);font-weight:600}
.page{max-width:1280px;margin:0 auto;padding:40px 32px 80px}
.page__lede{color:var(--text-muted);max-width:640px;margin:0 0 28px}
.avatar{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;
  font-weight:700;font-size:.9rem;color:#fff;background:var(--accent-grad);flex-shrink:0;}
.event-card__img{width:100%;aspect-ratio:16/9;object-fit:cover;
  border-radius:var(--radius-sm) var(--radius-sm) 0 0;background:var(--surface-2)}
.event-card__meta{color:var(--text-muted);font-size:.85rem;margin:6px 0 12px}
.event-card__foot{display:flex;align-items:center;justify-content:space-between;
  padding-top:14px;border-top:1px solid var(--border);margin-top:14px;}
.event-card__price{font-weight:700;font-size:1.05rem}
.club-cta{display:block;width:100%;margin-top:12px;padding:11px;text-align:center;
  border-radius:var(--radius-sm);background:var(--accent-grad);
  color:#fff;font-weight:600;font-size:.88rem;}
/* =============== /GRID LIGHT THEME =============== */
"@

# ---- 3. PATCH MAIN CSS -----------------------------------------------------
$css = Get-ChildItem -Path $Root -Recurse -Filter "*.css" |
       Where-Object { $_.FullName -notlike "*$backup*" } |
       Select-Object -First 1
if (-not $css) {
    $css = Join-Path $Root "styles.css"
    if (-not $DryRun) { Set-Content -Path $css -Value "" -Encoding UTF8 }
    Log "Created $css"
}
$existing = Get-Content $css.FullName -Raw
if ($existing -match "GRID LIGHT THEME") {
    Warn "Light theme already in $($css.Name) - skipping"
} else {
    Log "Injecting light theme into $($css.Name)"
    if (-not $DryRun) {
        Set-Content -Path $css.FullName -Value ($lightCss + "`n" + $existing) -Encoding UTF8
    }
}

# ---- 4. NORMALIZE HTML -----------------------------------------------------
$htmlFiles = Get-ChildItem -Path $Root -Recurse -Include *.html |
             Where-Object { $_.FullName -notlike "*$backup*" }
foreach ($f in $htmlFiles) {
    Log "Patching $($f.Name)"
    $h = Get-Content $f.FullName -Raw
    $h = $h -replace 'class="[^"]*\bdark\b[^"]*"','class="light"'
    $h = $h -replace '(?i)<a[^>]*>\s*Sign\s*up\s*</a>', '<a class="btn btn-dark" href="/signup">Sign up</a>'
    $h = $h -replace '(?i)<a[^>]*>\s*Log\s*in\s*</a>',  '<a class="btn btn-ghost" href="/login">Log in</a>'
    $h = $h -replace '(?i)<button[^>]*>\s*Get Tickets\s*</button>', '<button class="btn btn-primary">Get Tickets</button>'
    $h = $h -replace '(?i)<button[^>]*>\s*Search\s*</button>',      '<button class="btn btn-primary">Search</button>'
    $h = $h -replace '\bVERIFIED\b','<span class="badge-verified">Verified</span>'
    $h = $h -replace 'Promoterswe have diplcae pages','Promoters'
    $h = $h -replace 'Pomoer Odyssey','Pompeii Odyssey'
    if (-not $DryRun) { Set-Content -Path $f.FullName -Value $h -Encoding UTF8 }
}

# ---- 5. SUMMARY ------------------------------------------------------------
Log "Nav             : white + dark Sign up pill"
Log "Background      : #ffffff   Surface: #f8f9fb"
Log "Primary CTA     : gradient pill"
Log "Verified badge  : soft green pill"
Log "Sidebar         : light surface + right border"
Log "Backup          : $backup"
if ($DryRun) { Warn "DRY RUN - nothing written" }
