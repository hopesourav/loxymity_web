/**
 * The feature pages (/features/<slug>/), one entry each (SEO/AEO pass, 2026-11-23).
 *
 * Why pages: search engines and AI assistants answer a question from the page that answers it.
 * "Family app that tells me when my kid gets to school", "share location with no signal", "ask
 * where someone is on WhatsApp" — each now has a page whose first paragraph answers it.
 *
 * WHERE THE FACTS COME FROM (keep it that way): the home page's tiles, carousel and FAQ
 * (owner-reviewed), `_lib/pricing.ts` (plan figures — the place counts below are COMPARE_ROWS'),
 * and app behaviour checked in the app repo on 2026-11-23:
 *  - crash check: 30 s countdown, then a "Possible crash" push, not an SOS (tracker.ts)
 *  - SOS: hold, confirm; alarm channel on Android; re-alert after 3 min (0268); exact location
 *    during an SOS for someone sharing an approximate one (0350); a button to dial the local
 *    emergency number; NEVER an automatic call (removed on purpose — never re-advertise one)
 *  - LIVE: owner or admin, about every 30 s for 15 min, members told and can opt out (map/_utils.ts
 *    LIVE_DURATION_S, map.json confirmBody)
 *  - places: owners/admins add, the creator edits (placeDisplay placeAccess), sizes 50–500 m,
 *    passed-by under 5 min (0307), two-reading exit (0258), checked on the phone and by the server
 *  - trips end on their own at min(ETA + 2 h, start + 8 h) (0424); share links ≤ 24 h, revocable
 *  - WhatsApp: self-serve switch, verified number, ghost / paused / blocks (0325), sensitive places
 *    never named (placeLabel), monthly allowance per plan
 *  - driving: Platinum and Infinite; smoothness never enters the score; the weekly score counts
 *    speeding and night driving
 * Claims rules: the home page's (app/page.tsx header) — only what a shipped build does today,
 * nothing about other apps, "Never sold. No ads.". Every FAQ question here is NOT on /help/ or
 * /pricing/ (one marked-up copy per question).
 */

export type FeatureFaq = { q: string; text: string };

export type Feature = {
  slug: string;
  /** Short name: hub cards, breadcrumbs, related links. */
  name: string;
  /** One line for the hub card. */
  summary: string;
  metaTitle: string;
  description: string;
  eyebrow: string;
  h1: string;
  /** The answer, first: what it is and who gets it. */
  lead: string;
  plan: string;
  steps: { t: string; d: string }[];
  details: { t: string; d: string }[];
  limits: string[];
  faq: FeatureFaq[];
  related: string[];
  help?: { href: string; label: string }[];
};

