import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Loxymity',
  description:
    'Loxymity Terms of Service. Read the terms that govern your use of the Loxymity app.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-b from-indigo-50/60 to-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition-colors mb-8"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </a>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
            Terms of Service
          </h1>
          <p className="text-gray-500">
            Last updated: May 2026
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Sawsib Infotech (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;)
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="prose prose-gray max-w-none space-y-12">
          {/* Introduction */}
          <section>
            <p className="text-gray-600 leading-relaxed">
              These Terms of Service (&ldquo;Terms&rdquo;) govern your use of
              the Loxymity mobile application and related services (collectively,
              the &ldquo;Service&rdquo;), operated by Sawsib Infotech. By
              creating an account or using the Service, you agree to be bound by
              these Terms. If you do not agree, do not use the Service.
            </p>
          </section>

          {/* 1. Service Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Service Description
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Loxymity is a real-time location sharing application designed for
              families and close friends. The Service allows users to create
              private circles, share their live location with circle members,
              set geofence alerts, track iBeacon tokens, and send SOS alerts.
              The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; basis.
            </p>
          </section>

          {/* 2. Account Requirements */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Account Requirements
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                You must provide a valid email address to create an account.
              </li>
              <li>
                You are responsible for maintaining the security of your account
                credentials and for all activity that occurs under your account.
              </li>
              <li>
                Accounts for children under 13 must be created and managed by a
                parent or legal guardian.
              </li>
              <li>
                You agree to provide accurate, current, and complete information
                during registration and to keep it up to date.
              </li>
              <li>
                We reserve the right to suspend or terminate accounts that
                violate these Terms.
              </li>
            </ul>
          </section>

          {/* 3. Acceptable Use */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Acceptable Use
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Loxymity is designed for consensual location sharing among
              trusted individuals. You agree not to use the Service for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                <strong>Stalking or harassment:</strong> Tracking any person
                without their knowledge and explicit consent.
              </li>
              <li>
                <strong>Unauthorized surveillance:</strong> Monitoring
                individuals who have not voluntarily joined your circle.
              </li>
              <li>
                <strong>Illegal activity:</strong> Any use that violates
                applicable local, state, national, or international law.
              </li>
              <li>
                <strong>Abuse of the platform:</strong> Attempting to
                circumvent security measures, reverse-engineer the app, or
                interfere with the Service&apos;s operation.
              </li>
              <li>
                <strong>Spam or solicitation:</strong> Using the Service to
                send unsolicited messages or promotions.
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              Violation of these rules may result in immediate account
              termination and, where appropriate, referral to law enforcement.
            </p>
          </section>

          {/* 4. Location Data Consent */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Location Data Consent
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              By using the Service, you acknowledge and consent to the
              following:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                Loxymity collects your GPS location in both the foreground and
                background to provide real-time location sharing, geofence
                alerts, and SOS functionality.
              </li>
              <li>
                Background location tracking runs continuously while sharing is
                enabled. You can pause or stop sharing at any time.
              </li>
              <li>
                Your location is shared only with members of circles you have
                voluntarily joined.
              </li>
              <li>
                Location data is retained as described in our{' '}
                <a
                  href="/privacy"
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Privacy Policy
                </a>
                .
              </li>
            </ul>
          </section>

          {/* 5. Subscriptions and Payments */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Subscriptions and Payments
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                Loxymity offers a free tier and a paid Pro subscription.
                Subscription pricing is displayed in the app and may vary by
                region.
              </li>
              <li>
                Subscriptions are managed through RevenueCat and processed by
                the Apple App Store or Google Play Store.
              </li>
              <li>
                Pro subscriptions auto-renew at the end of each billing period
                unless cancelled at least 24 hours before the renewal date.
              </li>
              <li>
                Cancellation takes effect at the end of the current billing
                period. You will retain access to Pro features until that date.
              </li>
              <li>
                Refunds are handled according to the policies of the Apple App
                Store or Google Play Store, as applicable. We do not process
                refunds directly.
              </li>
              <li>
                We reserve the right to change subscription pricing. Existing
                subscribers will be notified in advance of any price changes.
              </li>
            </ul>
          </section>

          {/* 6. Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The Loxymity name, logo, and all associated branding, designs,
              and software are the property of Sawsib Infotech and are
              protected by applicable intellectual property laws. You may not
              copy, modify, distribute, or create derivative works of any part
              of the Service without our prior written consent.
            </p>
          </section>

          {/* 7. Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Limitation of Liability
            </h2>
            <div className="bg-gray-50 rounded-2xl p-6 text-gray-600 space-y-3">
              <p>
                To the maximum extent permitted by applicable law, Sawsib
                Infotech and its officers, employees, and affiliates shall not
                be liable for any indirect, incidental, special, consequential,
                or punitive damages arising out of or related to your use of
                the Service.
              </p>
              <p>
                This includes, without limitation, damages for loss of data,
                loss of profits, personal injury, or property damage, even if
                we have been advised of the possibility of such damages.
              </p>
              <p>
                The Service relies on GPS, cellular networks, and internet
                connectivity, which are inherently imprecise. We do not
                guarantee the accuracy, completeness, or timeliness of location
                data and shall not be held liable for any decisions made based
                on such data.
              </p>
              <p>
                Our total liability for any claim arising out of these Terms
                shall not exceed the amount you paid us in the twelve (12)
                months preceding the claim, or $50 USD, whichever is greater.
              </p>
            </div>
          </section>

          {/* 8. Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Disclaimer of Warranties
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; without warranties of any kind, either express or
              implied, including but not limited to implied warranties of
              merchantability, fitness for a particular purpose, and
              non-infringement. We do not warrant that the Service will be
              uninterrupted, error-free, or completely secure.
            </p>
          </section>

          {/* 9. Indemnification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Indemnification
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You agree to indemnify, defend, and hold harmless Sawsib Infotech
              and its officers, employees, and affiliates from any claims,
              damages, losses, or expenses (including reasonable legal fees)
              arising out of your use of the Service, your violation of these
              Terms, or your violation of any rights of a third party.
            </p>
          </section>

          {/* 10. Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Termination
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                You may delete your account at any time from within the app.
                Upon deletion, all your data will be permanently removed.
              </li>
              <li>
                We may suspend or terminate your account if you violate these
                Terms, with or without notice.
              </li>
              <li>
                Upon termination, your right to use the Service ceases
                immediately. Provisions that by their nature should survive
                (including limitation of liability, indemnification, and
                dispute resolution) will remain in effect.
              </li>
            </ul>
          </section>

          {/* 11. Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Privacy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Your use of the Service is also governed by our{' '}
              <a
                href="/privacy"
                className="text-primary hover:text-primary-dark font-medium"
              >
                Privacy Policy
              </a>
              , which describes how we collect, use, and protect your data. By
              using the Service, you agree to the data practices described in
              the Privacy Policy.
            </p>
          </section>

          {/* 12. Changes to These Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Changes to These Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may revise these Terms at any time by posting the updated
              version on our website and in the app. Material changes will be
              communicated through the app or by email. Your continued use of
              the Service after changes take effect constitutes acceptance of the
              revised Terms.
            </p>
          </section>

          {/* 13. Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              13. Governing Law
            </h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms shall be governed by and construed in accordance with
              the laws of India, without regard to conflict of law principles.
              Any disputes arising under these Terms shall be subject to the
              exclusive jurisdiction of the courts in India.
            </p>
          </section>

          {/* 14. Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              14. Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 mt-4">
              <p className="font-semibold text-gray-900">Sawsib Infotech</p>
              <p className="text-gray-600 mt-1">
                Email:{' '}
                <a
                  href="mailto:support@loxymity.com"
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  support@loxymity.com
                </a>
              </p>
              <p className="text-gray-600 mt-1">
                Website:{' '}
                <a
                  href="https://loxymity.com"
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  loxymity.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Sawsib Infotech. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-gray-600 transition-colors">
              Privacy Policy
            </a>
            <a href="/" className="hover:text-gray-600 transition-colors">
              Home
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
