import type { ProjectExtras } from '@/lib/projectExtras';

function Spark({ data, caption }: { data: number[]; caption: string }) {
  const max = Math.max(...data, 0.0001);
  const W = 320;
  const H = 60;
  const gap = 3;
  const bw = (W - gap * (data.length - 1)) / data.length;
  return (
    <figure className="mt-9 max-w-sm">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
        {data.map((v, i) => {
          const bh = Math.max(2, (v / max) * (H - 4));
          return (
            <rect
              key={i}
              x={i * (bw + gap)}
              y={H - bh}
              width={bw}
              height={bh}
              rx={1}
              className={i === data.length - 1 ? 'text-accent' : 'text-accent/30'}
              fill="currentColor"
            />
          );
        })}
      </svg>
      <figcaption className="mt-2.5 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-faint">
        {caption}
      </figcaption>
    </figure>
  );
}

// A closing "Resources" block for a project: outbound links (buy / demo / live)
// as pills, plus any supplemental media.
export default function ProjectResources({ extras }: { extras: ProjectExtras }) {
  return (
    <section className="mt-16 border-t border-line pt-10">
      <div className="mb-6 flex items-center gap-3">
        <span className="h-px w-6 bg-accent/40" />
        <h2 className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.24em] text-accent">
          Resources
        </h2>
      </div>

      <div className="flex flex-wrap gap-3">
        {extras.links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] transition-colors ${
              l.kind === 'buy'
                ? 'border-ink bg-ink text-elevated hover:bg-ink/90'
                : 'border-line text-ink hover:border-ink/40'
            }`}
          >
            {l.label}
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </a>
        ))}
      </div>

      {extras.spark && <Spark data={extras.spark.data} caption={extras.spark.caption} />}

      {extras.image && (
        <div className="mt-9 overflow-hidden rounded-lg border border-line bg-elevated/50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={extras.image.src} alt={extras.image.alt} loading="lazy" className="w-full" />
        </div>
      )}
    </section>
  );
}
