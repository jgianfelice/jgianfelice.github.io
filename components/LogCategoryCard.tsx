import Link from 'next/link';

// A log track (thinking evolution, pattern analysis). Deliberately different
// from the learning grid: a wide row with a small timeline motif and a Fraunces
// title, the two tracks reading as a short ledger rather than a card wall.
export default function LogCategoryCard({
  href,
  title,
  description,
  count,
}: {
  href: string;
  title: string;
  description: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-6 border-t border-line py-9 transition-colors duration-500 hover:border-ink/25"
    >
      <svg
        viewBox="0 0 24 52"
        className="mt-1.5 h-14 w-6 shrink-0 text-accent"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M6 2v48" className="text-line" stroke="currentColor" />
        <circle cx="6" cy="8" r="2.4" className="transition-transform duration-500 group-hover:translate-x-0" />
        <circle cx="6" cy="26" r="2.4" fill="currentColor" />
        <circle cx="6" cy="44" r="2.4" />
        <path d="M11 8h9M11 26h6M11 44h8" className="text-faint" stroke="currentColor" />
      </svg>

      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-[1.7rem] font-light leading-[1.05] tracking-[-0.01em] text-ink md:text-3xl">
          {title}
        </h3>
        <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-muted md:text-base">
          {description}
        </p>
        <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-faint">
          {count} {count === 1 ? 'entry' : 'entries'}
        </p>
      </div>

      <span className="mt-1.5 shrink-0 font-mono text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent">
        →
      </span>
    </Link>
  );
}
