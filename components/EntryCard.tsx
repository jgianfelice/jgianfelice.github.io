import Link from 'next/link';

// A single editorial list-row for an entry (a project, a log). Reads as a
// contents line: a faint margin index, a Fraunces title, one-line blurb, and a
// leader arrow that nudges on hover — the quiet motion of the crystal labels.
export default function EntryCard({
  href,
  n,
  title,
  blurb,
  tag,
}: {
  href: string;
  n: number;
  title: string;
  blurb?: string;
  tag?: string;
}) {
  return (
    <Link
      href={href}
      className="group block border-t border-line py-8 transition-colors duration-500 hover:border-ink/25"
    >
      <div className="flex items-baseline gap-5 md:gap-7">
        <span className="mt-1 font-mono text-[0.68rem] tabular-nums tracking-wider text-faint transition-colors duration-300 group-hover:text-accent">
          {String(n).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-serif text-[1.55rem] font-light leading-[1.08] tracking-[-0.01em] text-ink md:text-[1.8rem]">
              {title}
            </h3>
            {tag && (
              <span className="translate-y-[-2px] rounded-full border border-line px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent">
                {tag}
              </span>
            )}
          </div>
          {blurb && (
            <p className="mt-2.5 max-w-[52ch] text-sm leading-relaxed text-muted">
              {blurb}
            </p>
          )}
        </div>
        <span className="mt-1 shrink-0 font-mono text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent">
          →
        </span>
      </div>
    </Link>
  );
}
