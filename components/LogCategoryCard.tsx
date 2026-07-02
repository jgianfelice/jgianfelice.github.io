import Link from 'next/link';

// A log track (thinking evolution, pattern analysis). Deliberately different
// from the learning grid: a wide row with a small timeline motif, the two
// tracks reading as a short ledger rather than a card wall.
export default function LogCategoryCard({
  href,
  index,
  title,
  description,
  count,
}: {
  href: string;
  index: string;
  title: string;
  description: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-6 border-t border-line py-8 transition-colors duration-300 hover:border-accent/50"
    >
      <svg
        viewBox="0 0 24 48"
        className="mt-1 h-12 w-6 shrink-0 text-accent/70"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M6 2v44" className="text-line" stroke="currentColor" />
        <circle cx="6" cy="8" r="2.2" />
        <circle cx="6" cy="24" r="2.2" />
        <circle cx="6" cy="40" r="2.2" />
        <path d="M11 8h9M11 24h7M11 40h8" className="text-faint" stroke="currentColor" />
      </svg>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs tabular-nums text-faint">{index}</span>
          <h3 className="font-mono text-xl text-ink transition-colors duration-300 group-hover:text-accent md:text-2xl">
            {title}
          </h3>
        </div>
        <p className="mt-2.5 max-w-prose text-sm leading-relaxed text-muted md:text-base">
          {description}
        </p>
        <p className="mt-3 font-mono text-xs uppercase tracking-label text-faint">
          {count} {count === 1 ? 'entry' : 'entries'}
        </p>
      </div>

      <span className="mt-1 font-mono text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent">
        →
      </span>
    </Link>
  );
}
