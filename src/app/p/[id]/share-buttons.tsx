"use client";

import { toast } from "sonner";
import { btnGhost } from "@/components/ui";

export function ShareButtons({ title }: { title: string }) {
  const url = () => location.href.split("?")[0];
  return (
    <>
      <button
        type="button"
        className={btnGhost}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url());
            toast.success("Link copied. Paste it in your groups.");
          } catch {
            toast.error("Couldn't copy. Copy the address bar instead.");
          }
        }}
      >
        Copy link
      </button>
      <button
        type="button"
        className={btnGhost}
        onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${title}\n${url()}`)}`, "_blank", "noopener")}
      >
        Share on WhatsApp
      </button>
    </>
  );
}
