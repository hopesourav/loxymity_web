import type { Metadata } from 'next';
import { LegalPage, Section, Sub, List, Callout, Table, LEGAL_VERSION, LEGAL_EFFECTIVE } from '../_components/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy — Loxymity',
  description:
    'What Loxymity collects, who can see it, which providers process it, how long it is kept, how it is protected, and your rights under the DPDP Act, GDPR and US privacy laws.',
};

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      version={LEGAL_VERSION}
      effective={LEGAL_EFFECTIVE}
      intro={
        <>
          <p>
            Loxymity is a location-sharing app, so it handles some of the most personal data there is.
            This policy explains exactly what we collect, who can see it, where it goes, how long we keep
            it and what you can do about it. It applies to the Loxymity apps, loxymity.com, the web
            dashboard and our WhatsApp and Alexa integrations.
          </p>
          <Callout>
            <p className="text-dark-text font-semibold">The short version</p>
            <List>
              <li>We do not sell your data, show ads, or use your data to train AI models.</li>
              <li>
                Your location is shared with the people in your circles — and, only if you choose, with
                anyone holding a share link you create, or people asking through WhatsApp or Alexa.
              </li>
              <li>
                Your circle sees more than a dot: history, battery, driving, arrivals and some phone
                status. Section 4 lists all of it.
              </li>
              <li>
                Locations, messages and calls are encrypted in transit and protected on our servers, but
                they are <strong>not end-to-end encrypted</strong>. Only Vault backups are.
              </li>
              <li>In-app voice calls are recorded and kept for 28 days — never when a child is on the call.</li>
              <li>You can pause sharing, leave circles, turn features off and delete your account in the app.</li>
            </List>
          </Callout>
        </>
      }
    >
      <Section title="1. Who we are">
        <p>
          Loxymity is operated by <strong>AMSEK RESEARCH LABS LLP</strong>, West Bengal, India. For the
          personal data described here we are the data fiduciary under India&rsquo;s Digital Personal
          Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;) and the controller under the EU and UK GDPR.
          Contact us at <a href="mailto:privacy@loxymity.com">privacy@loxymity.com</a>. Our Grievance
          Officer is described in section 13.
        </p>
        <p>
          When you use Loxymity to locate other people, you also decide what happens to their data.
          Using it within your family or household is usually a personal activity outside data-protection
          law; using it for work, an organisation or any other non-household purpose makes you
          responsible for that data under the law. See section 4 of our{' '}
          <a href="/terms/#your-responsibilities">Terms of Service</a>.
        </p>
      </Section>

      <Section title="2. What we collect">
        <p>
          Some of this applies only if you use the feature concerned. Where a feature is on by default,
          we say so — and you can turn it off.
        </p>

        <Sub title="2.1 Information you give us">
          <List>
            <li>
              <strong>Account:</strong> name, email address, password (stored only as a secure hash by
              our authentication provider), and profile photo. If you sign in with Apple or Google, the
              name, email (or Apple private-relay address) and account identifier they provide; for
              Apple, a token we use only to revoke the link when you delete your account.
            </li>
            <li>
              <strong>Phone number:</strong> optional, verified through WhatsApp, and required for a parent
              who invites a child. Used for verification, WhatsApp and Alexa, and safety features.
            </li>
            <li>
              <strong>Age and consent records:</strong> we ask for the month and year you were born but
              keep only whether you are 18 or older — never the date. We also keep which versions of
              these documents you accepted and when, your usage-statistics choice, and, for children, the
              parent or guardian&rsquo;s confirmation.
            </li>
            <li>
              <strong>What you create:</strong> circles and invites; places (name, location, size, alert
              settings); names you give to stops; nicknames and relationship labels you set for people
              (visible only to you); plans and schedules (including any calendar event you choose to
              import); trips and destinations; flights you track; messages and quick notes (&ldquo;On my
              way&rdquo;, &ldquo;Arrived safely&rdquo;); SOS messages and responses.
            </li>
            <li><strong>Support and requests:</strong> what you send us, and our replies.</li>
            <li>
              <strong>Blocks and reports:</strong> who you block, and when you report a message, your
              reason and a copy of the message — kept even if the sender later deletes it.
            </li>
          </List>
        </Sub>

        <Sub title="2.2 Collected from your phone while you share">
          <List>
            <li>
              <strong>Precise location</strong> — in the foreground and in the background — with its
              accuracy, speed, heading, altitude, time and how it was obtained.
            </li>
            <li>
              <strong>Phone status sent with each location:</strong> battery level and charging; activity
              (still, walking, in a vehicle) and today&rsquo;s step count; network type and, on Android, the
              name of the Wi-Fi network you are connected to (never stored for anyone under 18, or for an
              account that has not told us its age); ringer mode; when the screen was last on and whether
              the phone is idle.
            </li>
            <li>
              <strong>Device and app:</strong> make, model, operating system and app version, an identifier
              for this installation, and push-notification tokens.
            </li>
            <li>
              <strong>Diagnostics:</strong> crash reports, and an app diagnostic log uploaded regularly so
              we can fix background-tracking problems. On Android the log can include coordinates. Reports
              about how well tracking survives on your phone model (for example battery-optimisation
              state).
            </li>
          </List>
          <p>
            How often your phone reports depends on what it is doing. Typically it is at most about once a
            minute while you move and about once every ten minutes while you are still, less often on low
            battery, and phones are also woken periodically so the map stays current. Some features report
            faster for a short time: Live mode (any member of a circle can start it; every member&rsquo;s
            phone then reports about every 30 seconds for up to an hour), an active trip, or an SOS.
          </p>
        </Sub>

        <Sub title="2.3 Created by the Service">
          <List>
            <li><strong>Location history</strong> and the stops and moves built from it.</li>
            <li>
              <strong>Drives</strong> (Drive Tracking is on by default): start and end places, route,
              distance, duration, speeds, speeding events, time in traffic, a score and grade, and a
              road-smoothness figure. Road smoothness comes from your phone&rsquo;s motion sensor, which is
              summarised on the phone; the raw sensor stream never leaves it.
            </li>
            <li>
              <strong>Safety events:</strong> place arrivals and departures, speeding (over 120 km/h), low
              battery, possible crashes (Crash detection is on by default), falls (if you turn Fall
              detection on), and SOS alerts and responses.
            </li>
            <li><strong>Schedule checks:</strong> whether someone arrived on time, late or not at all, and how far away they were.</li>
            <li>
              <strong>Calls:</strong> who called whom, when and for how long; and <strong>recordings of
              in-app voice calls</strong> (section 5).
            </li>
            <li>
              <strong>Viewing record:</strong> when you open a member&rsquo;s card on the map we record that
              you viewed them. Members with Privacy Shield (Infinite) can see who viewed them.
            </li>
            <li>
              <strong>Service records:</strong> notifications sent and why, monthly usage counters for
              plan allowances, purchases and plan changes, and referral rewards.
            </li>
          </List>
        </Sub>

        <Sub title="2.4 Offline Bluetooth relay (on by default)">
          <p>
            &ldquo;Findable when offline&rdquo; lets a nearby Loxymity phone carry your location, or an SOS,
            to our servers when you have no internet, and lets your phone do the same for others. Your
            phone broadcasts a rotating Bluetooth identifier and small encrypted packets.{' '}
            <strong>Phones that carry a packet cannot read it; our server decrypts it</strong> and delivers
            it only to your circles. To operate the relay we record which identifier was heard by which
            phone, the signal strength and the carrying phone&rsquo;s location, kept for 7 days. You can
            turn this off in Settings → Offline relay.
          </p>
        </Sub>

        <Sub title="2.5 WhatsApp, Alexa and the assistant (optional)">
          <List>
            <li>
              <strong>WhatsApp:</strong> your phone number, the messages you send to our WhatsApp number,
              and our replies.
            </li>
            <li><strong>Alexa:</strong> your Alexa user and device identifiers, your requests and our replies.</li>
            <li><strong>In-app assistant (Loxy):</strong> your questions and its answers.</li>
          </List>
          <p>
            Replies can include other circle members&rsquo; names, last known place, how long ago, battery
            and activity. Only the text of a question is sent to our language-model provider (section 6).
          </p>
        </Sub>

        <Sub title="2.6 Stays on your phone">
          <List>
            <li>
              <strong>Contacts</strong> — if you allow access, read on your phone only so you can pick
              someone to invite. Never uploaded, stored or used by us to contact anyone.
            </li>
            <li>
              <strong>Calendar</strong> — read on your phone only; just the events you choose to import are
              sent, as plans.
            </li>
            <li>
              <strong>Your full on-device history</strong> — your phone keeps its own copy of your trail,
              stops and drives for as long as you choose (Data &amp; Storage).
            </li>
            <li><strong>Backups</strong> — kept on your phone unless you choose Vault (section 8).</li>
          </List>
        </Sub>

        <Sub title="2.7 Before you have an account">
          <p>
            Until an account exists on your phone, the app keeps an anonymous summary of each visit to
            the sign-up screens: how far you got, which errors happened, whether it was a first or repeat
            visit, the date, and your phone&rsquo;s make, model, operating system, app version, language,
            text size and connection type. It contains no name, email, phone number, location or device
            identifier, we do not store your IP address with it, and summaries are not linked to each other
            or to any account you create later. If you say you are under 18, it records only that answer
            and how far you got. You can turn it off on the sign-in screen.
          </p>
        </Sub>

        <Sub title="2.8 Usage statistics (optional)">
          <p>
            If you agree at sign-up, we record which setup steps you complete (for example &ldquo;circle
            created&rdquo;), linked to your account but with no names, contacts, messages or locations. Never
            collected from anyone under 18. To withdraw, email{' '}
            <a href="mailto:privacy@loxymity.com">privacy@loxymity.com</a>.
          </p>
        </Sub>

        <Sub title="2.9 Our website and dashboard">
          <p>
            loxymity.com uses no advertising or analytics cookies. The dashboard keeps your sign-in session
            in your browser&rsquo;s storage. Maps on the website load tiles from OpenStreetMap, and searching
            for a place on the dashboard sends your search to OpenStreetMap&rsquo;s Nominatim service, so
            your browser shares your IP address with them. Our hosting provider (Cloudflare) processes
            visitors&rsquo; IP addresses to deliver and protect the site.
          </p>
        </Sub>
      </Section>

      <Section title="3. Why we use it, and our legal bases">
        <Table
          head={['Purpose', 'What it covers', 'Legal basis']}
          rows={[
            ['Running the Service you asked for', 'Sharing your location with your circles, history, places and alerts, driving reports, messages, calls, trips, flights, share links, backups, integrations you link', 'Your consent (DPDP Act s.6); performing our contract with you (GDPR Art. 6(1)(b))'],
            ['Safety and emergencies', 'SOS, crash and fall alerts, re-alerting a circle, emergency-hour calls', 'Consent; and, in an emergency, a legitimate use to respond to a threat to life or health (DPDP Act s.7); vital interests (GDPR Art. 6(1)(d))'],
            ['Keeping it working and secure', 'Diagnostics, crash reports, abuse prevention, fraud and plan-limit checks', 'Consent given when you accept this policy (DPDP Act); legitimate interests (GDPR Art. 6(1)(f))'],
            ['Billing', 'Plans, trials, renewals, referral rewards', 'Contract; legal obligations (tax and accounting)'],
            ['Improving sign-up', 'Optional usage statistics; anonymous sign-up diagnostics', 'Consent; the diagnostics are anonymous'],
            ['Legal compliance', 'Responding to lawful requests, enforcing our Terms, keeping records the law requires', 'Legal obligation; legitimate uses under DPDP Act s.7'],
          ]}
        />
        <p>
          We do not sell personal data, show advertising, build advertising profiles, or use your data to
          train machine-learning models. Driving scores, arrival checks and crash detection are automated,
          but they are only shown to you and your circle and are never used to make decisions with legal
          or similarly significant effects on you.
        </p>
      </Section>

      <Section title="4. Who can see your data">
        <Sub title="4.1 People in your circles">
          <p>While you share with a circle, its members can see:</p>
          <List>
            <li>your live location and when it was last updated;</li>
            <li>your location history, for as far back as the circle&rsquo;s plan allows;</li>
            <li>
              your battery and charging, activity and steps, network type and (on Android, for adults)
              Wi-Fi network name, ringer mode, and when your phone was last active;
            </li>
            <li>your arrivals at and departures from places, and your schedule checks;</li>
            <li>
              your drives and driving scores if the circle has Platinum or Infinite and &ldquo;Share Drives
              With Circle&rdquo; is on;
            </li>
            <li>your SOS alerts, crash and other safety events, trips and live ETAs, and flights you track;</li>
            <li>your messages to the circle and, unless you hide them, your read receipts.</li>
          </List>
          <p>
            If you pause sharing, your phone stops sending new locations; members still see the last
            location you shared and when. Ghost mode (Infinite) hides your location from your circle&rsquo;s
            map and history. Location blur (Infinite) makes your position approximate on other
            members&rsquo; screens, but your exact position is still sent to their phones, so it is not a
            way to hide where you are. Circle owners can approve, remove and manage members.
          </p>
        </Sub>
        <Sub title="4.2 Anyone with a share link you create">
          <p>
            Your name, photo, live location and its accuracy, without an account, until the link expires
            (at most 24 hours) or you revoke it. Never your history.
          </p>
        </Sub>
        <Sub title="4.3 People asking through WhatsApp, Alexa or the assistant">
          <p>
            A circle member who links WhatsApp or Alexa, or asks the in-app assistant, can get your name,
            last known place, how long ago, battery and activity. WhatsApp and Alexa answers are delivered
            by Meta and Amazon.
          </p>
        </Sub>
        <Sub title="4.4 Your profile photo">
          <p>Profile photos are stored at an unlisted web address that anyone who has the address can open.</p>
        </Sub>
        <Sub title="4.5 Our team">
          <p>
            A small number of authorised people can access data when it is needed to support you, fix a
            problem, keep the Service secure, review a report, investigate a safety or abuse issue, or
            meet a legal obligation.
          </p>
        </Sub>
        <Sub title="4.6 Authorities and others">
          <p>
            We disclose data when the law requires it (for example a valid court order or a lawful
            direction under Indian law), or when we believe in good faith it is necessary to protect
            someone&rsquo;s life or safety, to prevent fraud or abuse, or to defend our legal rights. If
            Loxymity is reorganised, merged or sold, data may pass to the successor under this policy.
          </p>
        </Sub>
      </Section>

      <Section title="5. Calls and recordings">
        <p>
          In-app calls are carried by Agora, and you can call only people you share a circle with.{' '}
          <strong>Voice calls are recorded automatically</strong>, from when the call starts ringing until
          it ends, so an unanswered call is recorded on the caller&rsquo;s side. A &ldquo;Recording&rdquo;
          notice shows on the call screen. Calls in which either person is under 18 are never recorded,
          and video calls are not recorded at present. Recordings are stored encrypted by Cloudflare R2, kept for 28 days and then
          deleted automatically. They are not available in the app; we access one only to investigate a
          safety, abuse or legal matter reported to us, or when the law requires it. Call records (who,
          when, how long) are kept with your account. Recording laws vary, and our{' '}
          <a href="/terms/#calls">Terms</a> make you responsible for telling the people you call.
        </p>
      </Section>

      <Section title="6. Service providers">
        <p>
          We use the providers below to run Loxymity. Each receives only what its job needs and may use it
          only to provide its service. We do not use advertising or analytics SDKs, and we do not collect
          your phone&rsquo;s advertising identifier.
        </p>
        <Table
          head={['Provider', 'What it does', 'What it receives']}
          rows={[
            ['Supabase (Mumbai, India)', 'Database, sign-in, file storage, server functions, sign-in emails', 'All account and service data'],
            ['Cloudflare', 'R2 storage; hosting of loxymity.com', 'Call recordings and encrypted Vault backups; website visitors’ IP addresses'],
            ['Agora', 'Voice and video calls, call recording', 'Call audio and video, call participants'],
            ['Expo, Google Firebase Cloud Messaging, Apple Push Notification service', 'Delivering notifications', 'Push tokens and notification text — which can include names, place names, battery level and SOS messages'],
            ['Google Firebase Crashlytics', 'Crash reporting', 'Device and app details, an installation identifier, recent diagnostic messages and, once signed in, your account ID'],
            ['Google Maps Platform', 'Maps on Android, Street View, directions, address and place search, place names', 'Map viewport; through our server, a trip’s start and end points, addresses or places you search for, and the coordinates for Street View'],
            ['Apple (MapKit and iOS) and Google Play services', 'Maps on iPhone; turning coordinates into place names on your phone', 'Map viewport; the coordinates being named'],
            ['BigDataCloud', 'Place names for assistant answers (fallback)', 'Coordinates'],
            ['OpenWeather, WeatherAPI', 'Weather on the map', 'A location'],
            ['Groq', 'Understanding questions asked to the assistant', 'Only the text of the question'],
            ['Meta (WhatsApp Business Platform)', 'WhatsApp verification and questions, if you link WhatsApp', 'Your phone number, your messages and our replies'],
            ['Amazon (Alexa)', 'Alexa answers, if you enable the skill', 'Your requests and our spoken and card replies'],
            ['adsb.lol, adsbdb, FlightAware', 'Flight tracking', 'Flight numbers; FlightAware pages you open receive your IP address'],
            ['RevenueCat, Apple App Store, Google Play', 'Purchases and subscription status', 'Your account ID and purchase records — never your location'],
            ['Government alert feeds (NDMA SACHET, US National Weather Service)', 'Official hazard alerts', 'Nothing about you; we match alerts to your circle on our own servers'],
          ]}
        />
      </Section>

      <Section title="7. International transfers">
        <p>
          Our database is in Mumbai, India. Some providers above process data in other countries,
          including the United States, the European Union and on global networks (Agora, Cloudflare).
          Transfers out of India are permitted under section 16 of the DPDP Act except to countries the
          Government of India restricts. For people in the EEA, UK and Switzerland, we rely on the
          safeguards our providers offer, such as the European Commission&rsquo;s Standard Contractual
          Clauses and the UK addendum included in their data processing terms, where those apply.
        </p>
      </Section>

      <Section title="8. How long we keep it">
        <Table
          head={['Data', 'How long']}
          rows={[
            ['Your latest location', 'One record, replaced with each update. Stays visible to your circle while you are a member, even when paused.'],
            ['Location history and drives on our servers', 'Up to 7 days on Free (you can open the last 2), 30 days with Gold, 90 with Platinum and 180 with Infinite — the longest window you benefit from, including through a covered circle. Moving to a shorter window does not delete points early. Older points are removed as your phone sends new ones; if a phone stops sending altogether, its stored points remain until the account is deleted. Infinite members can also auto-delete after 1, 3 or 7 days.'],
            ['History on your phone', 'As long as you choose (Data & Storage).'],
            ['Circle messages', '90 days.'],
            ['Direct messages', 'Until the account of either person is deleted.'],
            ['Assistant conversations in the app', '30 days.'],
            ['WhatsApp messages', 'Content 30 days; the record that a message was handled, 90 days.'],
            ['Alexa requests and saved WhatsApp questions', 'Until you ask us to delete them.'],
            ['Call recordings', '28 days. Calls involving anyone under 18 are not recorded.'],
            ['A child’s history on any phone that keeps a copy (including a parent’s) and in backups', 'At most 7 days.'],
            ['Reports and the copy of a reported message', 'As long as needed to deal with the report and any related safety or legal matter.'],
            ['Call records, SOS alerts and responses, safety and place events, the viewing record, schedules you keep', 'While your account exists. Schedule checks: 30 days. Flights: 30 days.'],
            ['Offline-relay sightings', '7 days (undelivered relay packets: 1 day).'],
            ['Notification records', '30 days.'],
            ['Diagnostic log', 'Replaced by each new upload; deleted with your account.'],
            ['Crash reports (Crashlytics)', 'Up to 90 days.'],
            ['Usage statistics; anonymous sign-up diagnostics', '90 days. The diagnostics are anonymous, so we cannot find one person’s on request.'],
            ['Vault backup', 'Until you replace it or ask us to delete it.'],
            ['Consent and age records', 'While your account exists, and afterwards for as long as we need to show that consent was given.'],
            ['Purchase and billing records', 'As long as tax and accounting law requires.'],
            ['Contacts', 'Never collected.'],
          ]}
        />
        <Sub title="When you delete your account">
          <p>
            Delete it in the app (You → Delete account). You are signed out and your account is blocked
            at once, and deletion normally completes within a day: your profile, photo, location data,
            drives, places, messages, diagnostic logs and the Apple sign-in link are removed. Circles you
            own pass to another adult member, or are deleted if no other adult is left; direct-message threads are
            removed for both people. Call recordings expire within 28 days. We keep only what the law
            requires us to keep, and copies in our providers&rsquo; backups are overwritten in their normal
            cycle. If you used Vault, Alexa or WhatsApp, email{' '}
            <a href="mailto:privacy@loxymity.com">privacy@loxymity.com</a> and we will delete those copies
            too, as they are not yet removed automatically. Deleting your account does not cancel a store
            subscription — cancel it in the App Store or Google Play.
          </p>
        </Sub>
      </Section>

      <Section title="9. How we protect it">
        <List>
          <li>All traffic between the app, the website and our servers is encrypted (TLS).</li>
          <li>
            Our database enforces row-level access rules, so each person can read only their own data and
            what their circles share with them. Server functions that need wider access are limited to
            specific jobs.
          </li>
          <li>
            From app version 0.8.899, what the app stores on your phone — history, stops, drives, places,
            messages and settings — is encrypted (AES-256) with a key that stays on that phone, sign-in
            tokens are kept in the phone&rsquo;s secure keychain or keystore, and Android cloud backups of
            the app are switched off. You can also turn on App Lock (Face ID, fingerprint or phone PIN).
          </li>
          <li>
            <strong>Vault backups</strong> are encrypted on your phone with a key made from your backup
            password, which never leaves your phone; we hold only the encrypted file and cannot read it. If
            you lose the password, we cannot recover the backup.
          </li>
          <li>
            Locations, messages, call audio, recordings and relay packets are not end-to-end encrypted: they
            are protected in transit and on our servers, but our systems can process them, which is how
            features such as alerts, history and SOS work.
          </li>
        </List>
        <p>
          No system is perfectly secure. If a personal-data breach affects you, we will tell you and the
          authorities as the law requires, including the Data Protection Board of India under the DPDP
          Rules.
        </p>
      </Section>

      <Section title="10. Children">
        <p>
          Under the DPDP Act anyone under 18 is a child. We ask everyone&rsquo;s month and year of birth
          at sign-up and keep only whether they are an adult. <strong>Children under 13 cannot use
          Loxymity.</strong> A child aged 13 to 17 can use it only after a parent or lawful guardian — an
          adult with a verified phone number on their own account — invites them with a child invite and
          confirms they are the child&rsquo;s parent or guardian; we record that confirmation as the
          parent&rsquo;s consent. Without it, a child who is not in any circle is not tracked and their
          account is deleted after 7 days. A child who is already in a circle can keep sharing with it for
          up to 14 days while consent is completed.
        </p>
        <p>A child&rsquo;s account is limited, and our servers and the app enforce the limits:</p>
        <List>
          <li>a child cannot create circles, invite anyone, be made a circle owner, or create a share link — and no share link ever shows a child&rsquo;s location;</li>
          <li>calls involving a child are not recorded, and the Wi-Fi network name is never stored for a child;</li>
          <li>a child&rsquo;s location history is kept for at most 7 days on any phone that keeps a copy, including a parent&rsquo;s, and in backups;</li>
          <li>a circle is never handed to a child when the last adult leaves or deletes their account — it is deleted instead;</li>
          <li>children see no plans, offers or referral rewards, get no billing notifications, and no usage statistics are collected from them;</li>
          <li>a child cannot block the parent or guardian who consented for them, but can report anything to us.</li>
        </List>
        <p>
          Parents in countries with other rules for children&rsquo;s data (for example the EU, UK or US)
          must give any consent those rules require before inviting a child. If you believe a child is
          using Loxymity without a parent&rsquo;s consent, write to{' '}
          <a href="mailto:privacy@loxymity.com">privacy@loxymity.com</a> and we will act promptly.
        </p>
      </Section>

      <Section title="11. Your choices and rights">
        <Sub title="In the app, at any time">
          <List>
            <li>Pause sharing (Settings → Share my location), leave a circle, or delete your account.</li>
            <li>
              Block someone: it stops direct messages and calls between you in both directions and hides
              their circle chat on your phone. It does not change who can see your location — for that,
              leave the circle or ask its owner. Report any message to us from the app.
            </li>
            <li>
              Turn off Drive Tracking, Share Drives With Circle, Crash detection, Fall detection, Findable
              when offline, read receipts, Smart Routine Alerts and individual notification types.
            </li>
            <li>Change or withdraw phone permissions (location, motion, contacts, calendar, Bluetooth, notifications) in your phone&rsquo;s settings.</li>
            <li>Edit your name, photo and phone number; shorten or delete the history kept on your phone.</li>
            <li>Infinite: export a copy of your data instantly, and use ghost mode and auto-delete.</li>
          </List>
        </Sub>
        <Sub title="By email — free for everyone">
          <p>
            Email <a href="mailto:privacy@loxymity.com">privacy@loxymity.com</a> from the address on your
            account to get a copy of your data, a summary of how it is processed and who it is shared with,
            to correct or erase it, to withdraw consent, or to object. We may ask you to confirm your
            identity. We reply within 30 days, and resolve grievances within the time the law allows.
            Withdrawing consent does not affect what was done before, and some features cannot work without
            the data they need.
          </p>
        </Sub>
        <Sub title="India (DPDP Act)">
          <p>
            You have the right to a summary of your personal data and its processing (s.11), to
            correction, completion, updating and erasure (s.12), to grievance redressal (s.13), and to
            nominate someone to exercise your rights if you die or become incapable (s.14) — email us to
            register a nominee. If you are not satisfied with our response, you may complain to the{' '}
            <a href="https://www.dpb.gov.in" target="_blank" rel="noopener noreferrer">Data Protection Board of India</a>.
          </p>
        </Sub>
        <Sub title="EEA, UK and Switzerland (GDPR)">
          <p>
            You have the rights of access, rectification, erasure, restriction, data portability and
            objection, and to withdraw consent at any time. You may complain to your local data-protection
            authority.
          </p>
        </Sub>
        <Sub title="United States (including California)">
          <p>
            We collect the categories described in section 2: identifiers, contact details, precise
            geolocation, device and network information, audio (call recordings), communications, and
            purchase records. We do not sell or share personal information for cross-context behavioural
            advertising, and we use precise geolocation and other sensitive personal information only to
            provide the Service. You may ask to know, correct or delete your personal information, and we
            will not discriminate against you for doing so. An authorised agent may make a request for you
            with your signed permission.
          </p>
        </Sub>
      </Section>

      <Section title="12. Changes to this policy">
        <p>
          The version and effective date are at the top of this page. When we make a material change we
          will tell you in the app or by email and ask you to review and accept it in the app.
        </p>
      </Section>

      <Section id="contact" title="13. Contact and Grievance Officer">
        <List>
          <li><strong>AMSEK RESEARCH LABS LLP</strong>, West Bengal, India.</li>
          <li>Privacy questions and requests: <a href="mailto:privacy@loxymity.com">privacy@loxymity.com</a></li>
          <li>
            Grievance Officer (DPDP Act and the Information Technology Act, 2000): write to{' '}
            <a href="mailto:privacy@loxymity.com">privacy@loxymity.com</a> with &ldquo;Grievance&rdquo; in the
            subject. We acknowledge grievances within 24 hours and aim to resolve them within 15 days.
          </li>
          <li>Everything else: <a href="mailto:support@loxymity.com">support@loxymity.com</a></li>
        </List>
      </Section>
    </LegalPage>
  );
}
