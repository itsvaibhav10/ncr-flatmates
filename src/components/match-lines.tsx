import { LIFESTYLE, LIFESTYLE_KEYS, label, type Lifestyle } from "@/lib/options";

const idx = (k: keyof typeof LIFESTYLE, v: string) => LIFESTYLE[k].opts.findIndex(([o]) => o === v);

// Two people as two parallel lines; a shared habit is an interchange joining them.
export function MatchLines({
  me, them, meName = "You", themName, score, note,
}: { me: Lifestyle; them: Lifestyle; meName?: string; themName: string; score: number; note?: string }) {
  return (
    <div className="rounded-3xl bg-board p-5 text-white sm:p-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-sm font-semibold text-white/70">{meName} and {themName}</p>
          {note && <p className="mt-1 text-xs text-white/50">{note}</p>}
        </div>
        <p className="font-display text-5xl font-black leading-none text-amber tabular-nums sm:text-6xl">
          {score}<span className="text-2xl">%</span>
        </p>
      </div>
      <div className="mt-6 grid grid-cols-[1fr_auto_minmax(4.5rem,7rem)_auto_1fr] items-stretch text-sm">
        <span className="pb-3 text-right font-display text-xs font-bold uppercase tracking-wider text-[#8fb3ff]">{meName}</span>
        <span />
        <span />
        <span />
        <span className="pb-3 font-display text-xs font-bold uppercase tracking-wider text-line-yellow">{themName}</span>
        {LIFESTYLE_KEYS.map((k) => {
          const a = idx(k, me[k]);
          const b = idx(k, them[k]);
          const gap = Math.abs(a - b);
          const same = gap === 0;
          return (
            <div key={k} className="contents">
              <span className={`py-2.5 pr-3 text-right ${same ? "text-white" : "text-white/70"}`}>{label(LIFESTYLE[k].opts, me[k])}</span>
              <span className="relative flex w-4 items-center justify-center before:absolute before:inset-y-0 before:left-1/2 before:w-1.5 before:-translate-x-1/2 before:bg-line-blue">
                <span className={`relative z-10 rounded-full ${same ? "size-4 border-[3px] border-white bg-board" : "size-3 border-[3px] border-line-blue bg-board"}`} />
              </span>
              <span className="relative flex flex-col items-center justify-center px-1">
                <span className="mb-1 text-[10px] uppercase tracking-wider text-white/50">{LIFESTYLE[k].label}</span>
                {same ? (
                  <span className="h-1.5 w-full rounded-full bg-white" />
                ) : gap === 1 ? (
                  <span className="w-full border-t-2 border-dashed border-white/40" />
                ) : (
                  <span className="text-[10px] font-semibold text-amber">different</span>
                )}
              </span>
              <span className="relative flex w-4 items-center justify-center before:absolute before:inset-y-0 before:left-1/2 before:w-1.5 before:-translate-x-1/2 before:bg-line-yellow">
                <span className={`relative z-10 rounded-full ${same ? "size-4 border-[3px] border-white bg-board" : "size-3 border-[3px] border-line-yellow bg-board"}`} />
              </span>
              <span className={`py-2.5 pl-3 ${same ? "text-white" : "text-white/70"}`}>{label(LIFESTYLE[k].opts, them[k])}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/60">
        <span className="flex items-center gap-2"><span className="h-1.5 w-6 rounded-full bg-white" /> Same habit</span>
        <span className="flex items-center gap-2"><span className="w-6 border-t-2 border-dashed border-white/40" /> Close</span>
        <span className="flex items-center gap-2"><span className="text-amber">different</span> Far apart</span>
      </p>
    </div>
  );
}
