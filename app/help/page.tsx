import { JsonLd } from '../_components/JsonLd';
import { SiteFooter } from '../_components/SiteFooter';
import { SiteNav } from '../_components/SiteNav';
import { EVENT_CIRCLE_MEMBERS, FREE_CIRCLES } from '../_lib/pricing';
import { breadcrumb, faqPage, pageMeta } from '../_lib/seo';

/**
 * loxymity.com/help/ — the Help centre (SEO/AEO pass, 2026-11-23).
 *
 * One answer per question, every answer visible in the HTML (no accordions), each with its own
 * anchor (`/help/#crash-check`), so a search engine or an AI assistant can quote — and link to — the
 * exact answer. Marked up as one FAQPage. It answers every question in the home page FAQ (which is
 * therefore not marked up itself), and none of the /pricing/ page's questions.
 *
 * WHERE THE ANSWERS COME FROM: the home page FAQ and feature copy (owner-reviewed), `_lib/pricing.ts`
 * (plan figures), /delete-account/, and the app's own behaviour checked in the app repo
 * (2026-11-23). NOT from the app's `supabase/functions/_shared/loxyKnowledge.ts`: several of its
 * answers are out of date (Alexa, a "daily" WhatsApp limit, every invite needing approval, a battery
 * percentage nobody measured). Claims rules: the home page's (app/page.tsx header).
 *
 * Keep the facts in step with the home page: crash check sends a "Possible crash" alert, not an SOS
 * (tracker.ts handlePossibleCrash); only a circle's owner can remove someone (remove_member, 0005).
 */
export const metadata = pageMeta({
  title: 'Loxymity Help centre — answers about circles, places, SOS and privacy',
  description:
    'How Loxymity works: circles and invites, live location and battery, place alerts, SOS and crash check, driving reports, WhatsApp, privacy and deleting your account.',
  path: '/help/',
});

const UPDATED = '23 November 2026';

type Item = { id: string; q: string; text: string; more?: { href: string; label: string } };
type Group = { id: string; title: string; items: Item[] };

