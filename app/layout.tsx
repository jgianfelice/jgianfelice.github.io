import type { Metadata } from 'next';
import { IBM_Plex_Mono, Inter } from 'next/font/google';
import './globals.css';

// The exact pairing igloo.inc ships: IBM Plex Mono for the display/UI
// voice, Inter for body. Both are open-source (SIL OFL).
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Justin Gianfelice',
  description:
    'Finance student at McGill. Building at the intersection of markets, data, and disciplined execution.',
  openGraph: {
    title: 'Justin Gianfelice',
    description:
      'Building at the intersection of markets, data, and disciplined execution.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plexMono.variable} ${inter.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
