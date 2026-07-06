'use client';

import { useEffect, useRef, useState } from 'react';

const POOL = '#/\\<>[]{}+=*:.-';

// igloo-style decrypt-in: characters resolve left to right out of a glyph
// scramble. SSR renders the final text (no layout shift, no SEO cost); the
// scramble plays once on mount.
export default function Scramble({
  text,
  className = '',
  duration = 900,
  delay = 0,
}: {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
}) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !text) return;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t + delay;
      const p = Math.min(1, Math.max(0, (t - start) / duration));
      const solid = Math.floor(p * text.length);
      let s = text.slice(0, solid);
      for (let i = solid; i < text.length; i++) {
        const c = text[i];
        s += c === ' ' ? ' ' : POOL[(Math.random() * POOL.length) | 0];
      }
      setOut(s);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [text, duration, delay]);

  return (
    <span className={className} aria-label={text}>
      {out}
    </span>
  );
}