const GROUPS: Group[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    items: [
      {
        id: 'what-is-loxymity',
        q: 'What is Loxymity?',
        text: 'Loxymity is a private, real-time location-sharing app for families and close friends, on iPhone and Android. The people you invite into a circle see each other on a live map, get an alert when someone arrives at or leaves a saved place such as home or school, and can send an SOS that reaches the whole circle. It is free to start, your location is never sold, and there are no ads. Loxymity is made by AMSEK RESEARCH LABS LLP in India.',
        more: { href: '/about/', label: 'About Loxymity' },
      },
      {
        id: 'get-started',
        q: 'How do I get started?',
        text: 'Download Loxymity from the App Store or Google Play, sign in with Apple, Google or your email, then create a circle and invite your people. You must be 18 or older to sign up.',
      },
      {
        id: 'phones',
        q: 'Which phones does Loxymity work on?',
        text: 'iPhone with iOS 17 or later, and Android phones with Android 7.0 or later. Everyone in a circle can use either. The app is in English for now; more languages are on the way.',
      },
      {
        id: 'is-it-free',
        q: 'Is Loxymity free?',
        text: `Yes, to start. The free plan includes ${FREE_CIRCLES} circles of up to 5 people, 2 places with alerts, 2 days of history, SOS, crash check, chat and share links. Paid plans — Gold, Platinum and Infinite — add bigger circles, longer history, more places, calls and driving reports, and one person can pay for the whole circle.`,
        more: { href: '/pricing/', label: 'See pricing' },
      },
    ],
  },
  {
    id: 'circles',
    title: 'Circles and invites',
    items: [
      {
        id: 'what-is-a-circle',
        q: 'What is a circle?',
        text: 'A private, invite-only group — your family, or a few close friends. You see the people in the circles you join, and they see you while you share your location. You can be in more than one circle, for example one for family and one for friends.',
      },
      {
        id: 'invite',
        q: 'How do I invite someone to my circle?',
        text: 'Send each person a single-use invite link or QR code from the app. Invites sent by the circle’s owner or an admin join straight away; invites sent by an ordinary member wait for an owner’s approval. Each person decides for themselves whether to share their location.',
      },
      {
        // Same figures as COMPARE_ROWS in _lib/pricing.ts (5 at a time while temp_circle_rules_enabled
        // is off) — change both together.
        id: 'temporary-circle',
        q: 'What is a temporary circle?',
        text: `A circle for an event, a trip or a day out, for up to ${EVENT_CIRCLE_MEMBERS} people, that ends by itself. On the free plan you can run one at a time, for up to 24 hours. With a plan you can run five at a time, and one of them can last up to 30 days.`,
      },
      {
        id: 'leave-or-remove',
        q: 'How do I leave a circle or remove someone?',
        text: 'Open the circle in the app. Anyone can leave a circle, and a circle’s owner can remove a member. The last owner of a circle names a new owner before leaving. Once someone has left or been removed, they no longer see the circle and the circle no longer sees them.',
      },
    ],
  },
  {
    id: 'location',
    title: 'Location, history and battery',
    items: [
      {
        id: 'always-shared',
        q: 'Is my location always being shared?',
        text: 'Only while you choose to share. Turn off “Share my location” in Settings and your phone stops sending new positions — your circle then sees only the last location you shared, and when. Turn it back on whenever you like. You can leave a circle at any time, and on Infinite go into ghost mode.',
      },
      {
        id: 'who-can-see',
        q: 'Who can see where I am?',
        text: 'The people in the circles you join. Circles are invite-only: each invite is a single-use code, and invites sent by ordinary members wait for an owner’s approval. A share link you create shows your live location to anyone who has it until it expires (at most 24 hours). If someone in your circle links WhatsApp, they — and anyone who can use that WhatsApp account — can ask where you are, unless you are in ghost mode, have paused sharing or have blocked them. Nobody else can.',
      },
      {
        id: 'battery',
        q: 'Will Loxymity drain my battery?',
        text: 'It is designed not to. There is no fixed polling interval: your phone reports roughly once a minute while you move and about every ten minutes when you are still, and slows down further on low battery unless you are charging or driving. Live mode, an active trip or an SOS report faster for a short time, because that is when it matters.',
      },
      {
        id: 'old-location',
        q: 'Why does someone’s location look old?',
        text: 'Their phone has not reported in. That happens when it is switched off, has no signal, is in battery saver, or its maker limits apps running in the background — or when they have paused sharing. The map shows when each position was last updated, so check that time before relying on a pin.',
      },
      {
        id: 'accuracy',
        q: 'How accurate are locations, alerts and driving scores?',
        text: 'They are good estimates, not guarantees. A phone’s location can be off by tens or hundreds of metres, late, or missing — when the phone is off, has no signal, is in battery saver, or its maker limits background apps. A “left” alert waits for a second reading outside the place, so it can arrive a little late. Driving scores, speeds and road smoothness are for your own information and must not be used for insurance, work or legal decisions.',
      },
      {
        id: 'permissions',
        q: 'Which permissions does Loxymity need?',
        text: 'Location set to “Allow all the time” on Android or “Always” on iPhone, so your circle still sees you when the app is closed, and notifications, for place alerts and SOS. Bluetooth is optional: it powers the no-signal relay, which passes locations between nearby Loxymity phones. On Android, turning off battery optimisation for Loxymity helps it keep reporting.',
      },
      {
        id: 'history',
        q: 'How far back can I see where someone has been?',
        text: 'Two days on the free plan, 30 days with Gold, 90 with Platinum and 180 with Infinite — for everyone in a covered circle. The day timeline replays someone’s day on the map, with their stops and journeys.',
      },
      {
        id: 'lost-phone',
        q: 'What happens to my history if I lose my phone?',
        text: 'Whatever is within your plan’s window is on our servers and syncs to your new phone. Older history lives only on your old phone — unless you use Vault, a backup encrypted with a password only you know, which comes with a plan for the person who pays. We cannot read it, and we cannot recover it if you forget the password.',
      },
    ],
  },
  {
    id: 'places',
    title: 'Places and alerts',
    items: [
      {
        id: 'what-is-a-place',
        q: 'What is a place?',
        text: 'A saved area on the map, such as Home, School or Work. Loxymity tells your circle when someone arrives at or leaves it, so nobody has to text “reached?”. The free plan includes 2 places; Gold 10, Platinum 50 and Infinite 100. Places come with the plan of the person who pays.',
      },
      {
        id: 'school-or-work',
        q: 'Can Loxymity tell me when someone gets to school or work?',
        text: 'Yes. Save the school or office as a place, and the circle gets an alert when they arrive and when they leave. You can also add it to the family schedule, which records whether each day they arrived on time or late.',
      },
      {
        id: 'late-left-alert',
        q: 'Why did a “left” alert arrive late?',
        text: 'So that standing near the edge of a place does not set off alerts over and over, Loxymity waits for a second reading outside the place before it says someone left. A phone that is asleep or has weak GPS can also delay an alert until it reports in again.',
      },
      {
        id: 'passed-by',
        q: 'What does “passed by” mean?',
        text: 'If someone leaves a place within five minutes of arriving, the alert says they passed by instead of saying they left.',
      },
      {
        id: 'who-gets-alerts',
        q: 'Who gets place alerts?',
        text: 'People in the circle who can see that person. Nobody is alerted about someone in ghost mode or someone who has paused sharing in that circle, and anyone can turn place alerts off in the app’s notification settings.',
      },
    ],
  },
  {
    id: 'safety',
    title: 'Safety',
    items: [
      {
        id: 'sos',
        q: 'What happens when someone sends an SOS?',
        text: 'Everyone in the circle gets an urgent alert with the sender’s exact location, even if the app is closed. On Android it uses an alarm channel that rings through silent mode; on iPhone it is a time-sensitive alert that breaks through Focus, but the ring/silent switch can still silence it. Members tap “On my way”, call, or open the map, and the sender sees who has seen it. If nobody responds within three minutes, the circle is alerted again. Loxymity is not an emergency service — always call your local emergency number too.',
      },
      {
        id: 'crash-check',
        q: 'What is the crash check?',
        text: 'If your phone senses a crash while you are moving, Loxymity asks “Are you OK?” with a 30-second countdown. Tap “I’m OK” and nothing is sent; if you don’t answer, your circle gets an urgent “Possible crash” alert so they can check on you. If notifications are off for Loxymity it cannot ask, so it sends straight away. It is on by default and you can turn it off in Settings. It relies on your phone’s motion sensors, so it can miss a crash or react to a hard knock.',
      },
      {
        id: 'no-signal',
        q: 'How does it work when my phone has no signal?',
        text: 'Other Loxymity phones nearby can carry your location — or your SOS — over Bluetooth until one of them gets online. The phone carrying it cannot read it; our server opens it and delivers it only to your circles. It needs another Loxymity phone close by, works best between Android phones, and while backgrounded an iPhone can only be found by other iPhones. You can turn it off in Settings.',
      },
      {
        id: 'emergency-service',
        q: 'Is Loxymity an emergency service?',
        text: 'No. Loxymity alerts the people in your circle; it does not contact the police, the fire service or an ambulance. In an emergency, always call your local emergency number.',
      },
      {
        id: 'low-battery',
        q: 'Will I know if someone’s battery is running out?',
        text: 'Yes. When someone’s battery runs low, their circle gets a low-battery alert, so you know their location may stop updating soon.',
      },
    ],
  },
  {
    id: 'driving',
    title: 'Driving',
    items: [
      {
        id: 'driving-reports',
        q: 'How do driving reports work?',
        text: 'With Platinum or Infinite, for everyone in a covered circle, Loxymity notices drives by itself and keeps a report of each one: the route, distance, top speed and time stuck in traffic kept apart from time moving, plus a road-smoothness reading. Speeds, scores and smoothness are estimates for your own information and must not be used for insurance, work or legal decisions.',
      },
      {
        id: 'drive-sharing',
        q: 'Can I stop my circle seeing my drives?',
        text: 'Yes. In Settings → Driving, turn off sharing drives with your circle. Turning off drive tracking stops drives being recorded at all.',
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy and your data',
    items: [
      {
        id: 'never-sold',
        q: 'Is my location sold?',
        text: 'No. Your location is never sold and never used for ads, and there are no ads in Loxymity. We use service providers only to run the service; they are listed in our Privacy Policy.',
        more: { href: '/privacy/', label: 'Read the Privacy Policy' },
      },
      {
        id: 'encryption',
        q: 'Is Loxymity end-to-end encrypted?',
        text: 'No, and we say so plainly. Locations, messages and calls are encrypted on the way and protected on our servers, but they are not end-to-end encrypted — that is how alerts, history and SOS can work. What the app keeps on your phone is encrypted, App Lock adds Face ID or fingerprint, and Vault backups open only with your password.',
      },
      {
        id: 'calls-and-messages',
        q: 'Are calls and messages private?',
        text: 'In-app calls are not recorded. Calls, messages and locations are encrypted on the way and protected on our servers, but they are not end-to-end encrypted — that is how alerts, history and SOS can work. You can block anyone, and report any message to us; we keep a copy of a reported message so it can be looked into.',
      },
      {
        id: 'block',
        q: 'What does blocking someone do?',
        text: 'Blocking stops private messages and calls between you, both ways, and hides their messages in circle chat on your phone. It does not change who sees your location in a circle you both belong to — to stop that, pause sharing or leave the circle.',
      },
      {
        id: 'whatsapp',
        q: 'Can I ask where someone is from WhatsApp?',
        text: 'Yes. Link WhatsApp in the app (Settings → Integrations), then send a question such as “Where is Mum?” and get the answer from your circle’s live map. It never answers about someone in ghost mode, someone who has paused sharing, or someone either of you has blocked.',
      },
      {
        id: 'employees',
        q: 'Can I use Loxymity to track employees or a team?',
        text: 'Loxymity is made for families and close friends who choose to share — it is not a tool for monitoring employees. Using it to monitor employees, drivers, students or anyone else for an organisation makes you responsible for complying with privacy and employment law, as our Terms explain. Never track anyone without their knowledge and agreement. For organisations we offer safety services that people control, under a written agreement.',
        more: { href: '/business/', label: 'Loxymity for organisations' },
      },
      {
        id: 'delete-account',
        q: 'How do I delete my account?',
        text: 'In the app, go to You → Delete account. You are signed out and removed from your circles straight away. Adults then have 7 days to sign in and restore the account before it is deleted for good; accounts of anyone under 18 are deleted at once.',
        more: { href: '/delete-account/', label: 'What is deleted and what we keep' },
      },
    ],
  },
];

const ALL_ITEMS = GROUPS.flatMap((g) => g.items);

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-dark-bg">
      <JsonLd nodes={[breadcrumb('Help centre', '/help/'), faqPage(ALL_ITEMS)]} />
      <SiteNav />

      <header className="relative overflow-hidden px-6 pb-10 pt-36">
        <div className="aurora" aria-hidden="true"><span className="a1" /><span className="a3" /></div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="eyebrow">How can we help?</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-dark-text md:text-6xl">Loxymity Help centre</h1>
          <p className="mt-6 text-lg leading-relaxed text-dark-muted">
            Straight answers about how Loxymity works — circles, places, SOS, driving and privacy. Can&apos;t find yours?
            Write to <a href="mailto:support@loxymity.com" className="text-primary-soft hover:underline">support@loxymity.com</a>.
          </p>
          <p className="mt-3 text-xs text-dark-muted">Updated {UPDATED}</p>
        </div>
      </header>

      <nav aria-label="Help topics" className="px-6 pb-12">
        <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2">
          {GROUPS.map((g) => (
            <li key={g.id}>
              <a
                href={`#${g.id}`}
                className="block rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-1.5 text-sm text-dark-muted transition-colors hover:border-white/20 hover:text-dark-text"
              >
                {g.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="mx-auto max-w-3xl space-y-16 px-6 pb-24">
        {GROUPS.map((g) => (
          <section key={g.id} id={g.id} className="scroll-mt-24" aria-labelledby={`${g.id}-title`}>
            <h2 id={`${g.id}-title`} className="text-2xl font-semibold tracking-tight text-dark-text md:text-3xl">{g.title}</h2>
            <div className="mt-6 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {g.items.map((it) => (
                <article key={it.id} id={it.id} className="scroll-mt-24 py-6">
                  <h3 className="text-base font-semibold leading-snug text-dark-text">
                    <a href={`#${it.id}`} className="hover:underline">{it.q}</a>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-dark-muted">{it.text}</p>
                  {it.more && (
                    <a href={it.more.href} className="mt-3 inline-block text-sm font-semibold text-primary-soft hover:underline">
                      {it.more.label} →
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-3xl border border-white/[0.07] bg-dark-surface/60 p-6 text-sm leading-relaxed text-dark-muted">
          <p>
            Questions about plans and prices are on the <a href="/pricing/" className="text-primary-soft hover:underline">pricing page</a>.
            Still stuck? Email <a href="mailto:support@loxymity.com" className="text-primary-soft hover:underline">support@loxymity.com</a> —
            and for a complaint about personal data, our <a href="/privacy/#contact" className="text-primary-soft hover:underline">Grievance Officer</a>.
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
