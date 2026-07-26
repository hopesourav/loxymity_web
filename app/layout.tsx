import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Loxymity — See where your circle is, right now',
  description:
    'Loxymity is a private, real-time location sharing app for families and close friends. Live map, SOS emergency alerts, safety check-ins, iBeacon tracking, geo-fencing, and in-app calls — all in one place.',
  icons: {
    icon: '/favicon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Loxymity — Stay connected with your circle',
    description: 'Real-time location sharing with SOS alerts, safety check-ins, iBeacon tracking, and geo-fencing for families and close friends.',
    url: 'https://loxymity.com',
    siteName: 'Loxymity',
    type: 'website',
    images: [{ url: '/icon.png', width: 1024, height: 1024, alt: 'Loxymity' }],
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
      <body className="bg-dark-bg text-dark-text antialiased">{children}</body>
    </html>
  );
}
