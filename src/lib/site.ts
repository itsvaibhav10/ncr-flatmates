export const SITE = {
  name: "Clikkit",
  tagline: "Find a flatmate you click with.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Required by the IT Rules 2021: a published contact for grievances.
  grievanceEmail: process.env.NEXT_PUBLIC_GRIEVANCE_EMAIL ?? "grievance@example.com",
};

// Only same-site paths, so ?next= cannot become an open redirect.
export const safePath = (p: unknown, fallback = "/browse") =>
  typeof p === "string" && p.startsWith("/") && !p.startsWith("//") && !p.startsWith("/\\") ? p : fallback;
