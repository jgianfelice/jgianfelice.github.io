import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Inter } from 'next/font/google';
import './globals.css';

// Geist Mono is the display/UI voice — a precise, engineered monospace that
// carries the same technical vibe as before but with more character. Loaded
// locally from the bundled TTFs (also used by the WebGL hero via troika), so
// there's no webfont round-trip. Inter stays as the quiet body companion.
const geistMono = localFont({
  src: [
    { path: '../public/fonts/GeistMono-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/GeistMono-Medium.ttf', weight: '500', style: 'normal' },
  ],
  variable: '--font-geist-mono',
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
    <html lang="en" className={`${geistMono.variable} ${inter.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
