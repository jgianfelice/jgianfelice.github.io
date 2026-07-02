import Link from 'next/link';
import Glyph from './Glyph';

// A learning subtab as a card: glyph tile, title, one-line blurb, and the
// same quiet leader-arrow motion the rest of the site uses on hover.
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
    <Link
      href={href}
      className="group relative flex flex-col gap-4 rounded-lg border border-line bg-surface/40 p-6 transition-all duration-500 ease-editorial hover:border-accent/50 hover:bg-surface/70"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-base/60 text-accent transition-colors duration-500 group-hover:border-accent/40">
          <Glyph name={glyph} className="h-5 w-5" />
        </span>
        <span className="font-mono text-muted opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 -translate-x-1">
          →
        </span>
      </div>
      <div>
        <h3 className="font-mono text-lg text-ink transition-colors duration-300 group-hover:text-accent">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{blurb}</p>
      </div>
    </Link>
  );
}
