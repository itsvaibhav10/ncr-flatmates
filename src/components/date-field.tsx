"use client";

import { useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parse = (s?: string) => (s && /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(`${s}T00:00:00`) : undefined);

// Submits a yyyy-mm-dd string through a hidden input, so plain <form> GET/POST handling is unchanged.
export function DateField({
  name, defaultValue, placeholder = "Pick a date", disablePast = false, clearable = false, id,
}: { name: string; defaultValue?: string; placeholder?: string; disablePast?: boolean; clearable?: boolean; id?: string }) {
  const [value, setValue] = useState<Date | undefined>(parse(defaultValue));
  const [open, setOpen] = useState(false);
  const [today] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  return (
    <div className="relative">
      <input type="hidden" name={name} value={value ? iso(value) : ""} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button id={id} type="button"
            className="flex w-full items-center justify-between rounded-2xl border-2 border-ink/10 bg-white py-2.5 pl-4 pr-4 text-left text-sm transition-colors hover:border-ink/25 focus:border-signal focus:outline-none data-[state=open]:border-signal">
            <span className={value ? "text-ink" : "text-neutral-500"}>
              {value ? value.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : placeholder}
            </span>
            <CalendarDays className="size-4 shrink-0 text-ink/70" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto rounded-3xl border-0 p-2 shadow-[0_2px_4px_rgba(21,23,28,0.06),0_24px_48px_-16px_rgba(21,23,28,0.3)] ring-1 ring-ink/10">
          <Calendar
            mode="single"
            selected={value}
            defaultMonth={value}
            onSelect={(d) => { setValue(d); setOpen(false); }}
            disabled={disablePast ? { before: today } : undefined}
            className="[--cell-size:--spacing(10)]"
          />
        </PopoverContent>
      </Popover>
      {clearable && value && (
        <button type="button" onClick={() => setValue(undefined)} aria-label="Clear date"
          className="absolute right-10 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink/50 hover:bg-paper hover:text-ink">
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
