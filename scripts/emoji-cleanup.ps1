$ErrorActionPreference = "Continue"

function Replace-EmojisInFile {
  param([string]$FilePath)
  
  try {
    $c = [System.IO.File]::ReadAllText($FilePath, [System.Text.Encoding]::UTF8)
  } catch { return $false }
  if (-not $c) { return $false }
  
  $original = $c
  $needed = New-Object System.Collections.Generic.HashSet[string]
  
  # --- Each replacement is a direct string literal ---
  if ($c.Contains([char]0xD83D + [char]0xDCF7)) { $c = $c.Replace([char]0xD83D + [char]0xDCF7, "<Camera className=`"h-4 w-4`" />"); $needed.Add("Camera") | Out-Null }
  if ($c.Contains([char]0xD83D + [char]0xDCF8)) { $c = $c.Replace([char]0xD83D + [char]0xDCF8, "<Image className=`"h-4 w-4`" />"); $needed.Add("Image") | Out-Null }
  if ($c.Contains([char]0xD83D + [char]0xDCC5)) { $c = $c.Replace([char]0xD83D + [char]0xDCC5, "<Calendar className=`"h-4 w-4`" />"); $needed.Add("Calendar") | Out-Null }
  if ($c.Contains([char]0xD83C + [char]0xDFB5)) { $c = $c.Replace([char]0xD83C + [char]0xDFB5, "<Music className=`"h-4 w-4`" />"); $needed.Add("Music") | Out-Null }
  if ($c.Contains([char]0xD83D + [char]0xDD25)) { $c = $c.Replace([char]0xD83D + [char]0xDD25, "<TrendingUp className=`"h-4 w-4`" />"); $needed.Add("TrendingUp") | Out-Null }
  if ($c.Contains([char]0x2728)) { $c = $c.Replace([char]0x2728, "<Sparkles className=`"h-4 w-4`" />"); $needed.Add("Sparkles") | Out-Null }
  if ($c.Contains([char]0xD83C + [char]0xDFA7)) { $c = $c.Replace([char]0xD83C + [char]0xDFA7, "<Headphones className=`"h-4 w-4`" />"); $needed.Add("Headphones") | Out-Null }
  if ($c.Contains([char]0xD83C + [char]0xDFA4)) { $c = $c.Replace([char]0xD83C + [char]0xDFA4, "<Mic className=`"h-4 w-4`" />"); $needed.Add("Mic") | Out-Null }
  if ($c.Contains([char]0xD83C + [char]0xDFAA)) { $c = $c.Replace([char]0xD83C + [char]0xDFAA, "<Tent className=`"h-4 w-4`" />"); $needed.Add("Tent") | Out-Null }
  if ($c.Contains([char]0xD83D + [char]0xDCAC)) { $c = $c.Replace([char]0xD83D + [char]0xDCAC, "<MessageCircle className=`"h-4 w-4`" />"); $needed.Add("MessageCircle") | Out-Null }
  if ($c.Contains([char]0x2665)) { $c = $c.Replace([char]0x2665, "<Heart className=`"h-4 w-4`" />"); $needed.Add("Heart") | Out-Null }
  if ($c.Contains([char]0xD83D + [char]0xDCC4)) { $c = $c.Replace([char]0xD83D + [char]0xDCC4, "<FileText className=`"h-4 w-4`" />"); $needed.Add("FileText") | Out-Null }
  if ($c.Contains([char]0x2795)) { $c = $c.Replace([char]0x2795, "<Plus className=`"h-4 w-4`" />"); $needed.Add("Plus") | Out-Null }
  if ($c.Contains([char]0xD83C + [char]0xDFDF)) { $c = $c.Replace([char]0xD83C + [char]0xDFDF, "<Building2 className=`"h-4 w-4`" />"); $needed.Add("Building2") | Out-Null }
  if ($c.Contains([char]0xD83D + [char]0xDCCA)) { $c = $c.Replace([char]0xD83D + [char]0xDCCA, "<BarChart3 className=`"h-4 w-4`" />"); $needed.Add("BarChart3") | Out-Null }
  if ($c.Contains([char]0xD83D + [char]0xDC65)) { $c = $c.Replace([char]0xD83D + [char]0xDC65, "<Users className=`"h-4 w-4`" />"); $needed.Add("Users") | Out-Null }
  if ($c.Contains([char]0x2705)) { $c = $c.Replace([char]0x2705, "<CheckCircle2 className=`"h-4 w-4`" />"); $needed.Add("CheckCircle2") | Out-Null }
  if ($c.Contains([char]0x274C)) { $c = $c.Replace([char]0x274C, "<XCircle className=`"h-4 w-4`" />"); $needed.Add("XCircle") | Out-Null }
  if ($c.Contains([char]0x23F3)) { $c = $c.Replace([char]0x23F3, "<Clock className=`"h-4 w-4`" />"); $needed.Add("Clock") | Out-Null }
  if ($c.Contains([char]0xD83D + [char]0xDCB0)) { $c = $c.Replace([char]0xD83D + [char]0xDCB0, "<DollarSign className=`"h-4 w-4`" />"); $needed.Add("DollarSign") | Out-Null }
  if ($c.Contains([char]0xD83D + [char]0xDD14)) { $c = $c.Replace([char]0xD83D + [char]0xDD14, "<Bell className=`"h-4 w-4`" />"); $needed.Add("Bell") | Out-Null }
  if ($c.Contains([char]0xD83D + [char]0xDD0D)) { $c = $c.Replace([char]0xD83D + [char]0xDD0D, "<Search className=`"h-4 w-4`" />"); $needed.Add("Search") | Out-Null }
  if ($c.Contains([char]0xD83D + [char]0xDE00)) { $c = $c.Replace([char]0xD83D + [char]0xDE00, "<Share2 className=`"h-4 w-4`" />"); $needed.Add("Share2") | Out-Null }
  
  if ($c -eq $original) { return $false }
  
  # Merge lucide import
  $names = @($needed) | Sort-Object -Unique
  $imp = "import { " + ($names -join ", ") + " } from " + [char]39 + "lucide-react" + [char]39 + ";"
  
  if ($c -notmatch "from [char]39lucide-react[char]39") {
    $c = [regex]::Replace($c, "(^import [^\n]*;\s*\r?\n)(?!import)", "`$1$imp`r`n", [System.Text.RegularExpressions.RegexOptions]::Multiline)
  }
  
  Copy-Item -LiteralPath $FilePath "$FilePath.pre-emoji" -Force -ErrorAction SilentlyContinue
  [System.IO.File]::WriteAllText($FilePath, $c, [System.Text.UTF8Encoding]::new($false))
  return $true
}

Write-Host "Scanning app/, components/ ..." -ForegroundColor Cyan
$files = Get-ChildItem -Recurse -Include *.tsx,*.ts -Path app,components -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch "node_modules|\.next|\\api\\" }

$fixed = 0
foreach ($f in $files) {
  if (Replace-EmojisInFile -FilePath $f.FullName) {
    Write-Host "  OK $($f.Name)" -ForegroundColor Green
    $script:fixed++
  }
}

Write-Host ""
Write-Host "Files fixed: $fixed" -ForegroundColor Magenta
