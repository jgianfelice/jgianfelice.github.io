import Link from 'next/link';
import Glyph from './Glyph';

// A learning subtab as a card: a glyph tile up top, a Fraunces title, a
// one-line blurb, and a leader arrow that arrives on hover. Lifts a hair on
// hover so the grid feels tactile rather than flat.
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
      className="group relative flex flex-col justify-between gap-8 rounded-xl border border-line bg-elevated/50 p-6 transition-all duration-500 ease-editorial hover:-translate-y-0.5 hover:border-ink/20 hover:bg-elevated md:p-7"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-base/70 text-ink transition-colors duration-500 group-hover:border-accent/40 group-hover:text-accent">
          <Glyph name={glyph} className="h-5 w-5" />
        </span>
        <span className="-translate-x-1 font-mono text-muted opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
          →
        </span>
      </div>
      <div>
        <h3 className="font-serif text-xl font-light leading-tight text-ink md:text-2xl">
          {title}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-muted">{blurb}</p>
      </div>
    </Link>
  );
}
