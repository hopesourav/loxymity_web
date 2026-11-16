import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces, Instrument_Serif } from 'next/font/google';
import './globals.css';

// Downloaded at build time and served from loxymity.com — no request to Google from visitors.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-fraunces', display: 'swap' });
// The logo's face ("Loxymity." — app/_components/Logo.tsx), shared with the app icon and splash.
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-instrument', display: 'swap' });

const DESCRIPTION =
  'See where your family is, right now, on a private live map — with an SOS that rings, a crash check, place alerts, driving reports and answers in WhatsApp. Free to start. Your location is never sold.';

// Claims here are what a shipped build does today (Alexa is paused, so it is not named).
export const metadata: Metadata = {
  title: 'Loxymity — Private location sharing for families',
  description: DESCRIPTION,
  // All four files live in public/ (none existed before 2026-10-25, so every one 404'd).
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '64x64', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Loxymity — Never wonder where they are again',
    description: DESCRIPTION,
    url: 'https://loxymity.com',
    siteName: 'Loxymity',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Loxymity. Your people, close — wherever they are.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loxymity — Never wonder where they are again',
    images: ['/og.png'],
    description: DESCRIPTION,
  },
  metadataBase: new URL('https://loxymity.com'),
};

export const viewport: Viewport = {
  themeColor: '#080A1C',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${instrument.variable}`}>
      <body className="bg-dark-bg text-dark-text antialiased">{children}</body>
    </html>
  );
}
