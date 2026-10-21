import type { Metadata } from 'next';
import { LegalPage, Section, Sub, List, Callout, LEGAL_VERSION, LEGAL_EFFECTIVE } from '../_components/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service — Loxymity',
  description:
    'The terms that govern your use of Loxymity: who may use it, your responsibilities for the people you share with, the limits of the safety features, plans and billing, and liability.',
};

export default function TermsOfService() {
  return (
    <LegalPage
      title="Terms of Service"
      version={LEGAL_VERSION}
      effective={LEGAL_EFFECTIVE}
      intro={
        <>
          <p>
            These Terms are a contract between you and AMSEK RESEARCH LABS LLP, a limited liability
            partnership registered in India, which operates Loxymity. They cover the Loxymity apps for
            iPhone and Android, the website at loxymity.com, the web dashboard, and the Loxymity
            integrations with WhatsApp and Alexa (together, the &ldquo;Service&rdquo;).
          </p>
          <p>
            <strong className="text-dark-text">Please read sections 4, 6, 7, 15 and 16 carefully.</strong>{' '}
            They explain that you are responsible for the consent of the people you share with, that
            Loxymity is not an emergency service, that in-app voice calls are recorded, and how our
            liability is limited and when you must indemnify us.
          </p>
        </>
      }
    >
      <Section title="1. Accepting these Terms">
        <p>
          You accept these Terms when you create an account, when you tap to accept them in the app,
          or when you use the Service. If you do not agree, do not use the Service. Our{' '}
          <a href="/privacy/">Privacy Policy</a> explains how we handle personal data and forms part
          of these Terms. Plan details shown in the app at the time you buy also form part of them.
        </p>
        <p>
          If you accept these Terms on behalf of a child in your care, you accept them for the child
          and for yourself, and you are responsible for the child&rsquo;s use of the Service.
        </p>
      </Section>

      <Section title="2. Who can use Loxymity">
        <List>
          <li>
            You must be at least <strong>18 years old</strong> to create an account yourself, and able
            to form a binding contract where you live.
          </li>
          <li>
            Children under 13 may not use Loxymity. A child aged 13 to 17 may use it only after their
            parent or lawful guardian invites them with a child invite from the parent&rsquo;s own
            verified Loxymity account and confirms that they are the child&rsquo;s parent or guardian. The
            parent or guardian is responsible for the child&rsquo;s account and use.
          </li>
          <li>
            A child&rsquo;s account is limited: it cannot create circles, invite anyone, become a circle
            owner, create share links or buy plans, and a child cannot block the parent or guardian who
            consented for them.
          </li>
          <li>
            You must give accurate information, keep it up to date, and use only one account for
            yourself. You must not create an account for someone else, except a child in your care
            through the invite described above.
          </li>
          <li>
            You are responsible for keeping your sign-in details and your phone secure, and for all
            activity on your account. Tell us at once at{' '}
            <a href="mailto:support@loxymity.com">support@loxymity.com</a> if you think someone else
            has used it.
          </li>
          <li>
            You may not use the Service if you are barred from doing so under the laws of India or of
            the country you are in, or if you are in a country, or on a list, subject to Indian,
            United Nations or United States sanctions.
          </li>
        </List>
      </Section>

      <Section title="3. What Loxymity is — and what it is not">
        <p>
          Loxymity lets people who choose to share with each other see one another&rsquo;s location in
          private groups called circles. Features include a live map, location history, places with
          arrival and leave alerts, SOS alerts, crash detection, driving reports, messaging, voice and
          video calls, trips and live ETAs, flight tracking, official hazard alerts, share links, an
          offline Bluetooth relay, an assistant reachable in the app, WhatsApp and Alexa, and
          encrypted backups. What each plan includes is shown in the app and on our{' '}
          <a href="/#pricing">pricing page</a>.
        </p>
        <Callout>
          <p>
            <strong>Loxymity is not</strong> an emergency service, a medical device, a vehicle safety
            system, a navigation system, or a guarantee of anyone&rsquo;s safety. It is not a
            monitoring product for employers, schools, landlords or other organisations. It does not
            replace the supervision of children or vulnerable people.
          </p>
        </Callout>
      </Section>

      <Section id="your-responsibilities" title="4. Your responsibilities for the people you share with">
        <p>
          Loxymity is built for people who know they are sharing and want to. Whenever you invite,
          add, view, keep or share information about another person through the Service, you take on
          the responsibilities below.
        </p>
        <Sub title="4.1 Consent">
          <p>
            You may invite or keep in your circles only people who understand what they will share
            (including their live location, history, battery, driving and the other details listed in
            the Privacy Policy) and who agree to it freely. Every adult decides for themselves. You must
            not install, set up or keep Loxymity running on another adult&rsquo;s phone without their
            knowledge, use their device or account to share their location, or prevent anyone from
            leaving a circle or stopping sharing.
          </p>
        </Sub>
        <Sub title="4.2 Children in your care">
          <p>
            If you invite a child, you confirm that you are the child&rsquo;s parent or lawful guardian
            and that you give the consent the law requires for the child&rsquo;s data, including
            verifiable parental consent under India&rsquo;s Digital Personal Data Protection Act, 2023
            (the &ldquo;DPDP Act&rdquo;) and the DPDP Rules, 2025, and any equivalent rule where you live
            (for example Article 8 of the EU and UK GDPR, or the US Children&rsquo;s Online Privacy
            Protection Act). You will explain Loxymity to the child in a way suited to their age and
            use it only in the child&rsquo;s best interests.
          </p>
        </Sub>
        <Sub title="4.3 Personal and household use only — business use is your responsibility">
          <p>
            Loxymity is designed for personal, family and household use. Data-protection laws often
            treat that kind of use differently: the DPDP Act does not apply to personal data processed
            by an individual for a personal or domestic purpose, and the GDPR does not apply to a purely
            personal or household activity.
          </p>
          <p>
            If you use the Service for any other purpose — for example to locate or monitor employees,
            drivers, contractors, students, patients, tenants, customers or members of an organisation
            — you do so entirely at your own risk and responsibility. For that use <strong>you</strong>{' '}
            are the data fiduciary or controller. You must comply with every law that applies to you,
            including the DPDP Act, the GDPR and UK GDPR, the California Consumer Privacy Act and other
            US state privacy laws, and employment, workplace-surveillance and sector rules; you must have
            a lawful basis, give the notices, obtain the consents, respect the rights and carry out any
            assessments those laws require. We do not offer a data processing agreement or any
            business terms unless we have signed one with you in writing.
          </p>
        </Sub>
        <Sub title="4.4 Data you take outside Loxymity">
          <p>
            If you copy, screenshot, export, forward or otherwise take information about another person
            out of the Service — including through a share link, the web dashboard, WhatsApp or Alexa —
            you become responsible for that copy and for complying with the law in how you use, store,
            disclose and delete it.
          </p>
        </Sub>
        <Sub title="4.5 Share links">
          <p>
            A share link shows your live location, name and photo to <strong>anyone who has the
            link</strong>, without an account, until it expires (at most 24 hours) or you revoke it. You
            decide who receives it and are responsible for it being forwarded. Children cannot create
            share links, and a share link never shows a child&rsquo;s location.
          </p>
        </Sub>
        <Sub title="4.6 WhatsApp, Alexa and other linked accounts">
          <p>
            If you link WhatsApp or Alexa, anyone who can use that WhatsApp account or Alexa device may
            ask about the people in your circles and hear or read the answers, which include their name,
            location, place and battery. Keep those accounts and devices secure, and do not link a
            shared device in a place where others could ask. Answers are carried by Meta and Amazon under
            their own terms.
          </p>
        </Sub>
        <Sub title="4.7 Call recording laws">
          <p>
            In-app voice calls are recorded (see section 7). Laws on recording calls differ between
            countries and states, and some require every party to agree. You are responsible for
            complying with the law where you and the person you call are, for telling the people you
            call that in-app calls are recorded, and for using an ordinary phone call instead whenever
            a recorded call would not be lawful or appropriate.
          </p>
        </Sub>
        <Sub title="4.8 Your duties under the DPDP Act">
          <p>
            When you deal with us about personal data you must, as section 15 of the DPDP Act requires,
            comply with the law, not impersonate anyone, not suppress material information, not file a
            false or frivolous grievance or complaint, and give only verifiably authentic information
            when you ask us to correct or erase data.
          </p>
        </Sub>
      </Section>

      <Section title="5. Acceptable use">
        <p>You must not use the Service, or help anyone else use it, to:</p>
        <List>
          <li>
            stalk, harass, threaten, intimidate, control or abuse anyone, or track anyone without their
            knowledge and agreement — conduct that can be a crime, including under section 78 of the
            Bharatiya Nyaya Sanhita, 2023, sections 66E and 72 of the Information Technology Act, 2000,
            and the stalking, harassment and electronic-tracking laws of other countries;
          </li>
          <li>keep tracking anyone after they have left a circle or asked you to stop;</li>
          <li>attach a Bluetooth tag or tracking device to a person, or to property that is not yours, without permission;</li>
          <li>send a false SOS, hoax or misleading safety alert, or interfere with emergency services;</li>
          <li>send spam, unlawful, defamatory, obscene or infringing content, or content that harms children;</li>
          <li>
            get around plan limits, allowances, free trials or referral rules (for example with
            multiple accounts), or resell or sublicense the Service;
          </li>
          <li>
            probe, scan, copy, scrape or overload the Service, bypass its security, or decompile or
            reverse-engineer it except where the law allows this despite these Terms;
          </li>
          <li>upload malware, or impersonate anyone or misrepresent your relationship with them;</li>
          <li>use the Service while driving in a way that breaks road-safety law or distracts you.</li>
        </List>
        <p>
          We may remove content, limit features, suspend or close accounts, and report conduct to the
          authorities when we reasonably believe these rules have been broken or someone is at risk.
          We may keep and disclose information where the law requires or allows it.
        </p>
        <Sub title="Blocking and reporting">
          <p>
            You can block anyone. A block stops direct messages and calls between the two of you in both
            directions and hides their circle chat on your phone; it does not change who can see your
            location — leave the circle, or ask its owner, for that. You can report any message or person
            to us from the app. When you report a message we keep a copy of it, even if the sender later
            deletes it, and we review reports and act on them under these Terms. Do not make false or
            malicious reports. If someone is in immediate danger, contact the police or emergency services
            first.
          </p>
        </Sub>
      </Section>

      <Section id="safety" title="6. Safety features have limits">
        <Callout>
          <p>
            <strong>Loxymity is not an emergency service.</strong> In an emergency, call your local
            emergency number (for example 112 in India and the EU, 911 in the US and Canada, 999 in the
            UK) directly. The &ldquo;Dial&rdquo; button in the app only opens your phone&rsquo;s dialler.
            We do not monitor alerts, we do not contact emergency services, and we do not contact
            anyone outside your circle.
          </p>
        </Callout>
        <Sub title="6.1 SOS">
          <p>
            An SOS reaches your circle only if their phones are on, connected and allowed to show
            notifications. It can be delayed or silenced by the phone&rsquo;s settings and the operating
            system — on iPhone, the ring/silent switch silences it. To prevent misuse, only the first
            five loud SOS alerts a sender raises in an hour are loud; later ones are delivered normally.
            If no one responds within three minutes we alert the circle once more. We cannot guarantee
            that anyone sees an alert or acts on it.
          </p>
        </Sub>
        <Sub title="6.2 Crash and fall detection">
          <p>
            Crash detection is on by default and fall detection is off by default; you can change both in
            Settings. They rely on your phone&rsquo;s motion sensors and can miss real events (for example
            when the app is not running, the phone is mounted, off or in a bag) and can trigger on drops
            or bumps. When a possible crash is detected you have 30 seconds to tap &ldquo;I&rsquo;m OK&rdquo;;
            if you do not, an SOS is sent to your circle. They are not medical devices and are not
            certified for any safety purpose.
          </p>
        </Sub>
        <Sub title="6.3 Location, places, ETAs and arrival checks">
          <p>
            Locations come from GPS, Wi-Fi, mobile networks and Bluetooth and can be wrong by hundreds of
            metres, out of date or missing — for example when a phone is off, in battery saver, has no
            signal, or the operating system or phone maker restricts background apps. A
            &ldquo;left&rdquo; alert waits for two readings outside a place, so it can arrive later than
            the person left. Place alerts, live ETAs, schedule verdicts (on time, late, missed), traffic
            and stop labels, place names and road-smoothness figures are estimates.
          </p>
        </Sub>
        <Sub title="6.4 Driving">
          <p>
            Never use the app in a way that distracts you while driving. Drive detection, scores,
            grades, speeds and speeding alerts are estimates for your own information. They must not be
            used for insurance, employment, disciplinary or legal decisions about anyone.
          </p>
        </Sub>
        <Sub title="6.5 Official alerts, weather and flights">
          <p>
            Hazard alerts come from government feeds (currently India&rsquo;s NDMA SACHET service and the
            US National Weather Service) and weather and flight information from third parties. We pass
            them on as received, they may be late, incomplete or not apply to you, and they never replace
            the instructions of the authorities.
          </p>
        </Sub>
        <Sub title="6.6 Offline relay, assistant and other automated features">
          <p>
            The offline relay depends on other Loxymity phones being nearby and works on a best-effort
            basis. Answers from the assistant (in the app, in WhatsApp or from Alexa) are produced
            automatically and can be wrong or out of date. Check anything important before you rely on
            it.
          </p>
        </Sub>
      </Section>

      <Section id="calls" title="7. Calls and recording">
        <List>
          <li>
            You can call people you share a circle with.{' '}
            <strong>In-app voice calls are recorded automatically</strong>, from the moment a call starts
            ringing until it ends — so a call that is not answered is recorded on the caller&rsquo;s side.
            A &ldquo;Recording&rdquo; notice is shown on the call screen. There is no per-call choice: by
            placing or answering an in-app voice call you agree to it being recorded, and you confirm you
            can agree for yourself. Calls in which either person is under 18 are never recorded, and video
            calls are not recorded at present.
          </li>
          <li>
            Recordings are stored encrypted by our storage provider, kept for 28 days and then deleted
            automatically. They are not available to you in the app. We access a recording only to
            investigate a safety, abuse or legal matter reported to us, or when the law requires it.
          </li>
          <li>
            Calls depend on both phones having a working connection and may drop. During the hour
            after an SOS, calls between that circle&rsquo;s members are free whatever their plan.
          </li>
          <li>
            Messages are delivered to the circle or person you send them to. They are not end-to-end
            encrypted. You are responsible for what you send.
          </li>
        </List>
      </Section>

      <Section id="plans" title="8. Plans, trials and billing">
        <Sub title="8.1 Free and paid plans">
          <p>
            Loxymity has a free plan and three paid plans: Gold, Platinum and Infinite. Everyone may own
            two free circles. A paid plan covers one, two or three circles of your choice at its tier,
            billed monthly or annually; everyone in a covered circle gets the plan&rsquo;s circle
            features on their own account. You are never charged per person. Prices, taxes and what each
            plan includes are shown in the app before you buy.
          </p>
        </Sub>
        <Sub title="8.2 Who can buy, and the rules for covered circles">
          <List>
            <li>Any adult who is an active member of a circle can put it on a plan. A circle has one payer at a time.</li>
            <li>
              Once a circle is on your plan it stays covered for the life of the plan. It cannot be
              removed, swapped or moved to another plan.
            </li>
            <li>
              If you change to fewer circles, the change takes effect at your next renewal and you choose
              once which circles stay; if you do not choose, the circles covered longest stay.
            </li>
            <li>
              If the payer leaves or is removed from a covered circle, the circle stays covered until the
              end of the period already paid for and is not renewed after that.
            </li>
            <li>
              If an owner deletes a covered circle, the payer is told, and the slot becomes available
              again at the payer&rsquo;s next renewal.
            </li>
            <li>Temporary (event) circles end automatically and cannot be put on a plan.</li>
          </List>
        </Sub>
        <Sub title="8.3 Changing plans">
          <p>
            Adding circles or moving to a higher tier takes effect immediately: you pay the full new
            price that day, and the unused part of your current plan is returned by the store (Apple
            refunds it; Google Play adds it as extra time). Fewer circles, a lower tier or a different
            billing period take effect at your next renewal.
          </p>
        </Sub>
        <Sub title="8.4 Free trial">
          <p>
            A 7-day free trial of Platinum (annual, one circle) is offered once per App Store or Google
            Play account. Unless you cancel at least 24 hours before the trial ends, it converts to a
            paid annual subscription at the price shown when you started. Adding a circle during the
            trial ends the trial and starts paid billing that day; the app warns you before you do.
          </p>
          <p>
            Any free trial or promotional period we grant ourselves, rather than through the store, is
            once per person: a new account with the same email address or verified phone number as an
            account deleted in the last 12 months does not get another.
          </p>
        </Sub>
        <Sub title="8.5 Billing, renewal, cancellation and refunds">
          <List>
            <li>
              Plans are bought in the app and billed by Apple (App Store) or Google (Google Play), whose
              terms also apply. We do not currently sell plans on our website.
            </li>
            <li>
              Subscriptions renew automatically at the end of each period unless you cancel at least 24
              hours before it ends, in your App Store or Google Play account settings. After cancelling
              you keep the plan until the end of the period you paid for.
            </li>
            <li>
              <strong>Deleting the app or your Loxymity account does not cancel a subscription.</strong>{' '}
              Cancel it in the store first.
            </li>
            <li>
              Refunds for store purchases are decided by Apple or Google under their policies; we cannot
              issue them. This does not affect any refund or other right you have under consumer law.
            </li>
            <li>
              We may change prices. You will be told in advance as the stores require, and where the law
              or the store requires your agreement to a higher price, the new price applies only once you
              agree.
            </li>
          </List>
        </Sub>
        <Sub title="8.6 Allowances and limits">
          <p>
            Some features have monthly allowances (for example video minutes, Street View, assistant
            questions and flights). Allowances reset each month, do not carry over, and never lead to an
            extra charge — the feature pauses until the next month. When coverage ends, a circle returns
            to the free limits. If it is then over a free limit, we may give you 7 days to bring it within
            the limit and then pause the location sharing of its newest members, or of your newest circles
            beyond the two free ones. Nothing is deleted, and buying a plan again restores it.
          </p>
        </Sub>
        <Sub title="8.7 Referral rewards and promotions">
          <p>
            Referral rewards (such as a free week of Platinum) and other promotions have no cash value,
            cannot be transferred, may be changed or ended at any time, and may be withdrawn if they are
            obtained in breach of these Terms. A referral reward is for a new person: a new account with
            the same email address or verified phone number as an account deleted in the last 12 months
            cannot be referred again.
          </p>
        </Sub>
        <Sub title="8.8 Web dashboard">
          <p>The web dashboard at loxymity.com is available to people who pay for a plan themselves.</p>
        </Sub>
      </Section>

      <Section title="9. Third-party services">
        <p>
          The Service relies on third parties, including Apple, Google, Meta (WhatsApp), Amazon (Alexa),
          Agora (calls) and our hosting providers, listed in the Privacy Policy. Their services are
          governed by their own terms, and we are not responsible for them.
        </p>
        <p>
          Parts of Loxymity use Google Maps features and content. Use of Google Maps features and
          content is subject to the then-current versions of the{' '}
          <a href="https://maps.google.com/help/terms_maps/" target="_blank" rel="noopener noreferrer">
            Google Maps/Google Earth Additional Terms of Service
          </a>{' '}
          and the{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.
          On iPhone, maps are provided by Apple Maps.
        </p>
      </Section>

      <Section title="10. Your content">
        <p>
          You keep ownership of what you put into the Service — messages, names, nicknames, place and
          stop names, photos and plans. You give us a worldwide, non-exclusive, royalty-free licence to
          host, store, copy, process, transmit and display it only as needed to run, secure and improve
          the Service for you and the people you share with, and as the Privacy Policy describes. You
          confirm you have the rights to everything you share, and that it is lawful. If you send us
          feedback, we may use it without any obligation to you.
        </p>
      </Section>

      <Section title="11. Our intellectual property and your licence">
        <p>
          The Service, the Loxymity name and logo, and our software and designs belong to AMSEK RESEARCH
          LABS LLP or its licensors. We give you a personal, non-exclusive, non-transferable, revocable
          licence to use the apps on devices you own or control, for your own personal use, in line
          with these Terms and the rules of the store you got them from. All other rights are reserved.
        </p>
      </Section>

      <Section title="12. Changes to the Service">
        <p>
          We continually improve Loxymity. We may add, change, limit or withdraw features (including
          switching a feature off quickly for safety or reliability), and may require you to install an
          update to keep using the Service. Changes to your phone&rsquo;s operating system or settings
          can stop background features from working. We will tell you about changes that materially
          reduce a plan you have paid for, and you may cancel as described in section 8.
        </p>
      </Section>

      <Section title="13. Suspension, termination and account deletion">
        <List>
          <li>
            You can stop using the Service at any time and delete your account in the app (You → Delete
            account) or at <a href="/delete-account/">loxymity.com/delete-account</a>. You are signed out
            at once. An adult&rsquo;s account is deleted 7 days later — sign in before then and tap Restore
            to keep it, or choose to delete it immediately; an account of anyone under 18 is deleted
            straight away. The account is then deleted as the Privacy Policy describes, which also lists
            the few records we must keep afterwards. Circles you own pass to another adult member, or are
            deleted if no other adult remains; direct-message threads you are part of are deleted for both
            people.
          </li>
          <li>
            We may suspend or close your account, with or without notice, if you break these Terms,
            create risk or legal exposure for us or others, or if the law requires it. Where it is
            reasonable we will tell you why.
          </li>
          <li>
            Sections 4, 6, 7, 10, 14, 15, 16, 17 and 19, and anything else that by its nature should
            survive, continue after these Terms end.
          </li>
        </List>
      </Section>

      <Section title="14. Disclaimer">
        <p>
          To the fullest extent the law allows, the Service is provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo;, without warranties of any kind, express or implied, including any warranty of
          merchantability, fitness for a particular purpose, accuracy, availability or non-infringement.
          We do not promise that the Service will be uninterrupted, timely, secure or error-free, that
          any alert, message or call will be delivered, or that any location or estimate is correct.
        </p>
      </Section>

      <Section id="liability" title="15. Limitation of liability">
        <Callout>
          <p>To the fullest extent the law allows:</p>
          <List>
            <li>
              We are not liable for any indirect, incidental, special, consequential, exemplary or
              punitive loss, or for loss of profits, revenue, data, goodwill or opportunity.
            </li>
            <li>
              We are not liable for loss or harm that arises from: an alert, SOS, crash or fall
              detection, message or call that is delayed, not delivered or not acted on; inaccurate,
              late or missing locations or estimates; the acts or omissions of circle members, people
              with a share link, or other users; your failure to obtain a consent or comply with the law;
              third-party services, networks or devices; or events beyond our reasonable control.
            </li>
            <li>
              Our total liability for all claims relating to the Service or these Terms is limited to the
              greater of (a) the amount you paid for the Service in the 12 months before the claim arose
              and (b) ₹4,000 (or US$50).
            </li>
          </List>
          <p>
            Nothing in these Terms limits liability for death or personal injury caused by our
            negligence, for fraud, or for anything else that cannot be limited by law, or takes away
            rights you have as a consumer that cannot be waived.
          </p>
        </Callout>
      </Section>

      <Section id="indemnity" title="16. Indemnity">
        <p>
          To the fullest extent the law allows, you will defend, indemnify and hold harmless AMSEK
          RESEARCH LABS LLP, its partners, employees, contractors and agents from and against all claims,
          demands, proceedings, investigations, penalties, fines, losses, liabilities, damages, costs and
          expenses (including reasonable legal fees) arising out of or relating to:
        </p>
        <List>
          <li>your use or misuse of the Service, or use through your account;</li>
          <li>your content;</li>
          <li>your breach of these Terms;</li>
          <li>
            your breach of any law or regulation, including data-protection, privacy, surveillance,
            call-recording, employment, consumer and child-protection laws such as the DPDP Act, the GDPR,
            the UK GDPR and the California Consumer Privacy Act;
          </li>
          <li>
            your failure to obtain, record or maintain any consent, notice or authorisation required for
            anyone whose personal data you collect, view, share, export or record through the Service —
            including members of your circles and any child for whom you act;
          </li>
          <li>
            any claim by a circle member, a child or their guardian, an employee or contractor, or any
            other person concerning personal data processed through your account, your circles, your
            share links or your linked accounts;
          </li>
          <li>any information you take out of the Service (section 4.4); and</li>
          <li>any false SOS or other misuse of the safety features.</li>
        </List>
        <p>
          This indemnity does not apply to the extent a claim is caused by our own breach of these Terms
          or by our negligence or wilful misconduct. We will tell you about a claim promptly, may take
          control of its defence, and you will co-operate with us and not settle it without our written
          consent.
        </p>
      </Section>

      <Section title="17. Governing law and disputes">
        <p>
          These Terms are governed by the laws of India. Before starting any proceedings, please contact
          our Grievance Officer (section 20) so we can try to resolve the matter; give us at least 30 days.
          The courts at Kolkata, West Bengal have exclusive jurisdiction, except that if you are a
          consumer you may also bring a claim where the law of your country of residence allows, and
          nothing here removes the protection of mandatory consumer law, including the Consumer
          Protection Act, 2019.
        </p>
      </Section>

      <Section title="18. Changes to these Terms">
        <p>
          We may update these Terms. The version and effective date are shown at the top of this page.
          When a change is material we will tell you in the app or by email and ask you to accept the new
          version in the app before you continue. If you do not agree, stop using the Service and delete
          your account.
        </p>
      </Section>

      <Section title="19. General">
        <List>
          <li>These Terms and the documents they refer to are the whole agreement between you and us about the Service.</li>
          <li>If any part is found unenforceable, the rest stays in effect and that part is applied as closely as the law allows.</li>
          <li>Not enforcing a right straight away is not a waiver of it.</li>
          <li>You may not transfer these Terms. We may transfer them to an affiliate or to a successor to the Service, and will tell you if we do.</li>
          <li>We are not responsible for delays or failures caused by events beyond our reasonable control, including network, power, platform or provider outages.</li>
          <li>We may send you notices in the app, by push notification or by email. The English version of these Terms prevails over any translation.</li>
        </List>
        <Sub title="App Store terms">
          <p>
            If you got the app from Apple&rsquo;s App Store: these Terms are between you and us, not Apple,
            and we, not Apple, are responsible for the app and its content. Your licence is limited to
            Apple-branded devices you own or control, as allowed by the App Store&rsquo;s Usage Rules
            (including Family Sharing). Apple has no obligation to provide maintenance or support. If the
            app fails to meet any warranty that applies, you may tell Apple and Apple will refund the
            purchase price of the app, if any; Apple has no other warranty obligation. We, not Apple, are
            responsible for any claims about the app, including product liability, failure to meet legal
            or regulatory requirements, consumer protection, privacy, and intellectual-property
            infringement. You confirm you are not in a country subject to a US Government embargo or
            designated as a &ldquo;terrorist supporting&rdquo; country, and are not on a US Government list
            of prohibited or restricted parties. You must comply with any third-party terms (such as your
            mobile data plan) when using the app. Apple and its subsidiaries are third-party
            beneficiaries of these Terms and may enforce them against you.
          </p>
        </Sub>
        <Sub title="Google Play terms">
          <p>If you got the app from Google Play, the Google Play Terms of Service also apply to your download and purchases.</p>
        </Sub>
      </Section>

      <Section id="contact" title="20. Contact and Grievance Officer">
        <p>
          <strong>AMSEK RESEARCH LABS LLP</strong>, West Bengal, India — operator of Loxymity.
        </p>
        <List>
          <li>Support: <a href="mailto:support@loxymity.com">support@loxymity.com</a></li>
          <li>
            Grievance Officer (under the Information Technology Act, 2000, its rules, and the DPDP Act):
            write to <a href="mailto:privacy@loxymity.com">privacy@loxymity.com</a> with &ldquo;Grievance&rdquo;
            in the subject. We acknowledge grievances within 24 hours and aim to resolve them within 15
            days.
          </li>
        </List>
      </Section>
    </LegalPage>
  );
}
