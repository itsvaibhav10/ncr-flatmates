import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { POST_SELECT, PostCard, Station, btn, btnGhost, input, select, type PostRow } from "@/components/ui";
import { CITIES, CITY_NAMES, KIND, LIFESTYLE, isOpt, type City, type Lifestyle } from "@/lib/options";
import { matchScore } from "@/lib/match";
import { DateField } from "@/components/date-field";
import { FilterSheet } from "./filter-sheet";

export const metadata = { title: "Browse posts" };

// shortcut: fetches at most 200 posts and sorts by match in memory; move scoring into SQL when an area has more.
const LIMIT = 200;

export default async function Browse({ searchParams }: PageProps<"/browse">) {
  const sp = await searchParams;
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const kind = one("kind");
  const city = one("city") as City;
  const area = one("area");
  const maxRent = Number.parseInt(one("max_rent"), 10);
  const moveBy = one("move_by");
  const diet = one("diet");
  const noSmoke = one("no_smoke") === "1";
  const openToMe = one("open_to_me") === "1";
  const sort = one("sort") || "match";
  const active = [kind, city, area, one("max_rent"), moveBy, diet, noSmoke ? "1" : "", openToMe ? "1" : ""].filter(Boolean).length;

  const { supabase, user } = await getUser();
  const { data: me } = user
    ? await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
    : { data: null };

  let q = supabase.from("posts").select(POST_SELECT).eq("status", "active").gt("expires_at", new Date().toISOString());
  if (isOpt(KIND, kind)) q = q.eq("kind", kind);
  if (CITY_NAMES.includes(city)) q = q.eq("city", city);
  if (area) q = q.eq("area", area);
  if (maxRent > 0) q = q.lte("rent", maxRent);
  if (/^\d{4}-\d{2}-\d{2}$/.test(moveBy)) q = q.lte("move_in", moveBy);
  if (isOpt(LIFESTYLE.diet.opts, diet)) q = q.eq("profiles.diet", diet);
  if (noSmoke) q = q.eq("profiles.smoking", "no");
  if (openToMe && me) q = q.in("gender_pref", ["any", me.gender]);
  if (user) q = q.neq("user_id", user.id);
  q = sort === "rent" ? q.order("rent") : q.order("created_at", { ascending: false });

  const { data, error } = await q.limit(LIMIT);
  const posts = ((data ?? []) as unknown as PostRow[]).map((post) => ({
    post,
    match: me && post.profiles ? matchScore(me as Lifestyle, post.profiles) : undefined,
  }));
  if (sort === "match" && me) posts.sort((a, b) => b.match!.score - a.match!.score);

  return (
    <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-4 py-10 md:grid-cols-[260px_1fr]">
      <div className="md:sticky md:top-20 md:h-fit">
      <FilterSheet active={active}>
      <form className="flex h-fit flex-col gap-3 rounded-3xl bg-paper p-5 text-sm">
        <h2 className="font-display text-lg font-black text-ink">Filters</h2>
        <select name="kind" defaultValue={kind} className={select}>
          <option value="">Rooms offered & wanted</option>
          {KIND.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select name="city" defaultValue={city} className={select}>
          <option value="">All of NCR</option>
          {CITY_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="area" defaultValue={area} className={select}>
          <option value="">Any area</option>
          {CITY_NAMES.filter((c) => !CITY_NAMES.includes(city) || c === city).map((c) => (
            <optgroup key={c} label={c}>
              {CITIES[c].map((a) => <option key={`${c}-${a}`} value={a}>{a}</option>)}
            </optgroup>
          ))}
        </select>
        <input name="max_rent" type="number" min={0} step={1000} defaultValue={one("max_rent")} placeholder="Max rent ₹" className={input} />
        <label className="flex flex-col gap-1.5 font-display font-semibold text-neutral-700">
          Move in by
          <DateField name="move_by" defaultValue={moveBy} placeholder="Any date" clearable />
        </label>
        <select name="diet" defaultValue={diet} className={select}>
          <option value="">Any food habit</option>
          {LIFESTYLE.diet.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <label className="flex items-center gap-2.5 px-1 font-medium"><input type="checkbox" className="size-4" name="no_smoke" value="1" defaultChecked={noSmoke} /> Non-smokers only</label>
        {me && (
          <label className="flex items-center gap-2.5 px-1 font-medium"><input type="checkbox" className="size-4" name="open_to_me" value="1" defaultChecked={openToMe} /> Only posts open to my gender</label>
        )}
        <select name="sort" defaultValue={sort} className={select}>
          <option value="match">Sort: best match</option>
          <option value="new">Sort: newest</option>
          <option value="rent">Sort: lowest rent</option>
        </select>
        <button className={`${btn} mt-1`}>Apply filters</button>
        <Link href="/browse" className={btnGhost}>Clear</Link>
      </form>
      </FilterSheet>
      </div>

      <section>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          {area && CITY_NAMES.includes(city) ? (
            <Station city={city} area={area} size="lg" />
          ) : (
            <h1 className="font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">{CITY_NAMES.includes(city) ? `Posts in ${city}` : "All posts in NCR"}</h1>
          )}
          <p className="font-display text-sm font-semibold text-neutral-600"><span className="tabular-nums text-ink">{posts.length}{posts.length === LIMIT ? "+" : ""}</span> live {posts.length === 1 ? "post" : "posts"}</p>
        </div>
        {!me && (
          <p className="mb-5 rounded-2xl bg-signal-soft px-4 py-3 text-sm text-signal">
            <Link href={user ? "/profile?next=/browse" : "/login?next=/browse"} className="font-bold underline decoration-2">
              {user ? "Finish your profile" : "Sign in"}
            </Link>{" "}
            to see your match score on every post.
          </p>
        )}
        {error && <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">Could not load posts. Please try again.</p>}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-ink/10 px-6 py-14 text-center">
            <svg viewBox="0 0 120 24" className="w-40" aria-hidden="true"><path d="M4 12h112" stroke="#c7c9cc" strokeWidth="6" strokeLinecap="round" strokeDasharray="1 14" /><circle cx="60" cy="12" r="8" fill="white" stroke="#15171c" strokeWidth="4" /></svg>
            <p className="font-display text-lg font-black text-ink">No posts at this stop yet</p>
            <p className="max-w-[40ch] text-sm text-neutral-600">Try a wider area or a higher rent, or post your own so others can find you.</p>
            <Link href="/posts/new" className={btn}>Be the first to post</Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map(({ post, match }) => <PostCard key={post.id} post={post} match={match} />)}
          </div>
        )}
      </section>
    </main>
  );
}
