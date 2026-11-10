# Clikkit

_Find a flatmate you click with._ Live at https://clikkit.in

A free, filterable board of flat and flatmate posts for Delhi NCR. It is the Facebook flatmate groups, but searchable, with a lifestyle match score and private contact sharing.

Stack: Next.js 16 (App Router), Supabase (Google auth + Postgres + RLS), Tailwind, hosted on Vercel.

## How privacy works

- Phone numbers live only in `private_contacts`. Row-level security lets only the owner read their own row.
- Another user can get a number only through the `get_match_contact()` function. It returns a number only when an interest between the two users is `accepted`.
- Posts and profiles hold no contact data, so logged-out visitors can read them. This is what makes share links work.

## Setup

1. Create a Supabase project (pick the Mumbai region).
2. In **SQL Editor**, run `supabase/migrations/0001_init.sql`.
3. In **Authentication → Providers → Google**, enable Google. Create an OAuth client in Google Cloud Console and paste its client ID and secret. Add Supabase's callback URL (shown on that screen) to the Google client's authorized redirect URIs.
4. In **Authentication → URL Configuration**:
   - Site URL: your production URL.
   - Redirect URLs: `http://localhost:3000/**`, `https://<your-domain>/**`, `https://*-<your-vercel-team>.vercel.app/**`.
5. Copy `.env.example` to `.env.local` and fill in the values.
6. Run `npm install` and `npm run dev`.

## Deploy to Vercel

1. Push this repo to GitHub and import it in Vercel. The defaults work, with no build settings to change.
2. Add the four variables from `.env.example` in **Project → Settings → Environment Variables**. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
3. Deploy, then add the Vercel URL to the Supabase redirect URLs (step 4 above).

## Before launch

- Set a real `NEXT_PUBLIC_GRIEVANCE_EMAIL`.
- Review reports in Supabase (`reports` table). There is no admin UI yet.
