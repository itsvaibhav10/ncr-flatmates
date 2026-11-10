"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { safePath } from "@/lib/site";
import {
  CITIES, CITY_NAMES, FURNISHED, GENDER, GENDER_PREF, KIND, LIFESTYLE, LIFESTYLE_KEYS, isOpt,
  type City,
} from "@/lib/options";

export type FormState = { error?: string; ok?: string } | undefined;

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const int = (f: FormData, k: string) => Number.parseInt(str(f, k), 10);

async function requireUser() {
  const { supabase, user } = await getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

export async function saveProfile(_: FormState, f: FormData): Promise<FormState> {
  const { supabase, user } = await requireUser();
  const first_name = str(f, "first_name");
  const gender = str(f, "gender");
  const digits = str(f, "whatsapp").replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");

  if (!first_name || first_name.length > 40) return { error: "Enter your first name (max 40 characters)." };
  if (!isOpt(GENDER, gender)) return { error: "Choose your gender." };
  if (f.get("adult") !== "on") return { error: "You must be 18 or older to use this site." };
  if (!/^[6-9]\d{9}$/.test(digits)) return { error: "Enter a valid 10-digit Indian mobile number." };

  const lifestyle: Record<string, string> = {};
  for (const key of LIFESTYLE_KEYS) {
    const v = str(f, key);
    if (!isOpt(LIFESTYLE[key].opts, v)) return { error: `Answer the "${LIFESTYLE[key].label}" question.` };
    lifestyle[key] = v;
  }

  const { error } = await supabase.from("profiles").upsert({ id: user.id, first_name, gender, ...lifestyle });
  if (error) return { error: error.message };
  const { error: cErr } = await supabase
    .from("private_contacts")
    .upsert({ user_id: user.id, whatsapp: `+91${digits}` });
  if (cErr) return { error: cErr.message };

  revalidatePath("/", "layout");
  redirect(safePath(str(f, "next")));
}

export async function createPost(_: FormState, f: FormData): Promise<FormState> {
  const { supabase, user } = await requireUser();
  const kind = str(f, "kind");
  const city = str(f, "city") as City;
  const area = str(f, "area");
  const rent = int(f, "rent");
  const deposit = int(f, "deposit") || 0;
  const move_in = str(f, "move_in");
  const gender_pref = str(f, "gender_pref");
  const furnished = str(f, "furnished");
  const description = str(f, "description");

  if (!isOpt(KIND, kind)) return { error: "Choose a post type." };
  if (!CITY_NAMES.includes(city) || !(CITIES[city] as readonly string[]).includes(area))
    return { error: "Choose a city and area from the list." };
  if (!(rent >= 1000 && rent <= 200000)) return { error: "Rent must be between ₹1,000 and ₹2,00,000." };
  if (!(deposit >= 0 && deposit <= 1000000)) return { error: "Deposit looks wrong." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(move_in)) return { error: "Choose a move-in date." };
  if (!isOpt(GENDER_PREF, gender_pref) || !isOpt(FURNISHED, furnished)) return { error: "Fill in every field." };
  if (description.length > 500) return { error: "Description must be 500 characters or less." };

  const { data, error } = await supabase
    .from("posts")
    .insert({ user_id: user.id, kind, city, area, rent, deposit, move_in, gender_pref, furnished, description })
    .select("id")
    .single();
  if (error) return { error: error.message };
  redirect(`/p/${data.id}?new=1`);
}

export async function updatePost(f: FormData) {
  const { supabase } = await requireUser();
  const id = str(f, "id");
  const op = str(f, "op");
  // RLS limits every operation below to the caller's own posts.
  if (op === "delete") await supabase.from("posts").delete().eq("id", id);
  else if (op === "hide") await supabase.from("posts").update({ status: "hidden" }).eq("id", id);
  else if (op === "show") await supabase.from("posts").update({ status: "active" }).eq("id", id);
  else if (op === "renew")
    await supabase
      .from("posts")
      .update({ expires_at: new Date(Date.now() + 30 * 864e5).toISOString() })
      .eq("id", id);
  revalidatePath("/me");
}

export async function expressInterest(f: FormData) {
  const { supabase, user } = await requireUser();
  const post_id = str(f, "post_id");
  const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();
  if (!profile) redirect(`/profile?next=/p/${post_id}`);
  await supabase.from("interests").insert({ post_id, from_user: profile.id });
  revalidatePath(`/p/${post_id}`);
}

export async function withdrawInterest(f: FormData) {
  const { supabase } = await requireUser();
  await supabase.from("interests").delete().eq("id", str(f, "id"));
  revalidatePath("/me");
}

export async function respondInterest(f: FormData) {
  const { supabase } = await requireUser();
  await supabase.rpc("respond_interest", { interest_id: str(f, "id"), accept: str(f, "accept") === "1" });
  revalidatePath("/me");
}

export async function reportPost(_: FormState, f: FormData): Promise<FormState> {
  const { supabase, user } = await requireUser();
  const reason = str(f, "reason");
  if (reason.length < 3 || reason.length > 500) return { error: "Tell us briefly what is wrong." };
  const { error } = await supabase.from("reports").insert({ post_id: str(f, "post_id"), reporter: user.id, reason });
  if (error) return { error: error.code === "23505" ? "You already reported this post." : error.message };
  return { ok: "Thanks. We will review this post." };
}

export async function signOut() {
  const { supabase } = await getUser();
  await supabase.auth.signOut();
  redirect("/");
}

export async function deleteAccount() {
  const { supabase } = await requireUser();
  const { error } = await supabase.rpc("delete_my_account");
  if (error) throw new Error(error.message);
  await supabase.auth.signOut();
  redirect("/?deleted=1");
}
