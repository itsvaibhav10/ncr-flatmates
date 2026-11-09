import Link from "next/link";
import { GENDER_PREF, LIFESTYLE, cityLine, label, rupees, type Lifestyle } from "@/lib/options";
import type { Match } from "@/lib/match";

const press = "transition duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";
export const btn =
  `inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 font-display text-sm font-bold text-white hover:bg-signal ${press}`;
export const btnGhost =
  `inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink/15 px-5 py-2 font-display text-sm font-bold text-ink hover:border-ink ${press}`;
const field =
  "w-full rounded-2xl border-2 border-ink/10 bg-white py-2.5 text-sm text-ink transition-colors hover:border-ink/25 focus:border-signal focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";
export const input = `${field} px-4 placeholder:text-neutral-500`;
// Native arrows sit at different insets per browser; one chevron keeps every select identical.
export const select = `${field} select-chevron cursor-pointer pl-4 pr-11`;

export function Select({
  name, opts, defaultValue, placeholder, required = true,
}: {
  name: string;
  opts: readonly (readonly [string, string])[];
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <select name={name} defaultValue={defaultValue ?? ""} required={required} className={select}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {opts.map(([v, l]) => (
        <option key={v} value={v}>{l}</option>
      ))}
    </select>
  );
}

export function Field({ label: text, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 font-display text-sm font-semibold text-ink">
      {text}
      {children}
    </label>
  );
}

export function Page({ title, children, narrow = false }: { title: string; children: React.ReactNode; narrow?: boolean }) {
  return (
    <main className={`mx-auto w-full flex-1 px-4 py-10 sm:py-16 ${narrow ? "max-w-2xl" : "max-w-5xl"}`}>
      <h1 className="mb-8 font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">{title}</h1>
      {children}
    </main>
  );
}

// A station marker: the city's line with an area dot, used as the heading of posts.
export function Station({ city, area, size = "sm" }: { city: string; area: string; size?: "sm" | "lg" }) {
  const c = cityLine(city);
  const lg = size === "lg";
  return (
    <span className="flex items-center gap-2.5">
      <span className={`relative flex shrink-0 items-center ${lg ? "h-3 w-10" : "h-2 w-7"} rounded-full ${c.bg}`}>
        <span className={`absolute left-1/2 -translate-x-1/2 rounded-full border-ink bg-white ${lg ? "size-5 border-[3.5px]" : "size-3.5 border-[3px]"}`} />
      </span>
      <span className="min-w-0">
        <span className={`block truncate font-display font-black leading-tight text-ink ${lg ? "text-3xl sm:text-4xl" : "text-base"}`}>{area}</span>
        <span className={`block font-display font-semibold ${c.text} ${lg ? "text-sm" : "text-xs"}`}>{city}</span>
      </span>
    </span>
  );
}

export type PostRow = {
  id: string;
  user_id: string;
  kind: string;
  city: string;
  area: string;
  rent: number;
  deposit: number;
  move_in: string;
  gender_pref: string;
  furnished: string;
  description: string;
  created_at: string;
  profiles: (Lifestyle & { first_name: string; gender: string }) | null;
};

export const POST_SELECT =
  "id,user_id,kind,city,area,rent,deposit,move_in,gender_pref,furnished,description,created_at,profiles!inner(first_name,gender,diet,smoking,drinking,sleep,cleanliness,guests,work)";

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

// Platform-board readout: amber numerals on the board colour.
export function ScoreBadge({ match }: { match?: Match }) {
  if (!match) return null;
  return (
    <span className="inline-flex items-baseline gap-1 rounded-full bg-board px-2.5 py-1 font-display text-xs font-bold text-white/70">
      <span className="text-sm font-black text-amber tabular-nums">{match.score}%</span> match
    </span>
  );
}

export function KindTag({ kind }: { kind: string }) {
  const have = kind === "have_room";
  return (
    <span className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 font-display text-xs font-bold ${have ? "bg-signal-soft text-signal" : "bg-paper text-ink"}`}>
      {have ? "Has a room" : "Needs a room"}
    </span>
  );
}

export function PostCard({ post, match }: { post: PostRow; match?: Match }) {
  const p = post.profiles;
  return (
    <Link href={`/p/${post.id}`}
      className="group flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(21,23,28,0.06),0_8px_24px_-12px_rgba(21,23,28,0.18)] ring-1 ring-ink/5 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(21,23,28,0.06),0_18px_40px_-16px_rgba(21,23,28,0.3)]">
      <div className="flex items-start justify-between gap-3">
        <Station city={post.city} area={post.area} />
        <ScoreBadge match={match} />
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-display text-3xl font-black tracking-tight text-ink tabular-nums">
          {rupees(post.rent)}<span className="text-sm font-semibold text-neutral-500">/mo</span>
        </p>
        <KindTag kind={post.kind} />
      </div>
      <p className="text-sm text-neutral-600">
        From {fmtDate(post.move_in)} · {label(GENDER_PREF, post.gender_pref)} · {p?.first_name}
      </p>
      {p && (
        <div className="flex flex-wrap gap-1.5 border-t border-dashed border-ink/10 pt-3">
          {(["diet", "smoking", "sleep", "cleanliness"] as const).map((k) => (
            <span key={k} className="rounded-full bg-paper px-2.5 py-1 text-xs text-neutral-700">
              {label(LIFESTYLE[k].opts, p[k])}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
