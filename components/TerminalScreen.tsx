'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

// ── Terminal Screen ────────────────────────────────────────────────
// An HTML overlay sized and positioned to sit on the monitor's screen
// face. As you scroll, it switches "channels" — one per section — each
// a live financial/terminal readout. Crisp text and animation that a
// baked 3D texture could never match. Click the active channel to enter.

const CHANNELS = [
  { key: 'projects', href: '/projects', label: 'PROJECTS', code: 'CH 01' },
  { key: 'certifications', href: '/certifications', label: 'CERTIFICATIONS', code: 'CH 02' },
  { key: 'learning', href: '/learning', label: 'LEARNING & SKILLS', code: 'CH 03' },
  { key: 'logs', href: '/logs', label: 'EVOLUTION LOGS', code: 'CH 04' },
  { key: 'about', href: '/about', label: 'ABOUT', code: 'CH 05' },
];

function useScrollChannel() {
  const [idx, setIdx] = useState(-1); // -1 = hero/boot screen
  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      // First ~12% is the hero/boot screen, then 5 channels across the rest.
      if (p < 0.12) setIdx(-1);
      else {
        const c = Math.min(4, Math.floor(((p - 0.12) / 0.88) * 5));
        setIdx(c);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return idx;
}

// ── Channel visuals ──

function BootScreen() {
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    const seq = [
      '> initializing system...',
      '> loading market modules    [ok]',
      '> mounting data feeds       [ok]',
      '> decision engine online',
      '> ready.',
    ];
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setLines(seq.slice(0, i));
      if (i >= seq.length) clearInterval(iv);
    }, 420);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="font-mono text-[0.62rem] leading-relaxed text-accent/80">
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
      <span className="inline-block w-1.5 h-3 bg-accent/80 animate-pulse align-middle" />
    </div>
  );
}

function ProjectsChannel() {
  // A live equity curve drawing across the screen — the execution result.
  const [prog, setProg] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const loop = (t: number) => {
      setProg(Math.min(1, (t - start) / 2200));
      if (t - start < 2200) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const pts = Array.from({ length: 40 }, (_, i) => {
    const x = (i / 39) * 100;
    const base = 20 + i * 0.9;
    const noise = Math.sin(i * 0.7) * 6 + Math.sin(i * 0.3) * 4;
    return [x, 70 - (base + noise) * 0.55];
  });
  const shown = Math.floor(pts.length * prog);
  const path = pts.slice(0, shown).map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between font-mono text-[0.55rem] text-accent/60 mb-1">
        <span>EXEC P&amp;L · SMA-20 SPY</span>
        <span>2020–2024</span>
      </div>
      <svg viewBox="0 0 100 70" className="flex-1 w-full">
        <line x1="0" y1="60" x2="100" y2="60" stroke="#C8A14B" strokeWidth="0.2" opacity="0.3" />
        <path d={path} fill="none" stroke="#F0D080" strokeWidth="0.8" />
      </svg>
      <div className="font-mono text-[0.55rem] text-accent/70 flex gap-3 mt-1">
        <span>QUANT</span><span>· ML</span><span>· RESEARCH</span><span>· TOOLS</span>
      </div>
    </div>
  );
}

function CertChannel() {
  const certs = ['FMVA', 'CMSA', 'FPWMP', 'BMC', 'ESG', 'CSC'];
  const [lit, setLit] = useState(0);
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setLit(i);
      if (i >= certs.length) clearInterval(iv);
    }, 280);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="font-mono text-[0.6rem] space-y-1">
      <div className="text-accent/60 text-[0.55rem] mb-2">VERIFYING CREDENTIALS</div>
      {certs.map((c, i) => (
        <div key={c} className="flex justify-between items-center">
          <span className={i < lit ? 'text-ink' : 'text-faint'}>{c}</span>
          <span className={i < lit ? 'text-accent' : 'text-faint'}>
            {i < lit ? '● verified' : '○ ...'}
          </span>
        </div>
      ))}
    </div>
  );
}

