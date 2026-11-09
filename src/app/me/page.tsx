import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { respondInterest, signOut, updatePost, withdrawInterest } from "@/app/actions";
import { Page, ScoreBadge, btn, btnGhost, fmtDate } from "@/components/ui";
import { LIFESTYLE, LIFESTYLE_KEYS, label, rupees, type Lifestyle } from "@/lib/options";
import { matchScore } from "@/lib/match";
import { DeleteAccount } from "./delete-account";

export const metadata = { title: "My account" };

type MyPost = { id: string; kind: string; city: string; area: string; rent: number; status: string; expires_at: string };
type Incoming = {
  id: string; status: string; created_at: string;
  posts: { id: string; area: string; city: string };
  profiles: Lifestyle & { first_name: string };
};
type Sent = {
  id: string; status: string;
  posts: { id: string; area: string; city: string; rent: number; profiles: { first_name: string } } | null;
};

const isExpired = (d: string) => new Date(d).getTime() < Date.now();
const smallBtn = "rounded-full border-2 border-ink/10 px-3 py-1 font-display text-xs font-bold text-ink transition hover:border-ink active:scale-[0.97]";
const h2 = "font-display text-2xl font-black tracking-tight text-ink";

export default async function Me() {
  const { supabase, user } = await getUser();
  if (!user) redirect("/login?next=/me");
  const { data: me } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!me) redirect("/profile?next=/me");

  const [{ data: posts }, { data: incoming }, { data: sent }] = await Promise.all([
    supabase.from("posts").select("id,kind,city,area,rent,status,expires_at").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase
      .from("interests")
      .select(`id,status,created_at,posts!inner(id,area,city,user_id),profiles(first_name,${LIFESTYLE_KEYS.join(",")})`)
      .eq("posts.user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("interests")
      .select("id,status,posts(id,area,city,rent,profiles(first_name))")
      .eq("from_user", user.id)
      .order("created_at", { ascending: false }),
  ]);
  const inc = (incoming ?? []) as unknown as Incoming[];
  const out = (sent ?? []) as unknown as Sent[];

  // Contact numbers come only from the get_match_contact RPC, which checks the accepted interest.
  const accepted = [...inc, ...out].filter((i) => i.status === "accepted");
  const contacts = new Map(
    await Promise.all(
      accepted.map(async (i) => [i.id, (await supabase.rpc("get_match_contact", { interest_id: i.id })).data as string | null] as const),
    ),
  );
  const wa = (id: string) => {
    const n = contacts.get(id);
    return n ? (
      <a className="inline-flex items-center gap-2 rounded-full bg-line-green px-4 py-2 font-display text-sm font-bold text-white transition hover:brightness-110" href={`https://wa.me/${n.replace("+", "")}`} target="_blank" rel="noopener noreferrer">
        WhatsApp {n}
      </a>
    ) : null;
  };

  return (
    <Page title={`Hi ${me.first_name}`}>
      <div className="flex flex-wrap gap-3">
        <Link href="/posts/new" className={btn}>New post</Link>
        <Link href="/profile" className={btnGhost}>Edit profile</Link>
        <form action={signOut}><button className={btnGhost}>Sign out</button></form>
      </div>

      <section className="mt-12">
        <h2 className={h2}>People interested in your posts</h2>
        {inc.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">No requests yet. Share your post link in your groups to get more views.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {inc.map((i) => {
              const m = matchScore(me as Lifestyle, i.profiles);
              return (
                <li key={i.id} className="rounded-3xl bg-white ring-1 ring-ink/10 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg font-black text-ink">{i.profiles.first_name}</span>
                    <ScoreBadge match={m} />
                    <span className="text-xs text-neutral-500">for {i.posts.area}, {i.posts.city} · {fmtDate(i.created_at)}</span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-600">
                    {LIFESTYLE_KEYS.map((k) => label(LIFESTYLE[k].opts, i.profiles[k])).join(" · ")}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {i.status === "pending" ? (
                      <>
                        <form action={respondInterest}><input type="hidden" name="id" value={i.id} /><input type="hidden" name="accept" value="1" /><button className={btn}>Accept & share WhatsApp</button></form>
                        <form action={respondInterest}><input type="hidden" name="id" value={i.id} /><input type="hidden" name="accept" value="0" /><button className={btnGhost}>Decline</button></form>
                      </>
                    ) : i.status === "accepted" ? wa(i.id) : <span className="text-xs text-neutral-500">Declined</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className={h2}>Posts you are interested in</h2>
        {out.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">Nothing yet. <Link href="/browse" className="underline">Browse posts</Link>.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {out.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center gap-3 rounded-3xl bg-white ring-1 ring-ink/10 px-5 py-4 text-sm">
                {i.posts ? (
                  <Link href={`/p/${i.posts.id}`} className="font-display font-bold text-ink hover:underline">
                    {i.posts.profiles.first_name} · {i.posts.area}, {i.posts.city} · {rupees(i.posts.rent)}
                  </Link>
                ) : <span className="text-neutral-500">Post no longer available</span>}
                <span className="rounded-full bg-paper px-2.5 py-1 font-display text-xs font-bold capitalize text-neutral-700">{i.status}</span>
                {i.status === "accepted" && wa(i.id)}
                {i.status === "pending" && (
                  <form action={withdrawInterest} className="ml-auto"><input type="hidden" name="id" value={i.id} /><button className={smallBtn}>Withdraw</button></form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className={h2}>Your posts</h2>
        {(posts ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">You have no posts.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {(posts as MyPost[]).map((p) => {
              const expired = isExpired(p.expires_at);
              return (
                <li key={p.id} className="flex flex-wrap items-center gap-2 rounded-3xl bg-white ring-1 ring-ink/10 px-5 py-4 text-sm">
                  <Link href={`/p/${p.id}`} className="mr-auto font-display font-bold text-ink hover:underline">
                    {p.kind === "have_room" ? "Room" : "Need"} · {p.area}, {p.city} · {rupees(p.rent)}
                  </Link>
                  <span className="text-xs text-neutral-500">
                    {expired ? "Expired" : p.status === "hidden" ? "Hidden" : `Live until ${fmtDate(p.expires_at)}`}
                  </span>
                  {(["renew", p.status === "active" ? "hide" : "show", "delete"] as const).map((op) => (
                    <form key={op} action={updatePost}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="op" value={op} />
                      <button className={smallBtn}>{op[0].toUpperCase() + op.slice(1)}</button>
                    </form>
                  ))}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-16 rounded-3xl bg-red-50 p-6">
        <h2 className="font-display text-lg font-black text-red-800">Delete account</h2>
        <p className="mt-1 text-sm text-red-800">This permanently deletes your profile, WhatsApp number, posts and interests. It cannot be undone.</p>
        <DeleteAccount />
      </section>
    </Page>
  );
}
