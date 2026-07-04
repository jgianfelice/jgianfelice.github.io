'use client';

import { useRef } from 'react';

// Wraps content in a surface that tilts in 3D toward the cursor — a small,
// tactile bit of depth that ties flat panels to the crystal's 3D world.
// Pointer-only (touch keeps it flat), and respects reduced-motion via CSS.
export default function Tilt({
  children,
  className = '',
  max = 6,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`[transform-style:preserve-3d] [transition:transform_250ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:!transform-none ${className}`}
    >
      {children}
    </div>
  );
}
