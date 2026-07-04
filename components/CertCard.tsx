import type { CertItem } from '@/lib/content';
import Tilt from './Tilt';

// One credential as a ledger row: issuer, name, and issue date sit on the LEFT,
// aligned with the page column; the actual certificate image sits on the RIGHT,
// framed like a mounted plate. On narrow screens the two stack, text first.
export default function CertCard({ cert }: { cert: CertItem }) {
  return (
    <article className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-accent">
          {cert.issuer}
        </p>
        <h3 className="mt-2.5 font-serif text-xl font-light leading-[1.15] text-ink md:text-[1.55rem]">
          {cert.name}
        </h3>
        <p className="mt-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-faint">
          {cert.date}
        </p>
        <p className="mt-3.5 max-w-[46ch] text-sm leading-relaxed text-muted">
          {cert.blurb}
        </p>
      </div>

      <Tilt max={9} className="tile shrink-0 self-start overflow-hidden p-2">
        {/* Static export with unoptimized images — a plain img keeps arbitrary
            badge aspect ratios crisp inside the fixed frame. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cert.image}
          alt={`${cert.name} certificate`}
          loading="lazy"
          className="h-28 w-28 rounded-md object-contain p-2 md:h-[8.5rem] md:w-[8.5rem]"
        />
      </Tilt>
    </article>
  );
}
