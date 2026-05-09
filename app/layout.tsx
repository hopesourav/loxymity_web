import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Loxymity — See where your circle is, right now',
  description:
    'Loxymity is a private, real-time location sharing app for families and close friends. Know where your people are without constantly texting.',
  openGraph: {
    title: 'Loxymity',
    description: 'See where your circle is, right now.',
    url: 'https://loxymity.com',
    siteName: 'Loxymity',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loxymity',
    description: 'See where your circle is, right now.',
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
