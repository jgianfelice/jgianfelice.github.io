'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from './Nav';
import Parallax from './Parallax';
import MarketSurface, { SECTION_S } from './MarketSurface';
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
  // Boot: the loader holds until the world's first frame AND a short beat,
  // so the glyphs always read as an intentional moment, never a flash. A
  // failsafe clears it after 6s regardless — if WebGL ever refuses to start
  // on some device, the site must never stay behind the curtain.
  const [worldReady, setWorldReady] = useState(false);
  const [minHold, setMinHold] = useState(false);
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

  const active = scene >= 1 && scene <= 5 ? sections[scene - 1] : null;

  // Fly the camera down to a section — the same smooth scroll the desktop
  // face-click does. The mobile preview card uses this so a tap plays the
  // flight instead of hard-navigating to the page.
  const flyTo = (i: number) => {
    setHeroPick(null);
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: SECTION_S[i] * max, behavior: 'smooth' });
  };

  return (
    <>
      <Nav />

      {/* Boot sequence — glowing glyphs until the world is live. */}
      <GlyphLoader done={worldReady && minHold} />

      {/* The world — fixed, full-bleed, carries every word you read. */}
      <MarketSurface
        sections={sections}
        onSceneChange={setScene}
        onHeroPick={setHeroPick}
        onReady={() => setWorldReady(true)}
      />

      {/* Wordmark, pinned top-left and present from the very first frame —
          CMU Typewriter, uppercase, the way igloo sets its marque. */}
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

      {/* Phones can't fit the in-world side titles, so the section name
          surfaces here instead — an HTML title card floating over the scene,
          keyed so it rises fresh at every station. */}
      {active && (
        <div
          key={active.title}
          className="fixed inset-x-0 bottom-24 z-20 px-8 text-center pointer-events-none md:hidden animate-[fadeIn_600ms_ease-out_both]"
        >
          <div className="font-serif text-4xl font-light tracking-[-0.01em] text-ink">
            {active.title}
          </div>
          <p className="mx-auto mt-2.5 max-w-[34ch] text-[0.8rem] leading-relaxed text-muted [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
            {active.desc}
          </p>
        </div>
      )}

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
          face to raise its section here, then tap Explore to PLAY the camera
          flight down to it (same as a desktop click), not jump pages. Mobile
          only; the desktop hover→click flow is untouched. */}
      {heroPick !== null && sections[heroPick] && (
        <div className="fixed inset-x-0 bottom-0 z-40 p-4 pointer-events-auto md:hidden animate-[fadeIn_300ms_ease-out_both]">
          <div className="tile mx-auto max-w-sm p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="font-mono text-xs uppercase tracking-label text-accent">
                {sections[heroPick].title}
              </div>
              <button
                onClick={() => setHeroPick(null)}
                aria-label="Dismiss preview"
                className="-mr-1 -mt-1 px-1 font-mono text-lg leading-none text-muted hover:text-ink"
              >
                ×
              </button>
            </div>
            <p className="mt-2.5 text-sm leading-relaxed text-muted">
              {sections[heroPick].desc}
            </p>
            <button
              onClick={() => flyTo(heroPick)}
              className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-label text-accent"
            >
              <span className="link-underline">Explore {sections[heroPick].title}</span>
              <span>↓</span>
            </button>
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
