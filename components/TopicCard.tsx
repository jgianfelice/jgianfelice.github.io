import Link from 'next/link';
import Glyph from './Glyph';
import Tilt from './Tilt';

// A learning subtab as a glass tile that tilts toward the cursor in 3D — a
// glyph tile up top, a Fraunces title, a one-line blurb, and a leader arrow on
// hover. The tilt ties the grid to the crystal's dimensional world.
export default function TopicCard({
  href,
  title,
  blurb,
  glyph,
}: {
  href: string;
  title: string;
  blurb: string;
  glyph: string;
}) {
  return (
    <Link href={href} className="group block h-full">
      <Tilt className="tile flex h-full flex-col justify-between gap-8 p-6 transition-colors duration-500 group-hover:border-ink/20 md:p-7">
        <div className="flex items-start justify-between" style={{ transform: 'translateZ(24px)' }}>
          <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-base/70 text-ink shadow-sm transition-colors duration-500 group-hover:border-accent/40 group-hover:text-accent">
            <Glyph name={glyph} className="h-5 w-5" />
          </span>
          <span className="-translate-x-1 font-mono text-muted opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
            →
          </span>
        </div>
        <div style={{ transform: 'translateZ(14px)' }}>
          <h3 className="font-serif text-xl font-light leading-tight text-ink md:text-2xl">
            {title}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-ink/75">{blurb}</p>
        </div>
      </Tilt>
    </Link>
  );
}
