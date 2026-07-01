'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// ── Core Readout ───────────────────────────────────────────────────
// Sits beside the Terminal Core. Shows the readout for whichever face
// is currently front. Each section's panel: a label, a thin live
// data display, and an Enter link.

const FACES = [
  { key: 'projects', href: '/projects', index: '01', label: 'Projects', tag: 'BUILD · EXECUTE' },
  { key: 'certifications', href: '/certifications', index: '02', label: 'Certifications', tag: 'CREDENTIALS' },
  { key: 'learning', href: '/learning', index: '03', label: 'Learning & Skills', tag: 'DEVELOPMENT' },
  { key: 'logs', href: '/logs', index: '04', label: 'Evolution Logs', tag: 'THINKING' },
  { key: 'about', href: '/about', index: '05', label: 'About', tag: 'IDENTITY' },
];

function ProjectsReadout() {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const loop = (t: number) => {
      setProg(Math.min(1, (t - start) / 1800));
      if (t - start < 1800) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const pts = Array.from({ length: 40 }, (_, i) => {
    const x = (i / 39) * 100;
    const base = 18 + i * 0.9;
    const noise = Math.sin(i * 0.7) * 6 + Math.sin(i * 0.3) * 4;
    return [x, 50 - (base + noise) * 0.42];
  });
  const shown = Math.floor(pts.length * prog);
  const path = pts.slice(0, shown).map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  return (
    <div>
      <div className="font-mono text-[0.6rem] text-accent/60 mb-2">EXEC P&amp;L · SMA-20 SPY · 2020–2024</div>
      <svg viewBox="0 0 100 50" className="w-full h-20">
        <line x1="0" y1="44" x2="100" y2="44" stroke="#C8A14B" strokeWidth="0.3" opacity="0.3" />
        <path d={path} fill="none" stroke="#F0D080" strokeWidth="1" />
      </svg>
      <div className="font-mono text-[0.55rem] text-accent/50 mt-1">QUANT · ML · RESEARCH · TOOLS</div>
    </div>
  );
}

function CertReadout() {
  const certs = ['FMVA', 'CMSA', 'FPWMP', 'BMC', 'ESG', 'CSC'];
  const [lit, setLit] = useState(0);
  useEffect(() => {
    setLit(0);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setLit(i);
      if (i >= certs.length) clearInterval(iv);
    }, 220);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="font-mono text-[0.62rem] space-y-1">
      {certs.map((c, i) => (
        <div key={c} className="flex justify-between">
          <span className={i < lit ? 'text-ink' : 'text-faint'}>{c}</span>
          <span className={i < lit ? 'text-accent' : 'text-faint'}>{i < lit ? '● verified' : '○'}</span>
        </div>
      ))}
    </div>
  );
}

function LearningReadout() {
  return (
    <div className="font-mono text-[0.58rem]">
      <div className="grid grid-cols-3 gap-1 text-ink/80">
        {['Python', 'ML', 'Excel', 'Quant', 'Markets', 'Behaviour', 'Writing', 'Reading', 'Stats'].map((s) => (
          <span key={s} className="border border-line px-1 py-0.5 text-center text-[0.5rem]">{s}</span>
        ))}
      </div>
      <div className="mt-2 text-accent/50 text-[0.5rem] truncate">reading · intelligent investor · psychology of money...</div>
    </div>
  );
}

function LogsReadout() {
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    const seq = ['> consistency compounds.', '> execution separates more than ideas.', '> systems over outputs.', '> depth over breadth.'];
    let i = 0;
    const iv = setInterval(() => {
      i = (i + 1) % (seq.length + 1);
      setLines(seq.slice(0, i));
    }, 650);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="font-mono text-[0.58rem] text-accent/80 min-h-[5rem]">
      {lines.map((l, i) => <div key={i}>{l}</div>)}
      <span className="inline-block w-1.5 h-3 bg-accent/80 animate-pulse align-middle" />
    </div>
  );
}

function AboutReadout() {
  return (
    <div className="font-mono text-[0.6rem] text-ink/80 space-y-1">
      <div>JUSTIN GIANFELICE</div>
      <div className="text-muted">Finance · McGill</div>
      <div className="text-muted">Markets · Data · Execution</div>
      <div className="mt-2 text-accent/70">→ building consistently</div>
    </div>
  );
}

const READOUTS: Record<string, JSX.Element> = {
  projects: <ProjectsReadout />,
  certifications: <CertReadout />,
  learning: <LearningReadout />,
  logs: <LogsReadout />,
  about: <AboutReadout />,
};

export default function CoreReadout({ face }: { face: number }) {
  const f = FACES[face] ?? FACES[0];
  return (
    <div className="fixed inset-0 z-20 pointer-events-none flex items-center">
      <div className="container-editorial w-full">
        {/* Readout panel pinned left, beside the centered core */}
        <div key={f.key} className="max-w-xs animate-[fadeIn_0.6s_ease]">
          <div className="flex items-center gap-3 mb-3">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-mono text-xs text-faint">{f.index} / 05</span>
            <span className="font-mono text-[0.55rem] text-accent/50 tracking-widest">{f.tag}</span>
          </div>
          <h2 className="font-serif text-h2 text-ink mb-4">{f.label}</h2>
          <div className="border border-line/60 bg-surface/40 backdrop-blur-sm rounded p-3 mb-4">
            {READOUTS[f.key]}
          </div>
          <Link
            href={f.href}
            className="pointer-events-auto inline-flex items-center gap-2 text-sm text-muted hover:text-accent transition-colors"
          >
            <span className="link-underline">Enter {f.label}</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
