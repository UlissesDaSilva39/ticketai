# Weekly Digest Email Setup

## 1. Create Resend account
Sign up at https://resend.com (free - 3,000 emails/month). Go to API Keys, create one (starts with re_).

## 2. Add to .env.local

RESEND_API_KEY=re_your_key_here
RESEND_FROM="GRID <digest@yourdomain.com>"
DIGEST_SECRET=generate-32-char-random-string
DIGEST_TEST_EMAILS=your@email.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

## 3. Generate DIGEST_SECRET

Run in PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | ForEach-Object {[char]$_})

## 4. Restart dev server
npm run dev

## 5. Test
Visit: http://localhost:3000/api/digest?token=YOUR_SECRET

Expected: {"sent":1,"failed":0,"total":1}

## 6. Schedule (Vercel)
Add vercel.json:
{
  "crons": [{ "path": "/api/digest?token=YOUR_SECRET", "schedule": "0 9 * * 1" }]
}

## 6. Schedule (GitHub Actions)
Add .github/workflows/digest.yml with steps that curl the digest endpoint.