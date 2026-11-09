import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safePath } from "@/lib/site";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safePath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from("profiles").select("id").eq("id", user!.id).maybeSingle();
      return NextResponse.redirect(`${origin}${profile ? next : `/profile?next=${encodeURIComponent(next)}`}`);
    }
  }
  return NextResponse.redirect(`${origin}/login?error=1`);
}
