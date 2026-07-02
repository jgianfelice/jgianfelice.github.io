import type { CertItem } from '@/lib/content';

// One credential as a ledger row: the issuer, name, and issue date sit on the
// LEFT, aligned with the page's column; the actual certificate image sits on
// the RIGHT. On narrow screens the two stack, text first. The "Name — Date"
// dash is a divider and is preserved on purpose.
export default function CertCard({ cert }: { cert: CertItem }) {
  return (
    <article className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
      <div className="min-w-0 flex-1">
        <p className="font-mono text-xs uppercase tracking-label text-accent">
          {cert.issuer}
        </p>
        <h3 className="mt-2 font-mono text-base leading-snug text-ink md:text-lg">
          {cert.name}
          <span className="text-faint"> — {cert.date}</span>
        </h3>
        <p className="mt-2.5 max-w-prose text-sm leading-relaxed text-muted">
          {cert.blurb}
        </p>
      </div>

      <div className="shrink-0 self-start overflow-hidden rounded-md border border-line bg-base/60">
        {/* Static export with unoptimized images — a plain img keeps arbitrary
            badge aspect ratios crisp inside the fixed frame. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cert.image}
          alt={`${cert.name} certificate`}
          loading="lazy"
          className="h-28 w-28 object-contain p-2 md:h-32 md:w-32"
        />
      </div>
    </article>
  );
}
