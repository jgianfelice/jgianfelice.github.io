import type { ProjectStanding as Standing } from '@/lib/projectExtras';

function Spark({ data, caption }: { data: number[]; caption: string }) {
  const max = Math.max(...data, 0.0001);
  const W = 320;
  const H = 56;
  const gap = 3;
  const bw = (W - gap * (data.length - 1)) / data.length;
  return (
    <figure className="mt-8 max-w-sm">
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

// A headline "where I finished, over how long" panel, shown at the top of a
// project. Glassy tile so it reads as part of the site's 3D/ice world.
export default function ProjectStanding({ standing }: { standing: Standing }) {
  return (
    <section className="tile mb-14 rounded-2xl p-6 md:p-8">
      {standing.note && (
        <p className="max-w-[52ch] text-sm leading-relaxed text-muted md:text-base">
          {standing.note}
        </p>
      )}
      <div className="mt-7 grid grid-cols-1 gap-7 sm:grid-cols-3">
        {standing.stats.map((s, i) => (
          <div key={i}>
            <div className="font-serif text-4xl font-light leading-none tracking-[-0.01em] text-ink md:text-5xl">
              {s.value}
            </div>
            <div className="mt-2.5 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-faint">
              {s.label}
            </div>
          </div>
        ))}
      </div>
      {standing.spark && <Spark data={standing.spark.data} caption={standing.spark.caption} />}
    </section>
  );
}
