import type { Metadata } from 'next';

// One generic preview for every invite link. The code itself never appears in the HTML or the
// link preview — it is read in the browser from the URL.
export const metadata: Metadata = {
  title: "You're invited to a Loxymity circle",
  description: 'Join your family or friends on Loxymity to see where each other is.',
  robots: { index: false, follow: false },
  openGraph: {
    title: "You're invited to a Loxymity circle",
    description: 'Tap to join — see where your family is, right now.',
  },
};

export default function JoinLayout({ children }: { children: React.ReactNode }) {
  return children;
}
