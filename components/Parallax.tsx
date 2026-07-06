'use client';

import { useEffect, useRef } from 'react';

// Foreground depth: the wrapped block leans a few pixels toward the cursor,
// opposite the background camera, so page content and the world separate into
// planes the way igloo's do. Pointer-only; touch and reduced-motion stay flat.
export default function Parallax({
  children,
  className = '',
  amount = 7,
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let px = 0;
    let py = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      px = (e.clientX / window.innerWidth) * 2 - 1;
      py = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(step);
    };
    const step = () => {
      cx += (px - cx) * 0.08;
      cy += (py - cy) * 0.08;
      el.style.transform = `translate3d(${(cx * amount).toFixed(2)}px, ${(cy * amount * 0.7).toFixed(2)}px, 0)`;
      raf =
        Math.abs(px - cx) > 0.001 || Math.abs(py - cy) > 0.001
          ? requestAnimationFrame(step)
          : 0;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [amount]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
