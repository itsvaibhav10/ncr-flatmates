import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { Page } from "@/components/ui";
import { PostForm } from "./post-form";

export const metadata = { title: "New post" };

export default async function NewPost() {
  const { supabase, user } = await getUser();
  if (!user) redirect("/login?next=/posts/new");
  const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();
  if (!profile) redirect("/profile?next=/posts/new");

  return (
    <Page title="Create a post" narrow>
      <p className="mb-6 max-w-2xl text-sm text-neutral-600">
        Posts stay live for 30 days. You can renew, hide, or delete them anytime from My account. Do not add your phone
        number or exact address in the description.
      </p>
      <PostForm />
    </Page>
  );
}
