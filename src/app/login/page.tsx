import { safePath } from "@/lib/site";
import { GoogleButton } from "./google-button";

export const metadata = { title: "Sign in" };

const PROMISES = [
  ["Free forever", "No brokers, no listing fees, no paid boosts."],
  ["Your number stays private", "Shared only after both of you agree to connect."],
  ["Leave any time", "Delete your account and everything goes with it."],
] as const;

export default async function Login({ searchParams }: PageProps<"/login">) {
  const { next, error } = await searchParams;
  return (
    <main className="flex flex-1 items-center justify-center bg-paper px-4 py-12 sm:py-20">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-[0_2px_4px_rgba(21,23,28,0.04),0_24px_60px_-24px_rgba(21,23,28,0.25)] lg:grid-cols-[1.05fr_1fr]">
        <section className="flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-14">
          <svg viewBox="0 0 96 24" className="w-20" aria-hidden="true">
            <path d="M6 12h84" stroke="#1f5fd6" strokeWidth="7" strokeLinecap="round" />
            <circle cx="18" cy="12" r="6.5" fill="white" stroke="#1f5fd6" strokeWidth="3.5" />
            <circle cx="78" cy="12" r="8" fill="white" stroke="#15171c" strokeWidth="4" />
          </svg>
          <h1 className="mt-6 text-balance font-display text-3xl font-black leading-tight tracking-tight text-ink sm:text-4xl">
            Sign in to find your next flatmate
          </h1>
          <p className="mt-3 max-w-[42ch] leading-relaxed text-neutral-700">
            Google sign-in only. We never see your password, and we never post anything for you.
          </p>
          {error && (
            <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              Sign-in didn&apos;t finish. Please try again.
            </p>
          )}
          <div className="mt-8"><GoogleButton next={safePath(next)} /></div>
          <p className="mt-5 text-xs leading-relaxed text-neutral-500">
            By continuing you confirm you are 18 or older and agree to the{" "}
            <a className="underline hover:text-ink" href="/terms">Terms</a> and{" "}
            <a className="underline hover:text-ink" href="/privacy">Privacy policy</a>.
          </p>
        </section>

        <section className="bg-board px-6 py-10 text-white sm:px-12 sm:py-14 lg:flex lg:flex-col lg:justify-center">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-amber">What you get</h2>
          <ol className="relative mt-6 flex flex-col gap-7">
            <span aria-hidden="true" className="absolute bottom-3 left-[9px] top-3 w-1.5 rounded-full bg-line-yellow" />
            {PROMISES.map(([t, d], i) => (
              <li key={t} className="relative flex gap-5">
                <span aria-hidden="true" className={`relative z-10 mt-1 shrink-0 rounded-full bg-board ${i === PROMISES.length - 1 ? "size-6 border-[4px] border-white" : "size-6 border-[4px] border-line-yellow"}`} />
                <div>
                  <p className="font-display text-lg font-black">{t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
