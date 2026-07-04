'use client';

import { useState } from 'react';
import Link from 'next/link';
import Nav from './Nav';
import MarketSurface from './MarketSurface';
import type { Block, HomeContent } from '@/lib/notion';

// ── The Home Experience ────────────────────────────────────────────
// There is no "page" here in the usual sense. The WebGL world IS the
// site: the candlestick rally builds itself, the camera flies up the
// climb, and each section's title rises straight out of the chart as
// you reach it. The HTML layer is almost nothing — a small wordmark
// pinned top-left, a single context-aware CTA, and invisible scroll
// track that drives the camera. Everything you read lives in the scene.

function firstPara(blocks: Block[]): string {
  const p = blocks.find((b) => b.type === 'p') as any;
  return p ? (p.text || []).map((r: any) => r.content).join('') : '';
}

export default function Experience({ content }: { content: HomeContent }) {
  // 0 = hero, 1..5 = the five sections.
  const [scene, setScene] = useState(0);
  // A hero face tapped on a touch device (which can't hover) — drives the
  // mobile "preview + enter" card below.
  const [heroPick, setHeroPick] = useState<number | null>(null);

  const sections = [
    {
      href: '/projects',
      index: '01',
      title: 'Projects',
      desc:
        content.projectsIntro ||
        'Quant research, machine learning, and the tools built to execute on markets.',
    },
    {
      href: '/certifications',
      index: '02',
      title: 'Certifications',
      desc:
        firstPara(content.certifications) ||
        'Credentials across financial modeling, markets, and wealth management.',
    },
    {
      href: '/learning',
      index: '03',
      title: 'Learning',
      desc:
        firstPara(content.learning) ||
        'A standing record of what I am studying, reading, and sharpening.',
    },
    {
      href: '/logs',
      index: '04',
      title: 'Logs',
      desc:
        firstPara(content.logs) ||
        'Thinking in the open: the principles and decisions that compound.',
    },
    {
      href: '/about',
      index: '05',
      title: 'About',
      desc:
        firstPara(content.about) ||
        'Finance at McGill. Markets, data, and disciplined execution.',
    },
  ];

  const active = scene >= 1 && scene <= 5 ? sections[scene - 1] : null;

  return (
    <>
      <Nav />

      {/* The world — fixed, full-bleed, carries every word you read. */}
      <MarketSurface
        sections={sections}
        onSceneChange={setScene}
        onHeroPick={setHeroPick}
      />

      {/* Wordmark, pinned top-left and present from the very first frame —
          IBM Plex Mono, uppercase, the way igloo sets its marque. */}
      <div className="fixed top-6 left-6 z-30 pointer-events-auto select-none animate-[fadeIn_900ms_ease-out_both]">
        <Link href="/" className="block leading-[1.2]">
          <span className="block font-mono text-[11px] uppercase tracking-label text-ink/90">
            Justin
          </span>
          <span className="block font-mono text-[11px] uppercase tracking-label text-ink/90">
            Gianfelice
          </span>
        </Link>
      </div>

      {/* One context-aware control. It points at whatever the camera is
          looking at — so navigation lives with the visual, not beside it. */}
      <div className="fixed bottom-8 inset-x-0 z-30 flex justify-center pointer-events-none">
        <Link
          href={active?.href || '/projects'}
          className={`pointer-events-auto inline-flex items-center gap-2 font-mono text-xs tracking-label uppercase text-muted hover:text-accent transition-all duration-500 ${
            active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <span className="link-underline">Enter {active?.title}</span>
          <span>→</span>
        </Link>
      </div>

      {/* Touch preview — because you can't hover a crystal on a phone: tap a
          face to raise its section here, then tap Enter to fly there. Mobile
          only; the desktop hover→click flow is untouched. */}
      {heroPick !== null && sections[heroPick] && (
        <div className="fixed inset-x-0 bottom-0 z-40 p-4 pointer-events-auto md:hidden animate-[fadeIn_300ms_ease-out_both]">
          <div className="mx-auto max-w-sm rounded-xl border border-line bg-surface/95 p-5 backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div className="font-mono text-xs uppercase tracking-label text-accent">
                {sections[heroPick].index} / {String(sections.length).padStart(2, '0')}
              </div>
              <button
                onClick={() => setHeroPick(null)}
                aria-label="Dismiss preview"
                className="-mr-1 -mt-1 px-1 font-mono text-lg leading-none text-muted hover:text-ink"
              >
                ×
              </button>
            </div>
            <h2 className="mt-2 font-mono text-xl text-ink">
              {sections[heroPick].title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {sections[heroPick].desc}
            </p>
            <Link
              href={sections[heroPick].href}
              className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-label text-accent"
            >
              <span className="link-underline">Enter {sections[heroPick].title}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      )}

      {/* Scroll cue, only at the very top — wordless, so the hero stays
          purely the object. Just a quiet pulse downward. */}
      <div
        className={`fixed bottom-8 inset-x-0 z-20 flex flex-col items-center text-faint transition-opacity duration-700 pointer-events-none ${
          scene === 0 && heroPick === null ? 'opacity-70' : 'opacity-0'
        }`}
      >
        <span className="inline-block animate-bounce not-italic text-lg">↓</span>
      </div>

      {/* Invisible scroll track — six viewports drive the camera flight:
          hero · five sections. Click-through, so the hero crystal beneath
          stays hoverable as a directory. No visible HTML content. */}
      <main className="relative z-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <section key={i} className="h-screen" aria-hidden />
        ))}
      </main>
    </>
  );
}