function LearningChannel() {
  return (
    <div className="font-mono text-[0.58rem]">
      <div className="text-accent/60 text-[0.55rem] mb-2">ACTIVE DEVELOPMENT</div>
      <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-ink/80">
        {['Python', 'ML', 'Excel', 'Quant', 'Markets', 'Behaviour', 'Writing', 'Reading', 'Stats'].map((s) => (
          <span key={s} className="border border-line px-1 py-0.5 text-center text-[0.5rem]">{s}</span>
        ))}
      </div>
      <div className="mt-2 text-accent/50 text-[0.5rem] overflow-hidden whitespace-nowrap">
        reading: intelligent investor · psychology of money · big money thinks small...
      </div>
    </div>
  );
}

function LogsChannel() {
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    const seq = [
      '> consistency compounds.',
      '> execution separates more than ideas.',
      '> systems over outputs.',
      '> depth over breadth.',
    ];
    let i = 0;
    const iv = setInterval(() => {
      i = (i + 1) % (seq.length + 1);
      setLines(seq.slice(0, i));
    }, 700);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="font-mono text-[0.58rem] text-accent/80">
      <div className="text-accent/60 text-[0.55rem] mb-2">THINKING LOG · TAIL</div>
      {lines.map((l, i) => <div key={i}>{l}</div>)}
      <span className="inline-block w-1.5 h-3 bg-accent/80 animate-pulse align-middle" />
    </div>
  );
}

function AboutChannel() {
  return (
    <div className="font-mono text-[0.6rem] text-ink/80 space-y-1">
      <div className="text-accent/60 text-[0.55rem] mb-2">IDENTITY</div>
      <div>JUSTIN GIANFELICE</div>
      <div className="text-muted">Finance · McGill</div>
      <div className="text-muted">Markets · Data · Execution</div>
      <div className="mt-2 text-accent/70">→ building consistently</div>
    </div>
  );
}

const CHANNEL_VIEWS: Record<string, JSX.Element> = {
  projects: <ProjectsChannel />,
  certifications: <CertChannel />,
  learning: <LearningChannel />,
  logs: <LogsChannel />,
  about: <AboutChannel />,
};

export default function TerminalScreen() {
  const idx = useScrollChannel();
  const active = idx >= 0 ? CHANNELS[idx] : null;

  return (
    <div className="fixed inset-0 z-20 pointer-events-none flex items-center justify-center">
      {/* The screen sits where the 3D monitor face is — centered. */}
      <div className="relative" style={{ width: 'min(46vw, 520px)', height: 'min(28vw, 320px)' }}>
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          {/* Screen header bar */}
          <div className="absolute top-0 inset-x-0 flex justify-between items-center px-3 py-1.5 font-mono text-[0.5rem] text-accent/50 border-b border-accent/10">
            <span>{active ? active.code : 'BOOT'}</span>
            <span className="tracking-widest">{active ? active.label : 'SYSTEM'}</span>
            <span className="flex gap-1">
              <span className="w-1 h-1 rounded-full bg-accent/40" />
              <span className="w-1 h-1 rounded-full bg-accent/40" />
              <span className="w-1 h-1 rounded-full bg-accent/70" />
            </span>
          </div>
          {/* Channel body */}
          <div className="absolute inset-0 pt-7 pb-6 px-3">
            {active ? CHANNEL_VIEWS[active.key] : <BootScreen />}
          </div>
          {/* Enter prompt */}
          {active && (
            <Link
              href={active.href}
              className="pointer-events-auto absolute bottom-0 inset-x-0 px-3 py-1.5 font-mono text-[0.55rem] text-accent border-t border-accent/10 flex justify-between items-center hover:bg-accent/5 transition-colors"
            >
              <span>press ⏎ to enter {active.label.toLowerCase()}</span>
              <span>→</span>
            </Link>
          )}
          {/* Scanline sheen */}
          <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(200,161,75,0.02)_3px)]" />
        </div>
      </div>
    </div>
  );
}
