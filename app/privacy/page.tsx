import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Loxymity',
  description:
    'Loxymity Privacy Policy. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPolicy() {
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
            Privacy Policy
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
              Loxymity is a real-time location sharing app for families and close
              friends, operated by Sawsib Infotech. This Privacy Policy explains
              what data we collect, how we use it, and your rights regarding that
              data. By using Loxymity, you agree to the practices described
              below.
            </p>
          </section>

          {/* 1. Data We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Data We Collect
            </h2>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
              Location Data
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-600">
              <li>
                GPS coordinates (latitude and longitude) collected in the
                foreground and background
              </li>
              <li>Speed at the time of each location update</li>
              <li>Battery level at the time of each location update</li>
              <li>Timestamps associated with each location reading</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
              Account Information
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-600">
              <li>Email address</li>
              <li>Display name</li>
              <li>Profile avatar (if provided)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
              Contact Data (Optional)
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-600">
              <li>
                If you choose to sync your contacts, we upload names and phone
                numbers to suggest circle members. This is entirely optional and
                requires your explicit permission.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
              Device Information
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-600">
              <li>Push notification token (for delivering alerts)</li>
              <li>Device model and operating system version</li>
              <li>App version</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
              Crash Reports
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-600">
              <li>
                Crash logs and diagnostic data collected via Firebase Crashlytics
                to help us identify and fix bugs
              </li>
            </ul>
          </section>

          {/* 2. How We Use Your Data */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. How We Use Your Data
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                <strong>Location sharing:</strong> Your location is shared in
                real time with members of the circles you have joined.
              </li>
              <li>
                <strong>Geofence alerts:</strong> We process your location to
                trigger notifications when you or a circle member enters or
                exits a geofenced area.
              </li>
              <li>
                <strong>SOS alerts:</strong> When you trigger an SOS, your
                current location is immediately shared with your circle members.
              </li>
              <li>
                <strong>iBeacon tracking:</strong> If you are near a registered
                Loxymity iBeacon token, your app may report the beacon&apos;s
                approximate location to its owner.
              </li>
              <li>
                <strong>Push notifications:</strong> We use your device token to
                deliver arrival/departure alerts, SOS alerts, and circle
                activity notifications.
              </li>
              <li>
                <strong>App improvement:</strong> Crash reports and aggregated
                usage data help us improve app stability and performance.
              </li>
            </ul>
          </section>

          {/* 3. Background Location Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Background Location Tracking
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Loxymity uses &ldquo;always-on&rdquo; background location
              tracking so that your circle members can see your location even
              when the app is not in the foreground. This is essential for
              features like geofence alerts, arrival notifications, and SOS.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              We employ battery-adaptive throttling to minimize power
              consumption. The frequency of location updates adjusts based on
              your device&apos;s battery level and movement state.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You can pause or stop location sharing at any time from within the
              app. Pausing immediately stops all location updates from being sent
              to your circles.
            </p>
          </section>

          {/* 4. Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Data Retention
            </h2>
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Latest location</p>
                  <p className="text-gray-600 text-sm">
                    Overwritten in real time with each new update. Only the most
                    recent position is stored.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Location history (Free plan)
                  </p>
                  <p className="text-gray-600 text-sm">
                    Retained for 24 hours, then automatically deleted.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">
                    Location history (Pro plan)
                  </p>
                  <p className="text-gray-600 text-sm">
                    Retained for up to 30 days, then automatically deleted.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Account data</p>
                  <p className="text-gray-600 text-sm">
                    Retained until you delete your account.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Third-Party Services
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We use the following third-party services to operate Loxymity:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 pr-4 font-semibold text-gray-900">
                      Service
                    </th>
                    <th className="py-3 font-semibold text-gray-900">
                      Purpose
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">Supabase</td>
                    <td className="py-3">
                      Backend database, authentication, and real-time data sync
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">Firebase Crashlytics</td>
                    <td className="py-3">Crash reporting and diagnostics</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">RevenueCat</td>
                    <td className="py-3">
                      Subscription and in-app purchase management
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">Expo Push Notifications</td>
                    <td className="py-3">Delivering push notifications</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Google Maps</td>
                    <td className="py-3">
                      Map rendering and directions
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-gray-600 text-sm mt-4 leading-relaxed">
              Each of these services has its own privacy policy. We encourage you
              to review them. We do not sell your personal data to any third
              party.
            </p>
          </section>

          {/* 6. Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Data Security
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                All data is transmitted over HTTPS/TLS encrypted connections.
              </li>
              <li>
                Database access is protected by Row Level Security (RLS)
                policies, ensuring users can only access data they are authorized
                to see.
              </li>
              <li>
                Sensitive tokens and credentials on-device are stored using
                Expo SecureStore (encrypted local storage).
              </li>
              <li>
                No service-role or admin database keys are included in the
                client application.
              </li>
            </ul>
          </section>

          {/* 7. Contact Sync */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Contact Sync
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Loxymity offers an optional contact sync feature. If you grant
              permission, we upload contact names and phone numbers to our
              servers solely to suggest circle members who are already using
              Loxymity. Contact data is not used for marketing, advertising, or
              any other purpose. You can revoke this permission at any time
              through your device settings.
            </p>
          </section>

          {/* 8. Account Deletion */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Account Deletion
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You can delete your account at any time from within the app
              (Settings &rarr; Account &rarr; Delete Account). Upon deletion,
              all of your data is permanently removed from our systems,
              including your profile, location history, circle memberships, and
              any uploaded contact data. This action is irreversible.
            </p>
          </section>

          {/* 9. Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              9. Your Rights
            </h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              Depending on your jurisdiction, you may have the following rights
              regarding your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>
                <strong>Access:</strong> Request a copy of the personal data we
                hold about you.
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate or
                incomplete data.
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal
                data (also available via self-serve account deletion).
              </li>
              <li>
                <strong>Data portability:</strong> Request your data in a
                structured, commonly used format.
              </li>
              <li>
                <strong>Withdraw consent:</strong> Withdraw consent for data
                processing at any time, where consent is the legal basis.
              </li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              To exercise any of these rights, contact us at{' '}
              <a
                href="mailto:support@loxymity.com"
                className="text-primary hover:text-primary-dark font-medium"
              >
                support@loxymity.com
              </a>
              .
            </p>
          </section>

          {/* 10. Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              10. Children&apos;s Privacy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Loxymity is designed for family use, including the ability for
              parents to track their children&apos;s locations. Accounts for
              children under 13 should be created and managed by a parent or
              guardian. We do not knowingly collect personal information from
              children under 13 without parental consent.
            </p>
          </section>

          {/* 11. Changes to This Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              11. Changes to This Policy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. When we make
              material changes, we will notify you through the app or by email.
              The &ldquo;Last updated&rdquo; date at the top of this page
              reflects the most recent revision.
            </p>
          </section>

          {/* 12. Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              12. Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions or concerns about this Privacy Policy or
              our data practices, please contact us:
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
            <a href="/terms" className="hover:text-gray-600 transition-colors">
              Terms of Service
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
