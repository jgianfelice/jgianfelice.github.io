'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from './Nav';
import Parallax from './Parallax';
import MarketSurface from './MarketSurface';
import type { Block, HomeContent } from '@/lib/notion';

// igloo-style boot loader: a glowing strip of =+- glyphs scrambling in the
// empty field until the WebGL world reports ready, then a clean fade.
function GlyphLoader({ done }: { done: boolean }) {
  const [glyphs, setGlyphs] = useState('=--=+==---');
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (done) return;
    const POOL = '=+-';
    const id = window.setInterval(() => {
      let s = '';
      for (let i = 0; i < 10; i++) s += POOL[(Math.random() * POOL.length) | 0];
      setGlyphs(s);
    }, 90);
    return () => window.clearInterval(id);
  }, [done]);

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setGone(true), 750);
    return () => window.clearTimeout(t);
  }, [done]);

  if (gone) return null;
  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-base transition-opacity duration-700 ${
        done ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <span
        className="font-mono text-xl tracking-[0.3em] text-ink/80"
        style={{ textShadow: '0 0 14px rgba(255,255,255,0.9), 0 0 3px rgba(255,255,255,0.8)' }}
      >
        {glyphs}
      </span>
    </div>
  );
}

// ── The Home Experience ────────────────────────────────────────────
// The homepage IS the hero crystal — the chart sealed in ice, and a
// directory in one object. Its real faces carry the sections (Projects on
// the centre face, the rest ringing it); hovering or tapping a face reveals
// its name, and one Explore control links straight to whichever section is
// in focus. No scroll journey, no flight — the object is simply there.

function firstPara(blocks: Block[]): string {
  const p = blocks.find((b) => b.type === 'p') as any;
  return p ? (p.text || []).map((r: any) => r.content).join('') : '';
}

export default function Experience({ content }: { content: HomeContent }) {
  // Boot: hold the loader until the world's first frame AND a short beat, with
  // a 6s failsafe so the site can never stay behind the curtain.
  const [worldReady, setWorldReady] = useState(false);
  const [minHold, setMinHold] = useState(false);
  // Which section face is in focus (hover on desktop, tap on mobile). Projects
  // (the centre face, index 0) is the default.
  const [focused, setFocused] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setMinHold(true), 900);
    const failsafe = window.setTimeout(() => setWorldReady(true), 6000);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(failsafe);
    };
  }, []);

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

  const onFocus = useCallback((i: number | null) => setFocused(i ?? 0), []);
  const current = sections[focused] ?? sections[0];

  return (
    <>
      <Nav />

      {/* Boot sequence — glowing glyphs until the world is live. */}
      <GlyphLoader done={worldReady && minHold} />

      {/* The world — a single hero crystal, its faces the site's directory. */}
      <MarketSurface
        sections={sections}
        onFocus={onFocus}
        onReady={() => setWorldReady(true)}
      />

      {/* Wordmark, pinned top-left from the first frame. */}
      <div className="fixed top-6 left-6 z-30 pointer-events-auto select-none animate-[fadeIn_900ms_ease-out_both]">
        <Parallax amount={5}>
          <Link href="/" className="block leading-[1.2]">
            <span className="block font-mono text-[11px] uppercase tracking-label text-ink/90">
              Justin
            </span>
            <span className="block font-mono text-[11px] uppercase tracking-label text-ink/90">
              Gianfelice
            </span>
          </Link>
        </Parallax>
      </div>

      {/* Phones can't fit the in-world face labels, so the focused section's
          name surfaces here instead. */}
      <div
        key={current.title}
        className="fixed inset-x-0 bottom-24 z-20 px-8 text-center pointer-events-none md:hidden animate-[fadeIn_400ms_ease-out_both]"
      >
        <div className="font-serif text-4xl font-light tracking-[-0.01em] text-ink">
          {current.title}
        </div>
      </div>

      {/* One Explore control — links straight to whatever face is in focus. */}
      <div className="fixed bottom-8 inset-x-0 z-30 flex justify-center pointer-events-none">
        <Link
          href={current.href}
          className="pointer-events-auto inline-flex items-center gap-2 font-mono text-xs uppercase tracking-label text-muted transition-colors duration-300 hover:text-accent"
        >
          <span className="link-underline">Explore {current.title}</span>
          <span>→</span>
        </Link>
      </div>
    </>
  );
}
