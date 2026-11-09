"use client";

import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Desktop: filters sit in the sidebar. Phones: the same form opens in a bottom sheet.
export function FilterSheet({ active, children }: { active: number; children: React.ReactNode }) {
  return (
    <>
      <div className="hidden md:block">{children}</div>
      <Sheet>
        <SheetTrigger asChild>
          <button className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink/15 px-5 py-3 font-display text-sm font-bold text-ink transition hover:border-ink active:scale-[0.97] md:hidden">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filters{active > 0 && <span className="rounded-full bg-ink px-2 py-0.5 text-xs text-white tabular-nums">{active}</span>}
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="max-h-[88dvh] overflow-y-auto rounded-t-[2rem] border-0 px-4 pb-6 pt-3 md:hidden">
          <span aria-hidden="true" className="mx-auto mb-1 block h-1.5 w-12 rounded-full bg-ink/15" />
          <SheetTitle className="sr-only">Filters</SheetTitle>
          <SheetDescription className="sr-only">Narrow posts by type, place, rent, date and habits.</SheetDescription>
          {children}
        </SheetContent>
      </Sheet>
    </>
  );
}
