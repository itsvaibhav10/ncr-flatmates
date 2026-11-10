"use client";

import { useActionState } from "react";
import { createPost } from "@/app/actions";
import { Field, Select, btn, input } from "@/components/ui";
import { AreaPicker } from "@/components/area-picker";
import { DateField } from "@/components/date-field";
import { FURNISHED, GENDER_PREF, KIND } from "@/lib/options";

export function PostForm() {
  const [state, action, pending] = useActionState(createPost, undefined);

  return (
    <form action={action} className="grid max-w-2xl gap-5 rounded-[2rem] bg-paper p-6 sm:grid-cols-2 sm:p-8">
      <Field label="I…">
        <Select name="kind" opts={KIND} placeholder="Choose" />
      </Field>
      <Field label="Flatmate preference">
        <Select name="gender_pref" opts={GENDER_PREF} defaultValue="any" />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Area">
          <AreaPicker mode="single" placeholder="Search your area, e.g. Sector 62 or DLF" />
        </Field>
      </div>
      <Field label="Rent per month (₹, your share)">
        <input name="rent" type="number" min={1000} max={200000} step={500} required className={input} />
      </Field>
      <Field label="Deposit (₹)">
        <input name="deposit" type="number" min={0} max={1000000} step={500} defaultValue={0} className={input} />
      </Field>
      <Field label="Move-in from">
        <DateField name="move_in" placeholder="Choose move-in date" disablePast />
      </Field>
      <Field label="Furnishing">
        <Select name="furnished" opts={FURNISHED} defaultValue="semi" />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Description (optional, max 500)">
          <textarea name="description" maxLength={500} rows={4} className={input}
            placeholder="2BHK near metro, one room free. Looking for someone who works in Cyber City." />
        </Field>
      </div>
      {state?.error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">{state.error}</p>}
      <button className={`${btn} py-3 sm:col-span-2`} disabled={pending}>{pending ? "Posting…" : "Publish post"}</button>
    </form>
  );
}
