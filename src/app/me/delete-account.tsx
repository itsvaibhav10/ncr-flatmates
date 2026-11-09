"use client";

import { useFormStatus } from "react-dom";
import { deleteAccount } from "@/app/actions";
import { btnGhost } from "@/components/ui";
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

const danger =
  "inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2.5 font-display text-sm font-bold text-white transition hover:bg-red-700 active:scale-[0.97] disabled:opacity-50";

function ConfirmButton() {
  const { pending } = useFormStatus();
  return <button className={danger} disabled={pending}>{pending ? "Deleting…" : "Yes, delete everything"}</button>;
}

export function DeleteAccount() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={`${danger} mt-4`}>Delete my account</button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl p-7 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-black text-ink">Delete your account?</DialogTitle>
          <DialogDescription className="text-base leading-relaxed text-neutral-700">
            Your profile, WhatsApp number, posts and interest requests are erased right away. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2 gap-2 sm:justify-start">
          <form action={deleteAccount}><ConfirmButton /></form>
          <DialogClose asChild><button className={btnGhost}>Keep my account</button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
