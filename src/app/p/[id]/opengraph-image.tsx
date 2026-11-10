import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import { GENDER_PREF, label, rupees } from "@/lib/options";
import { SITE } from "@/lib/site";

export const alt = "Flatmate post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share card for WhatsApp/Facebook previews. Never include contact data here.
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = /^[0-9a-f-]{36}$/i.test(id)
    ? await supabase.from("posts").select("kind,city,area,rent,move_in,gender_pref").eq("id", id).maybeSingle()
    : { data: null };

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#ffffff", color: "#15171c", fontSize: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 44, fontWeight: 900 }}>
          <div style={{ display: "flex", width: 72, height: 14, borderRadius: 7, background: "#f2b705" }} />
          {SITE.name.toLowerCase()}
          <div style={{ display: "flex", width: 72, height: 14, borderRadius: 7, background: "#c4167c" }} />
        </div>
        {post ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", fontSize: 44, color: "#525252" }}>{post.kind === "have_room" ? "Room available" : "Looking for a room"}</div>
            <div style={{ display: "flex", fontSize: 80, fontWeight: 700 }}>{post.area}, {post.city}</div>
            <div style={{ display: "flex", fontSize: 64, fontWeight: 700 }}>{rupees(post.rent)}/month</div>
            <div style={{ display: "flex", fontSize: 40, color: "#525252" }}>
              From {new Date(post.move_in).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {label(GENDER_PREF, post.gender_pref)}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700 }}>{SITE.tagline}</div>
        )}
        <div style={{ display: "flex", fontSize: 32, color: "#525252" }}>Delhi NCR · Free · See how well you click · No brokers</div>
      </div>
    ),
    size,
  );
}
