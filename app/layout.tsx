import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Loxymity — See where your circle is, right now',
  description:
    'Loxymity is a private, real-time location sharing app for families and close friends. Live map, SOS emergency alerts, safety check-ins, iBeacon tracking, geo-fencing, and in-app calls — all in one place.',
  openGraph: {
    title: 'Loxymity',
    description: 'Real-time location sharing with SOS alerts, safety check-ins, iBeacon tracking, and geo-fencing for families and close friends.',
    url: 'https://loxymity.com',
    siteName: 'Loxymity',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loxymity',
    description: 'Real-time location sharing with SOS alerts, safety check-ins, iBeacon tracking, and geo-fencing for families and close friends.',
  },
  metadataBase: new URL('https://loxymity.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}
