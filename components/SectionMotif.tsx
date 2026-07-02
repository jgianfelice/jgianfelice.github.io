import type { SectionSlug } from '@/lib/content';

// A quiet, distinct instrument-trace band per section. Thin cool-blue strokes
// on the crystal palette — enough to give each page its own visual signature
// without competing with the content or touching the list layouts.
const motifs: Record<SectionSlug, React.ReactNode> = {
  // Plotted equity/signal curve over a faint grid.
  projects: (
    <>
      <path d="M0 60h1200M0 40h1200M0 20h1200" className="text-line" stroke="currentColor" strokeWidth={0.5} />
      <path
        d="M0 62 C120 58 180 40 260 44 S420 68 520 50 640 18 760 30 900 60 1010 40 1140 14 1200 20"
        className="text-accent"
        stroke="currentColor"
        strokeWidth={1.5}
        fill="none"
      />
      <circle cx="520" cy="50" r="2.5" className="text-ice" fill="currentColor" />
      <circle cx="760" cy="30" r="2.5" className="text-ice" fill="currentColor" />
    </>
  ),
  // Overlapping credential plates.
  certifications: (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <rect
          key={i}
          x={40 + i * 230}
          y={18 + (i % 2) * 6}
          width="150"
          height="44"
          rx="3"
          className={i % 2 ? 'text-accent-dim' : 'text-accent'}
          stroke="currentColor"
          strokeWidth={1}
          fill="none"
        />
      ))}
      <path d="M0 76h1200" className="text-line" stroke="currentColor" strokeWidth={0.5} />
    </>
  ),
  // Node lattice.
  learning: (
    <>
      {Array.from({ length: 7 }).map((_, i) => (
        <g key={i}>
          <circle cx={90 + i * 170} cy={i % 2 ? 26 : 54} r="3" className="text-accent" fill="currentColor" />
          {i < 6 && (
            <path
              d={`M${90 + i * 170} ${i % 2 ? 26 : 54} L${90 + (i + 1) * 170} ${(i + 1) % 2 ? 26 : 54}`}
              className="text-accent-dim"
              stroke="currentColor"
              strokeWidth={1}
            />
          )}
        </g>
      ))}
    </>
  ),
  // Timeline with marked dates.
  logs: (
    <>
      <path d="M0 40h1200" className="text-line" stroke="currentColor" strokeWidth={1} />
      {Array.from({ length: 13 }).map((_, i) => (
        <path
          key={i}
          d={`M${60 + i * 90} 32v16`}
          className="text-faint"
          stroke="currentColor"
          strokeWidth={1}
        />
      ))}
      {[3, 7, 10].map((i) => (
        <circle key={i} cx={60 + i * 90} cy="40" r="4" className="text-ice" fill="currentColor" />
      ))}
    </>
  ),
  // Plotted coordinate point.
  about: (
    <>
      <path d="M40 70V10M40 70h1120" className="text-line" stroke="currentColor" strokeWidth={1} />
      <path d="M600 12v56M42 40h1116" className="text-accent-dim" stroke="currentColor" strokeWidth={0.5} strokeDasharray="3 5" />
      <circle cx="600" cy="40" r="4" className="text-accent" fill="currentColor" />
      <circle cx="600" cy="40" r="10" className="text-accent" stroke="currentColor" strokeWidth={1} fill="none" />
    </>
  ),
};

export default function SectionMotif({ slug }: { slug: SectionSlug }) {
  return (
    <div className="mb-12 overflow-hidden opacity-70" aria-hidden="true">
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        className="h-16 w-full md:h-20"
      >
        {motifs[slug]}
      </svg>
    </div>
  );
}
