import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — Loxymity',
  description: 'How Loxymity collects, uses, and protects your personal data.',
};

export default function PrivacyPolicy() {
  const effective = 'May 11, 2026';

  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-indigo-600">Loxymity</Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">← Back to Home</Link>
        </div>
      </nav>

      <main className="pt-28 pb-24 px-6">
        <div className="max-w-3xl mx-auto">

          <h1 className="text-4xl font-black text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-gray-500 text-sm mb-12">Effective date: {effective}</p>

          <Section title="1. Who we are">
            <p>
              Loxymity is operated by <strong>Sawsib Infotech</strong>. References to
              &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo; in this policy refer to
              Sawsib Infotech. You can reach us at{' '}
              <a href="mailto:privacy@loxymity.com" className="text-indigo-600 underline">
                privacy@loxymity.com
              </a>.
            </p>
          </Section>

          <Section title="2. What data we collect">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Location data</strong> — your GPS coordinates, accuracy, speed, heading,
                battery level, and charging state. Collected continuously in the background when you
                have enabled location sharing.
              </li>
              <li>
                <strong>Account data</strong> — your email address and display name, provided when
                you register.
              </li>
              <li>
                <strong>Device data</strong> — anonymous device identifiers and app version used to
                diagnose crashes and improve the service.
              </li>
              <li>
                <strong>iBeacon data</strong> — UUID, major, and minor values of Bluetooth iBeacon
                tokens you register in the app.
              </li>
              <li>
                <strong>Geo-fence data</strong> — names and coordinates of geo-fences you create.
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
          </Section>

          <Section title="4. Location data — adaptive collection">
            <p>
              Loxymity uses an adaptive algorithm to balance accuracy and battery life:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>
                <strong>Moving</strong> — updates sent every 60 seconds or every 50 metres,
                whichever comes first.
              </li>
              <li>
                <strong>Stationary (5+ minutes)</strong> — reduced frequency; only significant
                position changes are reported.
              </li>
              <li>
                <strong>Battery below 20 %</strong> — switches to low-power mode; only coarse
                position changes are reported.
              </li>
              <li>
                <strong>Charging</strong> — full precision maintained regardless of battery level.
              </li>
            </ul>
            <p className="mt-3">
              You can turn off location sharing entirely at any time from the Settings screen inside
              the app.
            </p>
          </Section>

          <Section title="5. Data sharing">
            <p>
              We do <strong>not</strong> sell your personal data to third parties. We share data
              only as follows:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>
                <strong>Your circle members</strong> — can see your real-time location and
                geo-fence events as long as you are sharing.
              </li>
              <li>
                <strong>Supabase</strong> — our database provider stores your data in the EU /
                US. Supabase processes data under a Data Processing Agreement that meets GDPR
                requirements.
              </li>
              <li>
                <strong>RevenueCat</strong> — processes in-app purchase information to validate
                your subscription. RevenueCat does not receive location data.
              </li>
              <li>
                <strong>Law enforcement</strong> — we may disclose data where required by a court
                order or applicable law.
              </li>
            </ul>
          </Section>

          <Section title="6. Data retention">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Latest location</strong> — overwritten on every update; only the most
                recent position is stored.
              </li>
              <li>
                <strong>Location history</strong> — retained for up to 30 days (Pro subscribers)
                or 7 days (Free), then automatically deleted.
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

          <Section title="7. Security">
            <p>
              All data is encrypted in transit (TLS 1.2+) and at rest. Authentication tokens are
              stored in your device&apos;s secure keychain / keystore — never in plain storage.
              We use row-level security on our database so each user can only access their own data
              and data shared within circles they belong to.
            </p>
          </Section>

          <Section title="8. Children">
            <p>
              Loxymity is not directed at children under 13 (or under 16 in the EU). We do not
              knowingly collect personal information from children. If you believe a child has
              provided us with personal data, please contact us and we will delete it promptly.
            </p>
          </Section>

          <Section title="9. Your rights">
            <p>
              Depending on your jurisdiction, you may have the right to access, correct, delete, or
              port your personal data, and to object to or restrict certain processing. To exercise
              any of these rights, contact us at{' '}
              <a href="mailto:privacy@loxymity.com" className="text-indigo-600 underline">
                privacy@loxymity.com
              </a>.
            </p>
          </Section>

          <Section title="10. Changes to this policy">
            <p>
              We may update this policy from time to time. When we do, we will update the effective
              date above and, where the changes are material, notify you via email or an in-app
              notice.
            </p>
          </Section>

          <Section title="11. Contact us">
            <p>
              Questions about this policy? Email{' '}
              <a href="mailto:privacy@loxymity.com" className="text-indigo-600 underline">
                privacy@loxymity.com
              </a>{' '}
              or write to: Sawsib Infotech, privacy@loxymity.com.
            </p>
          </Section>

        </div>
      </main>

      <footer className="py-10 px-6 bg-gray-950 text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg">Loxymity</p>
            <p className="text-sm mt-1">© {new Date().getFullYear()} Sawsib Infotech. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-white">Privacy Policy</Link>
            <a href="mailto:hello@loxymity.com" className="hover:text-white transition-colors">Contact</a>
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
