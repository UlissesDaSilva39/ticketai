$ErrorActionPreference = "Continue"
Set-Location -Path (git rev-parse --show-toplevel)
Write-Host "`n=== GRID REGRESSION TEST ===" -ForegroundColor Cyan
$fail = 0
$files = @(
    "lib/hooks/useRecentlyViewed.ts",
    "lib/hooks/useBadges.ts",
    "lib/hooks/useReferral.ts",
    "lib/hooks/useProStatus.ts",
    "lib/hooks/useRevenue.ts",
    "lib/hooks/useVerification.ts",
    "lib/hooks/useMyProducts.ts",
    "lib/utils/profileCompleteness.ts",
    "lib/data/artists.ts",
    "components/RecentlyViewedRail.tsx",
    "components/TrackRecentlyViewed.tsx",
    "components/SimilarArtistsRail.tsx",
    "components/SimilarClickTracker.tsx",
    "components/BadgeShelf.tsx",
    "components/BadgeToast.tsx",
    "components/ProfileCompleteness.tsx",
    "components/ReferralCard.tsx",
    "components/ReferralBanner.tsx",
    "components/BuyModal.tsx",
    "components/FeatureGigModal.tsx",
    "components/BookArtistModal.tsx",
    "components/RevenueCard.tsx",
    "components/ApplyGate.tsx",
    "app/home/page.tsx",
    "app/network/page.tsx",
    "app/jobs/page.tsx",
    "app/artist/[id]/page.tsx",
    "app/marketplace/page.tsx",
    "app/pro/page.tsx",
    "app/verify/page.tsx",
    "app/sell/page.tsx",
    "app/join/page.tsx",
    "app/api/digest/route.ts",
    "app/api/unsubscribe/route.ts"
)
foreach ($f in $files) {
    if (Test-Path -LiteralPath $f) {
        $txt = [System.IO.File]::ReadAllText((Join-Path (Get-Location) $f), [System.Text.Encoding]::UTF8)
        if ($txt.Length -lt 100) { Write-Host "  FAIL: $f (short)" -ForegroundColor Red; $fail++ }
        elseif ($txt -match '^[A-Z]:') { Write-Host "  FAIL: $f (path)" -ForegroundColor Red; $fail++ }
        elseif ($f -like "*.tsx" -and $txt.Contains(([char]96).ToString() + "n")) { Write-Host "  FAIL: $f (backtick-n)" -ForegroundColor Red; $fail++ }
        else { Write-Host "  PASS: $f" -ForegroundColor Green }
    } else {
        Write-Host "  MISSING: $f" -ForegroundColor Red
        $fail++
    }
}
Write-Host "`n=== RESULT ===" -ForegroundColor Cyan
if ($fail -eq 0) { Write-Host "  ALL PASSED" -ForegroundColor Green }
else { Write-Host "  $fail FAILED" -ForegroundColor Red }