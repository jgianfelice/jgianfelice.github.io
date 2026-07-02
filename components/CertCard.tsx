import type { Cert } from '@/lib/content';

// One credential: the actual certificate image framed beside its name, date,
// and description. The prose layout is unchanged — issuer heading above,
// credentials stacked below — the image is added, nothing is reordered. The
// "Name — Date" dash is a divider and is preserved on purpose.
export default function CertCard({ cert }: { cert: Cert }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
      <div className="shrink-0 overflow-hidden rounded-md border border-line bg-base/60">
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
      <div className="min-w-0 flex-1">
        <h3 className="font-mono text-base leading-snug text-ink md:text-lg">
          {cert.name}
          <span className="text-faint"> — {cert.date}</span>
        </h3>
        <p className="mt-2.5 max-w-prose text-sm leading-relaxed text-muted">
          {cert.blurb}
        </p>
      </div>
    </div>
  );
}
