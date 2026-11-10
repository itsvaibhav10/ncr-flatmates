import { Page } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata = { title: "Terms of use" };

export default function Terms() {
  return (
    <Page title="Terms of use" narrow>
      <div className="max-w-2xl space-y-4 text-sm leading-6 text-neutral-700">
        <p>{SITE.name} is a free noticeboard. We only help people find each other. We are not a broker, landlord, agent or party to any rent agreement.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>You must be 18 or older.</li>
          <li>Post only real rooms or real needs. No broker listings, fake posts, or posts for someone else without their consent.</li>
          <li>Do not post phone numbers, exact addresses or other people&apos;s personal data in descriptions.</li>
          <li>No harassment, hate speech, or discrimination beyond the stated flatmate gender preference.</li>
          <li>We do not verify identities, properties or claims. Meet in a public place first, visit the flat in person, and never pay a deposit before you have seen the flat and the agreement.</li>
          <li>Any rent, deposit or agreement is strictly between you and the other person. We are not responsible for disputes between users.</li>
          <li>We may hide or remove posts and accounts that break these rules or are reported.</li>
        </ul>
        <p>WhatsApp is a trademark of WhatsApp LLC. We mention it only to describe how matched users contact each other. {SITE.name} is not affiliated with, sponsored by or endorsed by WhatsApp or Meta.</p>
        <p>Report a post using the link on the post, or email <a className="underline" href={`mailto:${SITE.grievanceEmail}`}>{SITE.grievanceEmail}</a>.</p>
      </div>
    </Page>
  );
}
