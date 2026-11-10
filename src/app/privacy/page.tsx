import { Page } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata = { title: "Privacy policy" };

export default function Privacy() {
  return (
    <Page title="Privacy policy" narrow>
      <div className="max-w-2xl space-y-4 text-sm leading-6 text-neutral-700">
        <p>{SITE.name} is a free noticeboard for people looking for flats and flatmates in Indian cities. This page explains what data we keep and why, as required by the Digital Personal Data Protection Act, 2023.</p>
        <h2 className="text-base font-semibold text-neutral-900">What we collect</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Your Google account email and ID, to sign you in. We never see your password.</li>
          <li>Your first name, gender and lifestyle answers (food, smoking, drinking, sleep, cleanliness, guests, work). These are visible to anyone on the site, so others can see their match score with you.</li>
          <li>Your WhatsApp number. It is <strong>never shown publicly</strong>. We show it only to a person whose request you accepted, or whose post accepted your request.</li>
          <li>Your posts, interest requests and reports.</li>
        </ul>
        <h2 className="text-base font-semibold text-neutral-900">What we do not do</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>We do not collect ID documents, Aadhaar, or payment details.</li>
          <li>We do not sell or share your data with advertisers or brokers.</li>
          <li>We do not send messages on your behalf.</li>
        </ul>
        <h2 className="text-base font-semibold text-neutral-900">How long we keep it</h2>
        <p>Posts expire after 30 days unless you renew them. Your account data stays until you delete it. Use &quot;Delete my account&quot; in My account to erase your profile, number, posts and requests immediately.</p>
        <h2 className="text-base font-semibold text-neutral-900">Where it is stored</h2>
        <p>Data is stored with our database provider (Supabase) and the site is hosted on Vercel.</p>
        <h2 className="text-base font-semibold text-neutral-900">Contact and grievances</h2>
        <p>For questions, corrections or complaints, email <a className="underline" href={`mailto:${SITE.grievanceEmail}`}>{SITE.grievanceEmail}</a>. We aim to reply within 7 days.</p>
      </div>
    </Page>
  );
}
