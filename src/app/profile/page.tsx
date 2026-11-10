import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { Page } from "@/components/ui";
import { safePath } from "@/lib/site";
import { ProfileForm } from "./profile-form";

export const metadata = { title: "Your profile" };

export default async function ProfilePage({ searchParams }: PageProps<"/profile">) {
  const { next } = await searchParams;
  const { supabase, user } = await getUser();
  if (!user) redirect("/login?next=/profile");

  const [{ data: profile }, { data: contact }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("private_contacts").select("whatsapp").eq("user_id", user.id).maybeSingle(),
  ]);

  return (
    <Page title={profile ? "Edit your profile" : "Set up your profile"} narrow>
      <p className="mb-6 max-w-2xl text-sm text-neutral-600">
        Your answers create your match score with other people. Your first name, gender and habits are visible to anyone on the site.
        Your WhatsApp number is never shown publicly. Only people you both agreed to connect with can see it.
      </p>
      <ProfileForm
        profile={profile ?? undefined}
        whatsapp={contact?.whatsapp?.replace("+91", "") ?? ""}
        next={safePath(next, profile ? "/me" : "/browse")}
      />
    </Page>
  );
}
