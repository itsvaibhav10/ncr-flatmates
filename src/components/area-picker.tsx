"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CITIES, CITY_NAMES, CITY_LINE, type City } from "@/lib/options";

// A location is "City|Area", or "City|*" for the whole city (multi mode only).
export type Loc = `${City}|${string}`;
type Item = { key: Loc; city: City; area: string; whole: boolean };

const ALL: Item[] = CITY_NAMES.flatMap((city) => [
  { key: `${city}|*` as Loc, city, area: `All of ${city}`, whole: true },
  ...CITIES[city].map((area) => ({ key: `${city}|${area}` as Loc, city, area, whole: false })),
]);
const byKey = new Map(ALL.map((i) => [i.key, i]));

/**
 * Searchable area picker. Multi mode submits repeated `name` inputs ("City|Area");
 * single mode submits separate `city` and `area` inputs so existing server validation is unchanged.
 */
export function AreaPicker({
  mode, name = "loc", defaultValue = [], placeholder = "Search an area",
}: { mode: "single" | "multi"; name?: string; defaultValue?: string[]; placeholder?: string }) {
  const [selected, setSelected] = useState<Loc[]>(defaultValue.filter((k) => byKey.has(k as Loc)) as Loc[]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();
  const listRef = useRef<HTMLUListElement>(null);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = mode === "single" ? ALL.filter((i) => !i.whole) : ALL;
    return q ? pool.filter((i) => `${i.area} ${i.city}`.toLowerCase().includes(q)) : pool;
  }, [query, mode]);

  const pick = (key: Loc) => {
    if (mode === "single") {
      setSelected([key]);
      setOpen(false);
      return;
    }
    const city = byKey.get(key)!.city;
    setSelected((cur) => {
      if (cur.includes(key)) return cur.filter((k) => k !== key);
      // Picking a whole city replaces its single areas, and the reverse.
      const rest = key.endsWith("|*") ? cur.filter((k) => !k.startsWith(`${city}|`)) : cur.filter((k) => k !== `${city}|*`);
      return [...rest, key];
    });
  };

  const move = (d: number) => {
    const next = Math.max(0, Math.min(items.length - 1, active + d));
    setActive(next);
    listRef.current?.querySelector(`[data-i="${next}"]`)?.scrollIntoView({ block: "nearest" });
  };

  const first = selected[0] ? byKey.get(selected[0]) : undefined;
  const label = !first ? placeholder
    : mode === "single" ? `${first.area}, ${first.city}`
    : selected.length === 1 ? first.area
    : `${first.area} +${selected.length - 1}`;

  return (
    <div className="flex flex-col gap-2">
      {mode === "multi"
        ? selected.map((k) => <input key={k} type="hidden" name={name} value={k} />)
        : first && (<><input type="hidden" name="city" value={first.city} /><input type="hidden" name="area" value={first.area} /></>)}

      <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o) { setQuery(""); setActive(0); } }}>
        <PopoverTrigger asChild>
          <button type="button" aria-haspopup="listbox"
            className="flex w-full items-center justify-between gap-2 rounded-2xl border-2 border-ink/10 bg-white py-2.5 pl-4 pr-4 text-left text-sm transition-colors hover:border-ink/25 focus:border-signal focus:outline-none data-[state=open]:border-signal">
            <span className={`truncate ${first ? "text-ink" : "text-neutral-500"}`}>{label}</span>
            <ChevronDown className="size-4 shrink-0 text-ink" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[max(var(--radix-popover-trigger-width),18rem)] rounded-3xl border-0 p-0 shadow-[0_2px_4px_rgba(21,23,28,0.06),0_24px_48px_-16px_rgba(21,23,28,0.3)] ring-1 ring-ink/10">
          <div className="flex items-center gap-2 border-b border-ink/10 px-4 py-3">
            <Search className="size-4 shrink-0 text-ink/50" aria-hidden="true" />
            <input autoFocus value={query} placeholder="Type an area or city"
              role="combobox" aria-expanded aria-controls={listId} aria-activedescendant={items[active] ? `${listId}-${active}` : undefined}
              onChange={(e) => { setQuery(e.target.value); setActive(0); }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
                else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
                else if (e.key === "Enter") { e.preventDefault(); if (items[active]) pick(items[active].key); }
              }}
              className="w-full bg-transparent text-sm text-ink placeholder:text-neutral-500 focus:outline-none" />
          </div>
          <ul ref={listRef} id={listId} role="listbox" aria-multiselectable={mode === "multi"} className="max-h-72 overflow-y-auto p-2">
            {items.length === 0 && <li className="px-3 py-6 text-center text-sm text-neutral-500">No area matches “{query}”</li>}
            {items.map((it, i) => {
              const on = selected.includes(it.key);
              const showCity = i === 0 || items[i - 1].city !== it.city;
              return (
                <li key={it.key} role="presentation">
                  {showCity && !query && (
                    <p className={`px-3 pb-1 pt-3 font-display text-[11px] font-bold uppercase tracking-wider ${CITY_LINE[it.city].text}`}>{it.city}</p>
                  )}
                  <div id={`${listId}-${i}`} data-i={i} role="option" aria-selected={on}
                    onMouseEnter={() => setActive(i)} onClick={() => pick(it.key)}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm ${i === active ? "bg-paper" : ""} ${it.whole ? "font-display font-bold" : ""}`}>
                    <span className={`size-2.5 shrink-0 rounded-full ${CITY_LINE[it.city].bg}`} aria-hidden="true" />
                    <span className="flex-1 truncate text-ink">{it.area}{query && !it.whole && <span className="text-neutral-500">, {it.city}</span>}</span>
                    {on && <Check className="size-4 shrink-0 text-signal" aria-hidden="true" />}
                  </div>
                </li>
              );
            })}
          </ul>
          {mode === "multi" && selected.length > 0 && (
            <div className="flex items-center justify-between border-t border-ink/10 px-4 py-2.5 text-xs">
              <span className="text-neutral-600">{selected.length} selected</span>
              <button type="button" onClick={() => setOpen(false)} className="font-display font-bold text-signal">Done</button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {mode === "multi" && selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((k) => {
            const it = byKey.get(k)!;
            return (
              <span key={k} className="flex items-center gap-1.5 rounded-full bg-white py-1 pl-2.5 pr-1 text-xs font-medium text-ink ring-1 ring-ink/10">
                <span className={`size-2 rounded-full ${CITY_LINE[it.city].bg}`} aria-hidden="true" />
                {it.area}
                <button type="button" onClick={() => setSelected((c) => c.filter((x) => x !== k))} aria-label={`Remove ${it.area}`}
                  className="rounded-full p-0.5 text-ink/50 hover:bg-paper hover:text-ink">
                  <X className="size-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
