import type { Metadata } from "next";
import { Geist, Overpass } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { SITE } from "@/lib/site";
import { Logo } from "@/components/logo";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const overpass = Overpass({ variable: "--font-overpass", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} – find a flatmate you click with in Delhi NCR`, template: `%s · ${SITE.name}` },
  description: "Free, filterable board of flat and flatmate posts across Delhi, Gurugram, Noida, Ghaziabad and Faridabad.",
};

const LINE_STRIP = ["bg-line-magenta", "bg-line-yellow", "bg-line-blue", "bg-line-green", "bg-line-violet", "bg-line-aqua"];

const navLink = "rounded-full px-3 py-2 font-display text-sm font-bold text-ink transition-colors hover:bg-paper";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${overpass.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-ink">
        <header className="sticky top-0 z-30 border-b border-ink/5 bg-white">
          <nav className="mx-auto flex max-w-6xl items-center gap-1 px-4 py-2.5">
            <Link href="/" className="mr-auto">
              <Logo />
            </Link>
            <Link href="/browse" className={navLink}>Browse</Link>
            <Link href="/me" className={`${navLink} hidden sm:inline-flex`}>My account</Link>
            <Link href="/posts/new" className="ml-1 rounded-full bg-ink px-4 py-2 font-display text-sm font-bold text-white transition-colors hover:bg-signal">
              Post
            </Link>
          </nav>
        </header>
        {/* Every data page reads auth cookies; Cache Components requires a boundary to stream them. */}
        <Suspense fallback={<main className="flex-1 p-8 text-sm text-neutral-500">Loading…</main>}>{children}</Suspense>
        <footer className="bg-ink text-white/70">
          <div className="flex h-1.5" aria-hidden="true">
            {LINE_STRIP.map((c) => <span key={c} className={`flex-1 ${c}`} />)}
          </div>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-8 text-sm">
            <span className="mr-auto font-display font-semibold text-white">Free forever. No brokers. Contact shared only after both sides agree.</span>
            <Link href="/me" className="hover:text-white sm:hidden">My account</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <a href={`mailto:${SITE.grievanceEmail}`} className="hover:text-white">Grievances</a>
          </div>
        </footer>
        <Toaster position="bottom-center" toastOptions={{ classNames: { toast: "!rounded-2xl !bg-board !text-white !border-0 font-display font-bold" } }} />
      </body>
    </html>
  );
}
