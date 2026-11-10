import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient, getUser } from "@/lib/supabase/server";
import { expressInterest } from "@/app/actions";
import { KindTag, POST_SELECT, ScoreBadge, Station, btn, btnGhost, fmtDate, type PostRow } from "@/components/ui";
import { MatchLines } from "@/components/match-lines";
import { FURNISHED, GENDER_PREF, LIFESTYLE, LIFESTYLE_KEYS, label, rupees, type Lifestyle } from "@/lib/options";
import { matchScore } from "@/lib/match";
import { ShareButtons } from "./share-buttons";
import { ReportForm } from "./report-form";

const isUuid = (s: string) => /^[0-9a-f-]{36}$/i.test(s);

async function loadPost(id: string) {
  if (!isUuid(id)) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select(POST_SELECT).eq("id", id).maybeSingle();
  return data as unknown as PostRow | null;
}

export async function generateMetadata({ params }: PageProps<"/p/[id]">): Promise<Metadata> {
  const post = await loadPost((await params).id);
  if (!post) return { title: "Post not found" };
  const title = `${post.kind === "have_room" ? "Room available" : "Looking for a room"} in ${post.area}, ${post.city} · ${rupees(post.rent)}`;
  return { title, description: post.description || title, openGraph: { title } };
}

export default async function PostPage({ params, searchParams }: PageProps<"/p/[id]">) {
  const { id } = await params;
  const { new: isNew } = await searchParams;
  const post = await loadPost(id);
  if (!post) notFound();

  const { supabase, user } = await getUser();
  const isOwner = user?.id === post.user_id;
  const [{ data: me }, { data: interest }] = user && !isOwner
    ? await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("interests").select("status").eq("post_id", id).eq("from_user", user.id).maybeSingle(),
      ])
    : [{ data: null }, { data: null }];
  const p = post.profiles!;
  const match = me ? matchScore(me as Lifestyle, p) : undefined;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:py-14">
      {isNew && isOwner && (
        <div className="mb-8 rounded-3xl bg-signal-soft p-5 text-signal">
          <p className="font-display text-lg font-black">Your post is live.</p>
          <p className="mt-1 text-sm">Share the link in your groups and chats. People who open it can filter, match, and contact you here.</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <KindTag kind={post.kind} />
        <ScoreBadge match={match} />
      </div>
      <div className="mt-5"><Station city={post.city} area={post.area} size="lg" /></div>
      <p className="mt-6 font-display text-5xl font-black tracking-tight text-ink tabular-nums sm:text-6xl">
        {rupees(post.rent)}<span className="text-lg font-semibold text-neutral-500">/month</span>
      </p>

      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-ink/10 sm:grid-cols-4">
        {[
          ["Deposit", post.deposit ? rupees(post.deposit) : "None"],
          ["Move in", fmtDate(post.move_in)],
          ["Open to", label(GENDER_PREF, post.gender_pref)],
          ["Furnishing", label(FURNISHED, post.furnished)],
        ].map(([k, v]) => (
          <div key={k} className="bg-paper px-5 py-4">
            <dt className="font-display text-xs font-bold uppercase tracking-wider text-neutral-500">{k}</dt>
            <dd className="mt-1 font-display text-lg font-black text-ink tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>

      {post.description && <p className="mt-8 max-w-[65ch] whitespace-pre-line text-lg leading-relaxed text-neutral-800">{post.description}</p>}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {isOwner ? (
          <Link href="/me" className={btnGhost}>Manage in My account</Link>
        ) : !user ? (
          <Link href={`/login?next=/p/${id}`} className={btn}>Sign in to connect</Link>
        ) : me && post.gender_pref !== "any" && post.gender_pref !== me.gender ? (
          <span className="text-sm text-neutral-600">This post is open to {label(GENDER_PREF, post.gender_pref).toLowerCase()}.</span>
        ) : interest ? (
          <span className="rounded-full bg-paper px-4 py-2.5 font-display text-sm font-bold text-ink">
            {interest.status === "accepted"
              ? "Accepted! See their WhatsApp in My account."
              : interest.status === "declined" ? "They passed on this one." : "Interest sent. Waiting for a reply."}
          </span>
        ) : (
          <form action={expressInterest}>
            <input type="hidden" name="post_id" value={id} />
            <button className={btn}>I&apos;m interested</button>
          </form>
        )}
        <ShareButtons title={`${post.area}, ${post.city} · ${rupees(post.rent)}`} />
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-black tracking-tight text-ink">
          {match ? `How you and ${p.first_name} live` : `About ${p.first_name}`}
        </h2>
        {match ? (
          <div className="mt-6"><MatchLines me={me as Lifestyle} them={p} themName={p.first_name} score={match.score} /></div>
        ) : (
          <>
            <dl className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {LIFESTYLE_KEYS.map((k) => (
                <div key={k} className="rounded-2xl bg-paper px-4 py-3">
                  <dt className="font-display text-xs font-bold uppercase tracking-wider text-neutral-500">{LIFESTYLE[k].label}</dt>
                  <dd className="mt-0.5 font-medium text-ink">{label(LIFESTYLE[k].opts, p[k])}</dd>
                </div>
              ))}
            </dl>
            {!isOwner && (
              <p className="mt-4 text-sm text-neutral-600">
                <Link href={user ? `/profile?next=/p/${id}` : `/login?next=/p/${id}`} className="font-bold text-signal underline decoration-2">
                  {user ? "Finish your profile" : "Sign in"}
                </Link>{" "}to see your match with {p.first_name}, habit by habit.
              </p>
            )}
          </>
        )}
      </section>
      {user && !isOwner && <ReportForm postId={id} />}
    </main>
  );
}
