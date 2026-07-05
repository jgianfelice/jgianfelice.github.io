import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

// Two voices, both bundled locally (no webfont round-trip, and the hero's
// WebGL text reuses the same TTFs via troika):
//   · Fraunces — an expressive high-contrast serif with optical sizing, used
//     large for the editorial page titles.
//   · Computer Modern — Knuth's LaTeX face (CMU conversion). Serif Roman for
//     body prose, Typewriter for labels/UI — the site reads like a working
//     paper, which is exactly the brand.
const cmuSerif = localFont({
  src: [
    { path: '../public/fonts/cmunrm.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/cmunti.ttf', weight: '400', style: 'italic' },
    { path: '../public/fonts/cmunbx.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-cmu-serif',
  display: 'swap',
});

const cmuTypewriter = localFont({
  src: [
    { path: '../public/fonts/cmuntt.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/cmuntb.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-cmu-mono',
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
    <html
      lang="en"
      className={`${cmuSerif.variable} ${cmuTypewriter.variable} ${fraunces.variable}`}
    >
      <body className="grain">{children}</body>
    </html>
  );
}
