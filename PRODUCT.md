# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Young working people and students in Delhi NCR (Delhi, Gurugram, Noida, Ghaziabad, Faridabad) who either have a room in a shared flat and need a flatmate, or need a room in someone else's flat. Today they post and scroll in Facebook groups and WhatsApp groups, where posts are unsearchable, duplicated, and full of brokers. Mostly on phones, often while commuting or between work.

## Product Purpose

NCR Flatmates is one free, searchable board that replaces those groups. People post a room or a need, filter by area, rent, move-in date and habits, see a lifestyle match score with each poster, and connect on WhatsApp only after both sides agree. Success: people find a compatible flatmate without being spammed or exposing their number.

## Positioning

Not a dating-style swipe app and not a broker portal: "the Facebook flatmate groups, but searchable", with a habit match score (food, smoking, drinking, sleep, cleanliness, guests, work) and a mutual-consent phone reveal that the groups cannot offer.

## Operating Context

Posts are shared back into WhatsApp and Facebook groups as links with a preview card. Users sign in with Google only. Posts expire after 30 days; each user may have at most 3 live posts.

## Capabilities and Constraints

- Free forever at launch; no monetization, no payments.
- Keep legal exposure minimal: not a broker, no ID verification, no in-app chat; DPDP-style privacy page, terms, grievance email, self-serve account deletion.
- Phone numbers are private; revealed only to the two people after an accepted interest.
- Gender preference on posts is enforced in the database.
- Stack: Next.js 16 App Router, Tailwind v4, Supabase, deployed on Vercel. No new runtime dependencies without approval.

## Brand Commitments

Name: NCR Flatmates. Voice: plain, direct, friendly Indian English; no hype. Footer line: "Free forever. No brokers. Contact shared only after both sides agree."

## Evidence on Hand

No testimonials, user counts, or press exist. Area rent insights appear only once an area has 5 live posts. Do not fabricate users, reviews, or statistics.

## Product Principles

1. Privacy first: nothing personal is public beyond first name and habits.
2. Compatibility over listings: the habit match is the reason to use this over a group.
3. Zero friction: Google sign-in, a 2-minute profile, share links that work in WhatsApp.
4. Stay out of legal trouble: a noticeboard, never a broker or verifier.

## Accessibility & Inclusion

Mobile-first; readable on low-end Android phones and slow networks. Respect reduced-motion settings.
