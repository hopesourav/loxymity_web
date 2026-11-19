import type { Metadata } from 'next';

// The QR a Loxymity phone shows to link another phone (https://loxymity.com/pair#<token>). The token
// sits in the URL FRAGMENT, which browsers never send to a server; this page does not read it.
export const metadata: Metadata = {
  title: 'Open this code in Loxymity',
  description: 'This code links a phone to a Loxymity account. It works inside the Loxymity app.',
  robots: { index: false, follow: false },
};

export default function PairLayout({ children }: { children: React.ReactNode }) {
  return children;
}
