import type { Metadata } from 'next';
import { LegalPage, Section, List, Callout, LEGAL_VERSION, LEGAL_EFFECTIVE } from '../_components/LegalPage';
import { WebDeletion } from './WebDeletion';

/**
 * loxymity.com/delete-account — how to delete a Loxymity account, what happens, what is kept,
 * and a web form that does it (Google Play: "a web link resource where users can request app
 * account deletion"). Part of the legal set: it shares LEGAL_VERSION and the SET-ON-RELEASE
 * publish gate with /privacy and /terms, so it can only go live together with them.
 */
export const metadata: Metadata = {
  title: 'Delete your account — Loxymity',
  description:
    'How to delete your Loxymity account in the app or on the web, the 7-day restore window, and exactly what we keep afterwards and for how long.',
};

export default function DeleteAccountPage() {
  return (
    <LegalPage
      title="Delete your account"
      version={LEGAL_VERSION}
      effective={LEGAL_EFFECTIVE}
      intro={
        <p>
          You can delete your Loxymity account at any time — in the app, or here on the website. Adults
          have 7 days to change their mind; after that, everything is deleted except the few records the
          law requires us to keep, each for a set time.
        </p>
      }
    >
      <Section title="In the app">
        <List>
          <li>Open Loxymity on your iPhone or Android phone and go to <strong>You → Delete account</strong>.</li>
          <li>The screen shows what is deleted, what is kept, and what happens to circles you own.</li>
          <li>Confirm with your phone&rsquo;s Face ID, fingerprint or PIN.</li>
        </List>
      </Section>

      <Section title="On the web">
        <WebDeletion />
        <p className="text-sm text-dark-muted">
          Signed up with Apple and chose &ldquo;Hide My Email&rdquo;? Use the app, or write to{' '}
          <a href="mailto:privacy@loxymity.com">privacy@loxymity.com</a> from that address.
        </p>
      </Section>

      <Section title="What happens">
        <List>
          <li>Straight away you are signed out on every device, you disappear from your circles, your share links stop working and notifications stop.</li>
          <li>Your account is deleted 7 days later. To keep it, sign in before then and tap <strong>Restore</strong>. You can also choose to delete it immediately.</li>
          <li>Accounts of anyone under 18 are deleted straight away.</li>
          <li>When the deletion runs we remove your profile, photo, location history, places, drives, messages and chats (for everyone in them), diagnostic logs, Vault backup, and WhatsApp and Alexa records.</li>
          <li>Circles you own pass to another adult member, or are deleted if no other adult is left.</li>
        </List>
      </Section>

      <Section title="What we keep, and for how long">
        <List>
          <li><strong>Name, email address, phone number and the dates you joined and left</strong> — 180 days, as the Information Technology Rules, 2021 require. Then erased.</li>
          <li><strong>A record of the terms you agreed to</strong> — 3 years, so we can show consent was given.</li>
          <li><strong>A one-way fingerprint of your email address and verified phone number</strong> — 12 months, only so a new account can&rsquo;t claim a second free trial or referral reward. It can&rsquo;t be turned back into your email or number.</li>
          <li><strong>Call recordings</strong> — deleted within 28 days of the call.</li>
          <li><strong>Invoices for plans bought on loxymity.com</strong> — as long as tax law requires.</li>
        </List>
        <p>
          If a court or the police lawfully ask us to preserve an account, we keep what they ask for as long
          as they require. Copies in our providers&rsquo; backups are overwritten in their normal cycle.
          Section 8 of our <a href="/privacy/">Privacy Policy</a> has the details.
        </p>
      </Section>

      <Section title="Subscriptions">
        <Callout>
          <p>
            Deleting your account does not cancel a plan you pay for through the App Store or Google Play.
            Cancel it in your store account first, or you will keep being charged.
          </p>
        </Callout>
      </Section>

      <Section title="Need help?">
        <p>
          Write to <a href="mailto:privacy@loxymity.com">privacy@loxymity.com</a> from the email address on
          your account and we will delete it for you. We reply within 30 days.
        </p>
      </Section>
    </LegalPage>
  );
}
