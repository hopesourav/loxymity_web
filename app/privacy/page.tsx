import type { Metadata } from 'next';
import Link from 'next/link';
import { LogoFull } from '../_components/Logo';

export const metadata: Metadata = {
  title: 'Privacy Policy — Loxymity',
  description: 'How Loxymity collects, uses, and protects your personal data.',
};

export default function PrivacyPolicy() {
  const effective = 'September 19, 2026';

  return (
    <div className="min-h-screen bg-dark-bg">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/90 backdrop-blur-lg border-b border-dark-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <LogoFull className="text-2xl font-bold" />
          </Link>
          <Link href="/" className="text-sm text-dark-muted hover:text-dark-text transition-colors">← Back to Home</Link>
        </div>
      </nav>

      <main className="pt-28 pb-24 px-6">
        <div className="max-w-3xl mx-auto">

          <h1 className="text-4xl font-black text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-gray-500 text-sm mb-12">Effective date: {effective}</p>

          <Section title="1. Who we are">
            <p>
              Loxymity is operated by <strong>AMSEK RESEARCH LABS LLP</strong>. References to
              &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo; in this policy refer to
              AMSEK RESEARCH LABS LLP. You can reach us at{' '}
              <a href="mailto:privacy@loxymity.com" className="text-indigo-600 underline">
                privacy@loxymity.com
              </a>.
            </p>
          </Section>

          <Section title="2. What data we collect">
            <p className="mb-3">
              Not every category below applies to every user. Several are collected only if you
              switch the relevant feature on, and each one says so.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Location data</strong> — your GPS coordinates, accuracy, speed, heading,
                battery level, and charging state. Collected continuously in the background when you
                have enabled location sharing.
              </li>
              <li>
                <strong>Account data</strong> — your email address and display name, provided when
                you register. Your phone number, if you link WhatsApp or Alexa.
              </li>
              <li>
                <strong>Device data</strong> — anonymous device identifiers, app version, and
                background-reliability diagnostics used to diagnose crashes and keep tracking alive
                on manufacturer-restricted phones.
              </li>
              <li>
                <strong>Motion and driving data</strong> — if driving reports are enabled, we record
                trip start and end points, distance, duration, speed and stop patterns. We also
                sample your accelerometer during a drive to measure road roughness (the Smoothness
                Index). Accelerometer data is summarised on the device into per-interval figures;
                the raw sensor stream never leaves your phone.
              </li>
              <li>
                <strong>Messages</strong> — the content of circle chat and direct messages, plus
                delivery and read status. Stored so messages sync across your devices.
              </li>
              <li>
                <strong>Calls and call recordings</strong> — metadata for in-app voice and video
                calls (participants, start and end time, duration). Voice calls are recorded; see
                section 5 below, which explains this in full.
              </li>
              <li>
                <strong>Bluetooth relay data</strong> — if the offline courier is enabled, your
                phone broadcasts an encrypted, rotating identifier and may carry small encrypted
                packets on behalf of other Loxymity users who are nearby and offline, and they may
                carry yours. A relaying device cannot read what it carries. See section 6.
              </li>
              <li>
                <strong>iBeacon data</strong> — UUID, major, and minor values of Bluetooth iBeacon
                tokens you register in the app.
              </li>
              <li>
                <strong>Geo-fence data</strong> — names and coordinates of geo-fences you create.
              </li>
              <li>
                <strong>Flight data</strong> — flight numbers and itineraries you choose to track,
                and the public position reports associated with them.
              </li>
              <li>
                <strong>Assistant queries</strong> — questions you ask in the app, in WhatsApp, or
                to Alexa, and the answers returned. See section 5 for how these are processed.
              </li>
              <li>
                <strong>Backups (optional)</strong> — if you enable Loxymity Vault, an encrypted
                copy of your on-device database. We store the encrypted file and cannot read it;
                the key is derived from your backup password, which never leaves your device.
              </li>
              <li>
                <strong>Contact data (optional)</strong> — if you grant contacts permission, we
                collect names, phone numbers, and email addresses from your device contacts.
                This data is used solely to suggest people to invite to your circle and, with your
                consent, for marketing communications. You may revoke this permission at any time in
                your device settings.
              </li>
            </ul>
          </Section>

          <Section title="3. How we use your data">
            <ul className="list-disc pl-5 space-y-2">
              <li>To show your location to members of circles you have joined.</li>
              <li>To send geo-fence entry/exit notifications to your circle.</li>
              <li>To detect your iBeacon tokens and share their presence with your circle.</li>
              <li>To deliver SOS alerts to your circle.</li>
              <li>To produce your driving reports and road-quality figures.</li>
              <li>To deliver messages and calls between circle members.</li>
              <li>To track flights you have asked us to track and tell your circle when they land.</li>
              <li>
                To match official government weather and disaster alerts against where your circle
                actually is, so you only receive alerts that are relevant to you.
              </li>
              <li>To answer questions you ask the assistant, in the app, in WhatsApp, or via Alexa.</li>
              <li>To improve the reliability and performance of the service.</li>
              <li>
                To suggest circle invites based on your contacts (only if permission granted).
              </li>
              <li>
                To send relevant product updates to people in your contacts list who may benefit from
                Loxymity (only if you have granted contact access and only to contacts who have not
                opted out).
              </li>
            </ul>
            <p className="mt-3">
              We do not use your location, messages, calls, or driving data to target advertising,
              and we do not sell any of it. We do not use your content to train machine-learning
              models.
            </p>
          </Section>

          <Section title="4. Location data — adaptive collection">
            <p>
              Loxymity uses an adaptive algorithm to balance accuracy and battery life. There are no
              fixed polling intervals; the app picks one of two modes from what your phone is doing:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>
                <strong>Moving</strong> — at most one update every 60 seconds, and only after you
                have moved at least 20 metres.
              </li>
              <li>
                <strong>Stationary</strong> — at most one update every 10 minutes, and only after a
                50 metre change. The app switches to this mode as soon as it detects you have
                stopped.
              </li>
              <li>
                <strong>Battery below 20 % and not charging</strong> — the stationary cadence is used
                regardless of whether you are moving. Charging exempts you from this downgrade; it
                does not otherwise increase how often your position is collected.
              </li>
              <li>
                <strong>During a drive</strong> — a drive in progress keeps the faster cadence even
                below 20 % battery, easing to one update every 2 minutes, and stops overriding the
                battery saver entirely below 10 %.
              </li>
            </ul>
            <p className="mt-3">
              You can turn off location sharing entirely at any time from the Settings screen inside
              the app.
            </p>
          </Section>

          <Section title="5. Calls, recordings, and the assistant">
            <p className="mb-3">
              <strong>Call recording.</strong> In-app voice calls placed between circle members are
              recorded automatically from the moment the call starts. Recording is a property of the
              service, not a per-call choice, so there is no prompt before each call — by placing or
              answering an in-app voice call you and the other participants consent to that call
              being recorded. Video calls are not recorded. Recordings are encrypted at rest, held
              for 28 days and then deleted automatically. If you do not want a conversation
              recorded, use your normal phone dialler instead of an in-app call.
            </p>
            <p className="mb-3">
              Laws on recording conversations differ by country and by state, and in some places all
              parties must consent. You are responsible for your own compliance when you place a
              call, and you should tell anyone you regularly call in-app that these calls are
              recorded.
            </p>
            <p>
              <strong>The assistant.</strong> Questions you ask Loxymity — in the app, in WhatsApp,
              or through Alexa — are sent to a third-party language-model provider (Groq) to be
              interpreted, together with the minimum context needed to answer, which may include a
              circle member name and their current location. The provider processes the request on
              our behalf and does not retain it to train models. Many questions are answered from a
              curated local corpus or from your device cache and never reach the provider at all.
            </p>
          </Section>

          <Section title="6. The offline courier">
            <p>
              When a phone has no internet connection, nearby Loxymity phones can carry its location
              or messages onward until one of them reaches the network. If you have the feature
              enabled, your phone participates in both directions.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>
                Packets are encrypted end-to-end. A phone that carries a packet cannot read it, and
                learns nothing about whose packet it is.
              </li>
              <li>
                The identifier broadcast over Bluetooth rotates, so a device cannot be followed
                across sightings by a passive observer.
              </li>
              <li>
                A relayed location is only ever delivered to the circles the sender already shares
                with. Relaying does not widen who can see you.
              </li>
              <li>
                You can turn the courier off in the app. Your own location sharing continues to work
                normally over the internet.
              </li>
            </ul>
          </Section>

          <Section title="7. Data sharing">
            <p>
              We do <strong>not</strong> sell your personal data to third parties, and we have no
              advertising. We share data only as follows:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>
                <strong>Your circle members</strong> — can see your real-time location and
                geo-fence events as long as you are sharing.
              </li>
              <li>
                <strong>Law enforcement</strong> — we may disclose data where required by a court
                order or applicable law.
              </li>
            </ul>
            <p className="mt-4 mb-3">
              We also use the following processors, each under a data processing agreement and each
              receiving only what its function requires:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Supabase</strong> — our database and authentication provider. Your data is
                stored in the <strong>Asia Pacific (Mumbai, India)</strong> region.
              </li>
              <li>
                <strong>Cloudflare R2</strong> — stores encrypted Vault backups and call recordings.
              </li>
              <li>
                <strong>Agora</strong> — carries in-app voice and video calls and produces
                recordings.
              </li>
              <li>
                <strong>Groq</strong> — interprets assistant questions, as described in section 5.
              </li>
              <li>
                <strong>Google Maps Platform</strong> — map tiles, geocoding, directions and Street
                View imagery. A coordinate is sent when one of these is displayed.
              </li>
              <li>
                <strong>BigDataCloud</strong> — converts coordinates into place names.
              </li>
              <li>
                <strong>adsbdb and FlightAware</strong> — resolve and track flights you have asked us
                to track.
              </li>
              <li>
                <strong>OpenWeather and WeatherAPI</strong> — weather conditions for a location.
              </li>
              <li>
                <strong>Meta (WhatsApp Business Platform)</strong> and <strong>Amazon
                (Alexa)</strong> — carry your messages and voice requests if you link those
                integrations.
              </li>
              <li>
                <strong>Expo, Apple (APNs) and Google (FCM)</strong> — deliver push notifications.
              </li>
              <li>
                <strong>RevenueCat, Apple, Google, Stripe and Razorpay</strong> — process
                subscription purchases and validate entitlements. None of them receive location
                data.
              </li>
            </ul>
          </Section>

          <Section title="8. Data retention">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Latest location</strong> — overwritten on every update; only the most
                recent position is stored on our servers.
              </li>
              <li>
                <strong>Location history on our servers</strong> — how long we keep a point depends
                on the best plan you benefit from: 2 days on Free, 30 days on Gold, 90 days on
                Platinum and 180 days on Infinite. Because a circle plan covers the whole circle, a
                Free member of a paid circle gets that circle&apos;s window rather than 2 days. If
                you later drop to a shorter window, points already stored are not retroactively
                deleted before their original window expires. Older points are deleted
                automatically.
              </li>
              <li>
                <strong>Location history on your phone</strong> — your device keeps its own copy for
                as long as you choose, on every plan including Free. This copy is yours: it is not
                subject to the server windows above, and you control it from Data &amp; Storage in
                the app, where you can shorten retention or delete it outright.
              </li>
              <li>
                <strong>Driving reports</strong> — retained for 30 days on Free and Gold, and for
                the length of your history window on Platinum and Infinite.
              </li>
              <li>
                <strong>Call recordings</strong> — 28 days, then deleted automatically.
              </li>
              <li>
                <strong>Messages</strong> — retained until you or the sender deletes them, or until
                the circle is deleted.
              </li>
              <li>
                <strong>Vault backups</strong> — retained while backups are enabled. Disabling
                Vault deletes the stored copy.
              </li>
              <li>
                <strong>Contacts</strong> — retained until you delete your account or revoke
                contacts permission.
              </li>
              <li>
                <strong>Account data</strong> — retained until you delete your account. Account
                deletion requests can be sent to{' '}
                <a href="mailto:support@loxymity.com" className="text-indigo-600 underline">
                  support@loxymity.com
                </a>
                ; data is removed within 30 days.
              </li>
            </ul>
          </Section>

          <Section title="9. Security">
            <p>
              All data is encrypted in transit (TLS 1.2+) and at rest. Authentication tokens are
              stored in your device&apos;s secure keychain / keystore — never in plain storage.
              We use row-level security on our database so each user can only access their own data
              and data shared within circles they belong to.
            </p>
            <p className="mt-3">
              Two things are encrypted such that we cannot read them at all. <strong>Vault
              backups</strong> use AES-256-GCM with a key stretched from your backup password on
              your device; we hold only the ciphertext and never receive the password.
              <strong> Offline courier packets</strong> are encrypted end-to-end between the sender
              and the circle they are addressed to, so neither the phones that carry them nor our
              servers can read them in transit.
            </p>
          </Section>

          <Section title="10. Children">
            <p>
              Loxymity is not directed at children under 13 (or under 16 in the EU). We do not
              knowingly collect personal information from children. If you believe a child has
              provided us with personal data, please contact us and we will delete it promptly.
            </p>
          </Section>

          <Section title="11. Your rights">
            <p>
              Depending on your jurisdiction, you may have the right to access, correct, delete, or
              port your personal data, and to object to or restrict certain processing. To exercise
              any of these rights, contact us at{' '}
              <a href="mailto:privacy@loxymity.com" className="text-indigo-600 underline">
                privacy@loxymity.com
              </a>.
            </p>
          </Section>

          <Section title="12. Changes to this policy">
            <p>
              We may update this policy from time to time. When we do, we will update the effective
              date above and, where the changes are material, notify you via email or an in-app
              notice.
            </p>
          </Section>

          <Section title="13. Contact us">
            <p>
              Questions about this policy? Email{' '}
              <a href="mailto:privacy@loxymity.com" className="text-indigo-600 underline">
                privacy@loxymity.com
              </a>{' '}
              or write to: AMSEK RESEARCH LABS LLP, privacy@loxymity.com.
            </p>
          </Section>

        </div>
      </main>

      <footer className="py-10 px-6 bg-dark-bg border-t border-dark-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="mb-2">
              <LogoFull className="text-xl font-bold opacity-80" />
            </div>
            <p className="text-dark-muted text-sm">© {new Date().getFullYear()} AMSEK RESEARCH LABS LLP. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-sm text-dark-muted">
            <Link href="/privacy" className="text-dark-text">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-dark-text transition-colors">Terms of Service</Link>
            <a href="mailto:hello@loxymity.com" className="hover:text-dark-text transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-gray-600 leading-relaxed space-y-2">{children}</div>
    </section>
  );
}