export const FEATURES: Feature[] = [
  {
    slug: 'live-location-sharing',
    name: 'Live location sharing',
    summary: 'Your family on one private, live map — with place names you recognise and a day you can replay.',
    metaTitle: 'Live family location sharing on a private map — Loxymity',
    description:
      'See where your family is right now on a private, live map. Invite-only circles, place names you recognise, a day timeline you can replay, and sharing you can pause any time. Free on iPhone and Android. Never sold.',
    eyebrow: 'Live map',
    h1: 'Live location sharing for your family',
    lead:
      'Loxymity puts the people you love on one private, live map. Everyone in your circle sees each other move, with a place name you recognise and how long ago each position was updated. It works on iPhone and Android, it is free to start, and your location is never sold.',
    plan: 'Free on every plan · history length depends on the plan',
    steps: [
      { t: 'Create a circle', d: 'A private group for your family or close friends. Nobody can find it or join it without an invite.' },
      { t: 'Invite your people', d: 'Send each person a single-use link or QR code. Each of them decides whether to share their location.' },
      { t: 'See each other, live', d: 'Everyone who shares appears on the map, updated as they move, with the time of their last update.' },
    ],
    details: [
      {
        t: 'Place names, not coordinates',
        d: '“Near Victoria Memorial”, not a pin with no name. And Loxymity never guesses that someone is at a hospital, a place of worship or a school — only a place your circle saved itself can say that.',
      },
      {
        t: 'The day, replayed',
        d: 'Open someone’s day to see their stops and journeys on a timeline and replay it on the map. History goes back 2 days on Free, 30 days with Gold, 90 with Platinum and 180 with Infinite.',
      },
      {
        t: 'LIVE for the moments that matter',
        d: 'A circle’s owner or an admin can start LIVE: for 15 minutes everyone shares about every 30 seconds. Members are told it has started, and each can opt out.',
      },
      {
        t: 'Gentle on battery',
        d: 'No fixed polling: about once a minute while someone moves, about every ten minutes while they are still, and slower again on low battery.',
      },
      {
        t: 'Street View on any pin',
        d: 'See the surroundings of where someone is, to recognise an unfamiliar place. Every plan includes some Street View looks each month.',
      },
      {
        t: 'You stay in control',
        d: 'Pause sharing at any time and your circle sees only the last place you shared. Infinite adds Privacy Shield: ghost mode and an approximate location.',
      },
    ],
    limits: [
      'A phone’s location can be off by tens or hundreds of metres, late, or missing — when the phone is off, has no signal, is in battery saver, or its maker limits apps in the background. The map always shows how old a position is.',
      'Sharing while the app is closed needs location set to “Allow all the time” on Android or “Always” on iPhone.',
      'Only the people in your circles see you — plus anyone you send a share link to, until it expires.',
    ],
    faq: [
      {
        q: 'Do people know who can see their location?',
        text: 'Yes. Everyone joins a circle by invite, decides for themselves whether to share, and can see exactly who else is in each circle. Nobody shares by default.',
      },
      {
        q: 'What does my circle see when I pause sharing?',
        text: 'Only the last place you shared, and when. Nothing new is sent until you turn “Share my location” back on in Settings.',
      },
      {
        q: 'What is LIVE mode?',
        text: 'A short burst of faster updates for a moment that matters — a crowded event, a late journey home. A circle’s owner or an admin starts it; for 15 minutes everyone shares about every 30 seconds, then phones go back to normal. Each member is told and can opt out.',
      },
    ],
    related: ['place-alerts', 'trip-sharing', 'sos'],
    help: [
      { href: '/help/#who-can-see', label: 'Who can see where I am?' },
      { href: '/help/#battery', label: 'Will Loxymity drain my battery?' },
    ],
  },
  {
    slug: 'place-alerts',
    name: 'Place alerts',
    summary: 'An alert when someone gets to home, school or work — and when they leave. No more “reached?”.',
    metaTitle: 'Arrival and leave alerts for home, school and work — Loxymity',
    description:
      'Get told when someone in your family arrives at or leaves home, school or work. Saved places with automatic arrival and leave alerts — no more texting “reached?”. 2 places free on Loxymity.',
    eyebrow: 'Place alerts',
    h1: 'Know when they get there',
    lead:
      'Save the places that matter — home, school, the office, grandma’s house — and Loxymity tells your circle when someone arrives or leaves. No checking the map, no “reached?” texts. The free plan includes 2 places; Gold has 10, Platinum 50 and Infinite 100.',
    plan: 'Free: 2 places · Gold 10 · Platinum 50 · Infinite 100',
    steps: [
      { t: 'Save a place', d: 'Pick the spot on the map, choose a size from 50 to 500 metres and give it a name like Home or School.' },
      { t: 'Choose whose visits count', d: 'On the place’s screen, whoever created it can choose everyone in the circle or only some people. The alert still goes to the circle.' },
      { t: 'Get the alert', d: 'When someone arrives or leaves, the people in the circle who can see them get a notification, and it is added to Activity.' },
    ],
    details: [
      { t: '“Passed by”, not “left”', d: 'If someone leaves within five minutes of arriving, the alert says they passed by instead of left.' },
      { t: 'No false “left” alerts', d: 'Leaving needs a second reading outside the place, so standing at the edge or one bad GPS reading does not set off an alert.' },
      { t: 'Works with the app closed', d: 'Places are checked on the phone and again by our server, so an arrival still counts when a phone was asleep at that moment.' },
      { t: 'The family schedule', d: 'Add regular plans like School on weekdays, and Loxymity records whether each day they arrived on time or late.' },
    ],
    limits: [
      'An alert depends on the phone reporting its location — a phone that is off, without signal or held back by its maker can make an alert late.',
      'Nobody gets an alert about someone in ghost mode or who has paused sharing in that circle.',
      'A circle’s owner or an admin adds places; whoever created a place can edit or delete it. Places come with the plan of the person who pays.',
    ],
    faq: [
      {
        q: 'How big should a place be?',
        text: 'Choose the smallest size that covers the whole building and the way people arrive. A bigger area notices arrivals sooner, but it also catches people passing nearby. You can pick 50, 100, 200 or 500 metres.',
      },
      {
        q: 'Do place alerts work when the app is closed?',
        text: 'Yes. The phone checks places in the background, and our server checks them again from the locations it receives, so an arrival is still noticed when a phone was asleep at that moment.',
      },
      {
        q: 'Can I stop getting place alerts myself?',
        text: 'Yes — turn place alerts off in the app’s notification settings. Everyone else in the circle still gets theirs.',
      },
    ],
    related: ['live-location-sharing', 'trip-sharing', 'sos'],
    help: [
      { href: '/help/#late-left-alert', label: 'Why did a “left” alert arrive late?' },
      { href: '/help/#school-or-work', label: 'Can Loxymity tell me when someone gets to school or work?' },
    ],
  },
  {
    slug: 'sos',
    name: 'SOS & crash check',
    summary: 'An SOS the whole circle hears — and a crash check that asks “Are you OK?” first.',
    metaTitle: 'SOS alert and crash check for your family — Loxymity',
    description:
      'An SOS that alerts your whole circle with your exact location — on Android it rings through silent mode — plus a crash check that asks “Are you OK?” first. Free on every Loxymity plan.',
    eyebrow: 'Safety',
    h1: 'An SOS your whole circle hears',
    lead:
      'Hold the SOS button and everyone in your circle gets an urgent alert with your exact location, even if their app is closed — on Android it rings through silent mode. You see who has seen it and who is on the way, and if nobody responds in three minutes the circle is alerted again. SOS and crash check are free on every plan.',
    plan: 'Free on every plan',
    steps: [
      { t: 'Hold SOS', d: 'Hold the SOS button on the map, then confirm.' },
      { t: 'Your circle is alerted', d: 'Everyone gets an urgent alert with your exact location. Android uses an alarm channel that rings through silent mode; on iPhone it is a time-sensitive alert that breaks through Focus.' },
      { t: 'They respond', d: 'Members tap “On my way”, call you or open the map, and you see who has seen it. If nobody responds in three minutes, everyone is alerted again.' },
    ],
    details: [
      {
        t: 'Crash check',
        d: 'If your phone senses a crash while you are moving, it asks “Are you OK?” with a 30-second countdown. Tap “I’m OK” and nothing is sent; with no answer, your circle gets an urgent “Possible crash” alert so they can check on you.',
      },
      { t: 'Even with no signal', d: 'Nearby Loxymity phones can carry your SOS over Bluetooth until one of them is online.' },
      { t: 'Your exact location when it matters', d: 'If you share an approximate location, an SOS shows your exact location to that circle while it is open — and the app tells you so.' },
      { t: 'Call for help from the SOS card', d: 'The SOS card has a button to call your local emergency number, alongside calling the people in your circle.' },
    ],
    limits: [
      'Loxymity is not an emergency service: it alerts your circle, not the police, the fire service or an ambulance. In an emergency, always call your local emergency number.',
      'On iPhone the ring/silent switch can still silence an SOS alert.',
      'Crash check relies on your phone’s motion sensors, so it can miss a crash or react to a hard knock. If notifications are off for Loxymity it cannot ask, so it sends straight away.',
      'Loxymity never calls anyone on its own — the people in your circle decide how to help.',
    ],
    faq: [
      {
        q: 'Does SOS cost anything?',
        text: 'No. SOS and crash check are free on every plan, and calls about an SOS are free for the hour after it is sent.',
      },
      {
        q: 'What if I send an SOS by mistake?',
        text: 'Tap “I’m okay” on the SOS screen to end it. Your circle sees that it has ended.',
      },
      {
        q: 'Can I turn crash check off?',
        text: 'Yes, in Settings. It is on by default, because it only sends anything if you do not answer its “Are you OK?”.',
      },
    ],
    related: ['offline-location-sharing', 'driving-reports', 'live-location-sharing'],
    help: [
      { href: '/help/#sos', label: 'What happens when someone sends an SOS?' },
      { href: '/help/#emergency-service', label: 'Is Loxymity an emergency service?' },
    ],
  },
  {
    slug: 'offline-location-sharing',
    name: 'No-signal relay',
    summary: 'Out of coverage? Nearby Loxymity phones carry your location — or your SOS — until one is online.',
    metaTitle: 'Share location and SOS with no signal, over Bluetooth — Loxymity',
    description:
      'Out of coverage or data? Nearby Loxymity phones can carry your encrypted location or SOS over Bluetooth until one of them gets online. The phone carrying it cannot read it.',
    eyebrow: 'No-signal relay',
    h1: 'Still findable when you have no signal',
    lead:
      'In a basement, on a trek or in a crowd where the network gives up, Loxymity can still get your location — or your SOS — out. Nearby Loxymity phones carry it over Bluetooth, encrypted, until one of them is back online. The phone carrying it cannot read it.',
    plan: 'Free on every plan',
    steps: [
      { t: 'Turn on “Findable when offline”', d: 'In Settings, under Offline relay, and allow Bluetooth when the app asks.' },
      { t: 'Your phone loses signal', d: 'It broadcasts your latest location over Bluetooth, sealed, for nearby Loxymity phones to pick up.' },
      { t: 'A nearby phone gets online', d: 'It hands the sealed packet to our server, which opens it and delivers it only to your circles.' },
    ],
    details: [
      { t: 'Your SOS too', d: 'An SOS sent with no signal travels the same way, and your phone is told once it has got through.' },
      { t: 'Nobody in between can read it', d: 'The phone carrying your location cannot open it — only our server can, to deliver it to your circle.' },
      { t: 'Everyone helps everyone', d: 'Your phone can carry other people’s sealed locations in the same way, without seeing them.' },
    ],
    limits: [
      'It needs another Loxymity phone close by.',
      'It works best between Android phones. While in the background, an iPhone can only be found by other iPhones.',
      'Bluetooth has to be on — the relay cannot work with Bluetooth switched off, even with the permission granted.',
      'It is encrypted on the way, not end to end: our server opens it to deliver it to your circle.',
    ],
    faq: [
      {
        q: 'Can the people carrying my location see where I am?',
        text: 'No. Your location travels sealed; the phone that carries it cannot read it. Only our server opens it, and it delivers it only to the circles you belong to.',
      },
      {
        q: 'Does the relay work on iPhone?',
        text: 'Yes, with a limit: while it is in the background, an iPhone can only be found by other iPhones. It works best between Android phones.',
      },
      {
        q: 'Can I turn the relay off?',
        text: 'Yes — switch off “Findable when offline” in Settings, under Offline relay.',
      },
    ],
    related: ['sos', 'live-location-sharing', 'place-alerts'],
    help: [{ href: '/help/#no-signal', label: 'How does it work when my phone has no signal?' }],
  },
  {
    slug: 'driving-reports',
    name: 'Driving reports',
    summary: 'A report for every drive, with traffic kept apart so a jam never counts against the driver.',
    metaTitle: 'Driving reports for families that are fair to the driver — Loxymity',
    description:
      'Loxymity notices drives on its own and keeps a report of each: route, distance, top speed, and time stuck in traffic kept apart from time moving — plus a road-smoothness reading. On Platinum and Infinite.',
    eyebrow: 'Driving reports',
    h1: 'Driving reports that are fair to the driver',
    lead:
      'Loxymity notices drives by itself and keeps a report of each one — the route, distance and top speed, with the time stuck in traffic kept apart from the time moving, so a jam never counts against the driver. Plus a reading of how smooth the road was. Driving reports come with Platinum and Infinite, for everyone in a covered circle.',
    plan: 'Platinum and Infinite',
    steps: [
      { t: 'Just drive', d: 'Drives are noticed automatically — there is nothing to start or stop.' },
      { t: 'A report for each drive', d: 'Route, distance, top speed, time in traffic and time moving, and where it started and ended.' },
      { t: 'Share it, or keep it', d: 'A summary appears in your circle’s Activity. Turn off sharing drives in Settings → Driving to keep them to yourself.' },
    ],
    details: [
      { t: 'Traffic is not the driver’s fault', d: 'Time stuck in a jam is shown on its own, never mixed into the time spent moving.' },
      { t: 'Road smoothness', d: 'A reading of how bumpy the road was, from your phone’s motion sensors. It describes the road, so it never counts in the driver’s score.' },
      { t: 'Your driving week', d: 'A weekly score and grade in My Drives, built from speeding and night-time driving.' },
      { t: 'Not your drive?', d: 'Remove a drive that was not you driving — a taxi or a bus — and share any report as an image.' },
    ],
    limits: [
      'Scores, speeds and road smoothness are estimates for your own information. They must not be used for insurance, work or legal decisions.',
      'Drives are recognised from movement, so a fast ride as a passenger can appear as a drive.',
      'Turning off drive tracking in Settings → Driving stops drives being recorded at all.',
    ],
    faq: [
      {
        q: 'Does Loxymity score how I drive?',
        text: 'Your driving week gets a score and grade in My Drives, built from speeding and night-time driving. Time stuck in traffic and bumpy roads never count against you.',
      },
      {
        q: 'Who can see my drives?',
        text: 'The people in your circle see a summary of each drive in Activity and can open its report — unless you turn off sharing drives in Settings → Driving.',
      },
      {
        q: 'Are driving reports on the free plan?',
        text: 'No — they come with Platinum and Infinite, for everyone in a covered circle. Crash check, which also watches over you while you drive, is free.',
      },
    ],
    related: ['sos', 'trip-sharing', 'live-location-sharing'],
    help: [{ href: '/help/#drive-sharing', label: 'Can I stop my circle seeing my drives?' }],
  },
  {
    slug: 'whatsapp-location',
    name: 'Ask in WhatsApp',
    summary: '“Where’s mum?” — ask in WhatsApp and get the place, how long ago and the battery.',
    metaTitle: 'Ask where your family is in WhatsApp — Loxymity',
    description:
      'Turn on WhatsApp questions once, then ask Loxymity in plain words: “Where’s mum?” Get the place, how long ago and the battery, without opening the app. Opt-in, and it respects ghost mode, paused sharing and blocks.',
    eyebrow: 'Ask in WhatsApp',
    h1: '“Where’s mum?” — ask in WhatsApp',
    lead:
      'Turn on WhatsApp questions once, then message Loxymity in plain words — “where is mum”, “is Rohan at school?” — and get the answer straight back: the place, how long ago and the battery, without opening the app. It is opt-in, and it respects ghost mode, paused sharing and blocks.',
    plan: 'Every plan · the monthly question allowance depends on the plan',
    steps: [
      { t: 'Verify your phone number', d: 'Your WhatsApp number must be the verified phone number on your Loxymity account.' },
      { t: 'Turn on WhatsApp questions', d: 'In the app: Settings → Integrations → WhatsApp.' },
      { t: 'Ask', d: 'Message Loxymity on WhatsApp in plain words, using names or the labels you set, like Mum or Son.' },
    ],
    details: [
      { t: 'The answer you need', d: 'Where they are, how long ago that was and their battery — in one message.' },
      { t: 'Schedule answers', d: 'Ask “Is Asha at school?” and hear how her day is going against the family schedule.' },
      { t: 'Privacy first', d: 'It never answers about someone in ghost mode, someone who has paused sharing, or someone either of you has blocked. Someone sharing an approximate location is described by area only.' },
      { t: 'Careful with places', d: 'Like the app, it never names a hospital, a place of worship or a police station unless your circle saved it as a place.' },
    ],
    limits: [
      'Anyone who can use your WhatsApp account can ask the same questions — keep your phone locked.',
      'Each plan includes a number of assistant questions a month.',
      'WhatsApp is a trademark of WhatsApp LLC. Loxymity is not affiliated with WhatsApp or Meta.',
    ],
    faq: [
      {
        q: 'Can I stop people asking about me in WhatsApp?',
        text: 'Yes: pause sharing, use ghost mode on Infinite, or block the person. In each case the assistant will not say where you are.',
      },
      {
        q: 'How do I turn WhatsApp questions off?',
        text: 'Switch off WhatsApp in Settings → Integrations. You can turn it back on there at any time.',
      },
      {
        q: 'Which number do I message from?',
        text: 'The verified phone number on your Loxymity account. Messages from any other number are not answered with anyone’s location.',
      },
    ],
    related: ['live-location-sharing', 'place-alerts', 'trip-sharing'],
    help: [{ href: '/help/#whatsapp', label: 'Can I ask where someone is from WhatsApp?' }],
  },
  {
    slug: 'trip-sharing',
    name: 'Trips, flights & share links',
    summary: 'A live ETA for the circle, flights on the family map, and live links for people without the app.',
    metaTitle: 'Share your trip ETA, flights and live location links — Loxymity',
    description:
      'Start a trip and your circle sees a live ETA, then gets one “arrived” alert. Add a flight number to watch it land on the family map. Share a live link with anyone, for up to 24 hours.',
    eyebrow: 'Trips',
    h1: 'Share the journey, skip the texts',
    lead:
      'Start a trip and your circle sees a live ETA on the map, then gets one “arrived” alert. Add a flight number and the plane appears on the same map as everyone else. Need to show someone who does not have the app? Send a live link that expires by itself. All free on every plan.',
    plan: 'Free on every plan',
    steps: [
      { t: 'Start a trip', d: 'Choose where you are going.' },
      { t: 'Your circle sees the ETA', d: 'A live estimate of when you will arrive, on the map while you travel.' },
      { t: 'One “arrived” alert', d: 'When you get there, the circle gets one alert. No more “are you there yet?”.' },
    ],
    details: [
      { t: 'Flights on the family map', d: 'Add a flight number and the plane appears on the map with everyone else. The whole circle hears when it lands.' },
      { t: 'Live links for anyone', d: 'Share your live location with someone who does not have the app. It opens in a web browser and stops when it expires — at most 24 hours — or when you stop it.' },
      { t: 'Trips tidy themselves up', d: 'A trip that never arrives ends on its own a couple of hours after its expected arrival.' },
    ],
    limits: [
      'A share link shows your live location to anyone who has it — send it only to people you trust.',
      'Ghost mode stops a share link showing where you are.',
      'An ETA is an estimate; traffic and stops can change it.',
    ],
    faq: [
      {
        q: 'Does the person I send a link to need the app?',
        text: 'No. A share link opens in any web browser and shows your live location until it expires — at most 24 hours — or until you stop it.',
      },
      {
        q: 'Is flight tracking free?',
        text: 'Yes, on every plan. Add the flight number and the circle sees the plane on the map and hears when it lands.',
      },
      {
        q: 'What if I never arrive where I said?',
        text: 'The trip ends on its own a couple of hours after its expected arrival, so the circle is not left watching an ETA that will never come.',
      },
    ],
    related: ['place-alerts', 'live-location-sharing', 'whatsapp-location'],
  },
  {
    slug: 'official-alerts',
    name: 'Weather & official alerts',
    summary: 'Cyclone, flood, heat and storm warnings from official feeds, matched to where your circle is.',
    metaTitle: 'Cyclone, flood and storm warnings for your family — Loxymity',
    description:
      'Official cyclone, flood, heat and storm warnings from the government feeds in India and the US, matched to where your circle actually is — with the authority’s own instructions, never rewritten.',
    eyebrow: 'Official alerts',
    h1: 'Official warnings, matched to your people',
    lead:
      'When a government agency issues a cyclone, flood, heat or storm warning, Loxymity matches it to where the people in your circle actually are — and shows the authority’s own instructions, never rewritten. Warnings come from the official feeds in India and the US, free on every plan.',
    plan: 'Free on every plan',
    steps: [
      { t: 'An agency issues a warning', d: 'From the official alert feeds in India and the US.' },
      { t: 'Matched to your circle', d: 'Loxymity checks the warning area against where your circle is, and the people inside it are alerted.' },
      { t: '“I’m safe” after a storm', d: 'For a thunderstorm warning, one tap tells your circle you are safe, and everyone’s answers show on the alert.' },
    ],
    details: [
      { t: 'Official words, never rewritten', d: 'The authority’s own instructions, as it issued them.' },
      { t: 'Translated on your phone', d: 'A warning in another language can be translated on supported phones, with the original kept alongside.' },
      { t: 'Help one tap away', d: 'If you need help, the alert takes you straight to the SOS screen — nothing is sent until you choose.' },
    ],
    limits: [
      'Loxymity passes on official warnings; it does not make its own forecasts.',
      'Which warnings you get depends on the agencies’ feeds.',
      'Saying you are safe never raises an SOS or alerts anyone on its own.',
    ],
    faq: [
      {
        q: 'Which warnings does Loxymity show?',
        text: 'Official warnings such as cyclone, flood, heat and storm alerts, from government alert feeds in India and the US.',
      },
      {
        q: 'Does Loxymity write its own weather warnings?',
        text: 'No. It shows the warning and the instructions exactly as the authority issued them, matched to where your circle is.',
      },
      {
        q: 'Are official alerts free?',
        text: 'Yes, on every plan.',
      },
    ],
    related: ['sos', 'live-location-sharing', 'place-alerts'],
  },
];

export const FEATURE_BY_SLUG: Record<string, Feature> = Object.fromEntries(FEATURES.map((f) => [f.slug, f]));
