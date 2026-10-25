import type { Metadata } from 'next';
import { Inter, Fraunces, Instrument_Serif } from 'next/font/google';
import './globals.css';

// Downloaded at build time and served from loxymity.com — no request to Google from visitors.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const fraunces = Fraunces({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-fraunces', display: 'swap' });
// The logo's face ("Loxymity." — app/_components/Logo.tsx), shared with the app icon and splash.
const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-instrument', display: 'swap' });

export const metadata: Metadata = {
  title: 'Loxymity — See where your circle is, right now',
  description:
    'Loxymity is a private, real-time location sharing app for families and close friends. Live map, SOS alerts, circle chat, geo-fencing, driving reports, flight tracking, in-app calls, Street View, and AI-powered location queries from WhatsApp & Alexa. It keeps working when a phone has no signal — and your location is never sold.',
  // All four files live in public/ (none existed before 2026-10-25, so every one 404'd).
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '64x64', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Loxymity — Stay connected with your circle',
    description: 'Real-time location sharing with SOS alerts, circle chat, geo-fencing, driving reports, flight tracking, Street View, and AI location queries from WhatsApp & Alexa. Works with no signal. Privacy-first — never sold.',
    url: 'https://loxymity.com',
    siteName: 'Loxymity',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Loxymity. Your people, close — wherever they are.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loxymity',
    images: ['/og.png'],
    description: 'Real-time location sharing with SOS alerts, circle chat, geo-fencing, driving reports, flight tracking, Street View, and AI location queries from WhatsApp & Alexa. Works with no signal. Privacy-first — never sold.',
  },
  metadataBase: new URL('https://loxymity.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${instrument.variable}`}>
      <body className="bg-dark-bg text-dark-text antialiased">{children}</body>
    </html>
  );
}
