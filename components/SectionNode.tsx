'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function SectionNode({
  href,
  index,
  title,
  desc,
}: {
  href: string;
  index: string;
  title: string;
  desc: string;
  align?: 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [-40, 0]);

  return (
    <section ref={ref} className="h-screen flex items-center container-editorial">
      {/* Compact, hard-left so the centered terminal stays the focus */}
      <motion.div style={{ opacity, x }} className="max-w-xs">
        <div className="flex items-center gap-3 mb-3">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="font-mono text-xs text-faint">{index} / 05</span>
        </div>
        <Link href={href} className="group inline-block">
          <h2 className="font-serif text-h2 text-ink group-hover:text-accent transition-colors duration-500">
            {title}
          </h2>
          <p className="mt-2 text-muted text-sm leading-relaxed">{desc}</p>
          <span className="inline-flex items-center gap-2 mt-4 text-xs text-muted group-hover:text-accent transition-colors">
            <span className="link-underline">Enter</span>
            <span className="group-hover:translate-x-1 transition-transform duration-500">→</span>
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
