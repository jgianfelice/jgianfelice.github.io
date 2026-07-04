import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

// Two voices, both bundled locally (no webfont round-trip, and the hero's
// WebGL text reuses the Space Grotesk TTFs via troika):
//   · Fraunces — an expressive high-contrast serif with optical sizing, used
//     large for the editorial page titles. It carries the "made with care"
//     signal a default UI font never could.
//   · Space Grotesk — a characterful grotesque (proportional, not a mono) for
//     labels, UI, body, and the hero. Technical, but not generic.
const grotesk = localFont({
  src: [
    { path: '../public/fonts/SpaceGrotesk-Light.ttf', weight: '300', style: 'normal' },
    { path: '../public/fonts/SpaceGrotesk-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/SpaceGrotesk-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/SpaceGrotesk-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-grotesk',
  display: 'swap',
});

const fraunces = localFont({
  src: [
    { path: '../public/fonts/Fraunces-Variable.ttf', weight: '300 700', style: 'normal' },
    { path: '../public/fonts/Fraunces-Italic-Variable.ttf', weight: '300 700', style: 'italic' },
  ],
  variable: '--font-fraunces',
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
    <html lang="en" className={`${grotesk.variable} ${fraunces.variable}`}>
      <body className="grain">{children}</body>
    </html>
  );
}
