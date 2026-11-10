"use client";

import { useActionState } from "react";
import { saveProfile } from "@/app/actions";
import { Field, Select, btn, input } from "@/components/ui";
import { GENDER, LIFESTYLE, LIFESTYLE_KEYS } from "@/lib/options";

export function ProfileForm({
  profile, whatsapp, next,
}: {
  profile?: Record<string, string>;
  whatsapp: string;
  next: string;
}) {
  const [state, action, pending] = useActionState(saveProfile, undefined);
  return (
    <form action={action} className="grid max-w-2xl gap-5 rounded-[2rem] bg-paper p-6 sm:grid-cols-2 sm:p-8">
      <input type="hidden" name="next" value={next} />
      <Field label="First name">
        <input name="first_name" defaultValue={profile?.first_name} maxLength={40} required className={input} />
      </Field>
      <Field label="Gender">
        <Select name="gender" opts={GENDER} defaultValue={profile?.gender} placeholder="Choose" />
      </Field>
      {LIFESTYLE_KEYS.map((k) => (
        <Field key={k} label={LIFESTYLE[k].label}>
          <Select name={k} opts={LIFESTYLE[k].opts} defaultValue={profile?.[k]} placeholder="Choose" />
        </Field>
      ))}
      <Field label="WhatsApp number (private)">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-bold text-neutral-600">+91</span>
          <input name="whatsapp" defaultValue={whatsapp} inputMode="numeric" placeholder="98xxxxxxxx" required className={input} />
        </div>
      </Field>
      <label className="flex items-center gap-2.5 text-sm font-medium sm:col-span-2">
        <input type="checkbox" className="size-4" name="adult" defaultChecked={!!profile} required /> I am 18 or older
      </label>
      {state?.error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">{state.error}</p>}
      <button className={`${btn} py-3 sm:col-span-2`} disabled={pending}>{pending ? "Saving…" : "Save profile"}</button>
    </form>
  );
}
