import Link from 'next/link';

// A single editorial list-row for an entry (a project, a log). Reads as a
// ledger line: number, title, one-line blurb, and a leader arrow that
// nudges on hover — the same quiet motion language as the crystal labels.
export default function EntryCard({
  href,
  n,
  title,
  blurb,
}: {
  href: string;
  n: number;
  title: string;
  blurb?: string;
}) {
  return (
    <Link
      href={href}
      className="group block border-t border-line py-7 transition-colors duration-300 hover:border-accent/50"
    >
      <div className="flex items-baseline gap-5">
        <span className="font-mono text-xs tabular-nums text-faint">
          {String(n).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-mono text-lg text-ink transition-colors duration-300 group-hover:text-accent md:text-xl">
            {title}
          </h3>
          {blurb && (
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">
              {blurb}
            </p>
          )}
        </div>
        <span className="font-mono text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent">
          →
        </span>
      </div>
    </Link>
  );
}
