"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { reportPost } from "@/app/actions";
import { btnGhost, input } from "@/components/ui";

export function ReportForm({ postId }: { postId: string }) {
  const [state, action, pending] = useActionState(reportPost, undefined);
  useEffect(() => {
    if (state?.ok) toast.success(state.ok);
  }, [state]);
  return (
    <details className="mt-4 text-sm text-neutral-500">
      <summary className="cursor-pointer">Report this post</summary>
      <form action={action} className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input type="hidden" name="post_id" value={postId} />
        <input name="reason" required minLength={3} maxLength={500} placeholder="Broker, fake, abusive…" className={input} />
        <button className={btnGhost} disabled={pending}>Send report</button>
      </form>
      {state?.error && <p className="mt-2 text-red-600">{state.error}</p>}
    </details>
  );
}
