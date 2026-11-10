import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { btn, btnGhost, input, select } from "@/components/ui";
import { MetroMap } from "@/components/metro-map";
import { MatchLines } from "@/components/match-lines";
import { CITY_LINE, METROS, METRO_NAMES, rupees, type Lifestyle } from "@/lib/options";
import { matchScore } from "@/lib/match";

type Insight = { city: string; area: string; kind: string; posts: number; median_rent: number };

// Illustrative profiles for the home demo; labelled "Example" on the page.
const DEMO_ME: Lifestyle = { diet: "veg", smoking: "no", drinking: "occasionally", sleep: "midnight", cleanliness: "tidy", guests: "sometimes", work: "hybrid" };
const DEMO_THEM: Lifestyle = { diet: "veg", smoking: "outside", drinking: "occasionally", sleep: "midnight", cleanliness: "average", guests: "often", work: "office" };

const STEPS = [
  ["Fill a 2-minute profile", "Food, smoking, sleep time, cleanliness, guests. No ID, no documents."],
  ["Browse with a match score", "Every post shows how close their habits are to yours, and where you differ."],
  ["Connect on WhatsApp", "Tap Interested. If they accept, you both see each other's WhatsApp. Nobody else does."],
] as const;

export default async function Home({ searchParams }: PageProps<"/">) {
  const { deleted } = await searchParams;
  const supabase = await createClient();
  const [{ data }, { data: live }] = await Promise.all([
    supabase.rpc("area_insights"),
    supabase.from("posts").select("city,area").eq("status", "active").gt("expires_at", new Date().toISOString()).limit(2000),
  ]);
  const insights = (data ?? []) as Insight[];
  const counts: Record<string, number> = {};
  for (const p of live ?? []) counts[`${p.city}|${p.area}`] = (counts[`${p.city}|${p.area}`] ?? 0) + 1;
  const total = live?.length ?? 0;
  const demo = matchScore(DEMO_ME, DEMO_THEM);

  return (
    <main className="flex-1">
      {deleted && (
        <p className="mx-auto mt-6 max-w-6xl rounded-2xl bg-signal-soft px-4 py-3 text-sm text-signal">Your account and all your data were deleted.</p>
      )}

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-10 lg:grid-cols-12 lg:gap-6 lg:pt-14">
        <div className="lg:col-span-5">
          <h1 className="text-balance font-display text-[2.6rem] font-black leading-[1.02] tracking-[-0.035em] text-ink sm:text-6xl">
            Find a flatmate you click with.
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-neutral-700">
            Flat and flatmate posts across India&apos;s top metros, in one place. Filter by area, rent and habits, see how well you click,
            and share your WhatsApp only when both of you agree.
          </p>

          <form action="/browse" className="mt-8 rounded-[1.75rem] bg-paper p-3 sm:p-4">
            <fieldset className="grid grid-cols-2 gap-1 rounded-full bg-white p-1">
              <legend className="sr-only">I am looking for</legend>
              {([["have_room", "I need a room"], ["need_room", "I need a flatmate"]] as const).map(([v, l], i) => (
                <label key={v} className="cursor-pointer">
                  <input type="radio" name="kind" value={v} defaultChecked={i === 0} className="peer sr-only" />
                  <span className="block rounded-full px-3 py-2 text-center font-display text-sm font-bold text-neutral-600 transition-colors peer-checked:bg-ink peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-signal">
                    {l}
                  </span>
                </label>
              ))}
            </fieldset>
            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <label className="sr-only" htmlFor="hero-city">City</label>
              <select id="hero-city" name="metro" defaultValue="" className={select}>
                <option value="">All cities</option>
                {METRO_NAMES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <label className="sr-only" htmlFor="hero-rent">Max rent</label>
              <input id="hero-rent" name="max_rent" type="number" min={0} step={1000} inputMode="numeric" placeholder="Max rent ₹" className={input} />
              <button className={`${btn} py-3`}>Search</button>
            </div>
          </form>
          <p className="mt-4 font-display text-sm font-semibold text-neutral-600">
            <span className="tabular-nums text-ink">{total}</span> live {total === 1 ? "post" : "posts"} ·{" "}
            <Link href="/posts/new" className="text-signal underline decoration-2">Post your room or need</Link>
          </p>
        </div>

        <div className="lg:col-span-7">
          <MetroMap counts={counts} />
          <nav aria-label="Browse by city" className="mt-2 flex flex-wrap gap-2 sm:hidden">
            {METRO_NAMES.map((m) => (
              <Link key={m} href={`/browse?metro=${encodeURIComponent(m)}`} className="flex items-center gap-2 rounded-full bg-paper py-1.5 pl-2 pr-3 font-display text-sm font-bold text-ink">
                <span className={`size-3 rounded-full ${CITY_LINE[METROS[m][0]].bg}`} />{m}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">Three stops to a flatmate</h2>
          <ol className="relative mt-12 grid gap-10 sm:grid-cols-3 sm:gap-6">
            <span aria-hidden="true" className="absolute bottom-2 left-[11px] top-2 w-2 rounded-full bg-signal sm:bottom-auto sm:left-3 sm:right-3 sm:top-[11px] sm:h-2 sm:w-auto" />
            {STEPS.map(([t, d], i) => (
              <li key={t} className="relative flex gap-5 sm:flex-col sm:gap-6">
                <span aria-hidden="true" className={`relative z-10 mt-0.5 shrink-0 rounded-full bg-white ${i === 2 ? "size-8 border-[5px] border-ink" : "size-[30px] border-[5px] border-signal"} sm:mt-0`} />
                <div>
                  <h3 className="font-display text-xl font-black text-ink">{t}</h3>
                  <p className="mt-2 max-w-[34ch] leading-relaxed text-neutral-700">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-balance font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">See where your habits meet before you call</h2>
          <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-neutral-700">
            Every post compares your profile with the poster&apos;s on seven habits. Where you live the same way, the lines meet.
            Where you are far apart, you know before the first message.
          </p>
          <Link href="/browse" className={`${btn} mt-8`}>Browse posts</Link>
        </div>
        <MatchLines me={DEMO_ME} them={DEMO_THEM} themName="Riya" score={demo.score} note="Example match, not a real user" />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">Rent by area</h2>
        <p className="mt-3 text-neutral-600">Median monthly rent from live posts. An area appears once it has 5 live posts.</p>
        <div className="mt-8 overflow-hidden rounded-3xl bg-board text-white">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-white/10 px-5 py-3 font-display text-xs font-bold uppercase tracking-wider text-white/50 sm:grid-cols-[1fr_10rem_6rem_8rem]">
            <span>Area</span><span className="hidden sm:block">Type</span><span className="text-right">Posts</span><span className="text-right">Median</span>
          </div>
          {insights.length === 0 ? (
            <p className="px-5 py-8 font-display text-amber">No area has 5 live posts yet. Post yours to start the board.</p>
          ) : (
            <ul>
              {insights.map((r) => (
                <li key={`${r.city}-${r.area}-${r.kind}`}>
                  <Link href={`/browse?city=${encodeURIComponent(r.city)}&area=${encodeURIComponent(r.area)}`}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-white/5 px-5 py-3.5 transition-colors hover:bg-white/5 sm:grid-cols-[1fr_10rem_6rem_8rem]">
                    <span className="flex items-center gap-3 font-display font-bold">
                      <span className={`size-2.5 shrink-0 rounded-full ${CITY_LINE[r.city as keyof typeof CITY_LINE]?.bg ?? "bg-white"}`} />
                      {r.area}<span className="font-normal text-white/50">{r.city}</span>
                    </span>
                    <span className="hidden text-sm text-white/60 sm:block">{r.kind === "have_room" ? "Rooms offered" : "Rooms wanted"}</span>
                    <span className="text-right font-display tabular-nums text-white/80">{r.posts}</span>
                    <span className="text-right font-display font-black text-amber tabular-nums">{rupees(r.median_rent)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="bg-line-yellow">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">Got a room to fill?</h2>
            <p className="mt-2 max-w-[48ch] text-ink/80">Post it once here, then share the link in your groups. Replies come with a match score.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/posts/new" className={btn}>Post your room or need</Link>
            <Link href="/browse" className={`${btnGhost} border-ink/30`}>Browse posts</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
