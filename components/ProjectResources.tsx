import type { ProjectExtras } from '@/lib/projectExtras';

// A closing "Resources" block for a project: outbound links (buy / demo /
// external) as pills, plus any supplemental media.
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

      {extras.image && (
        <div className="tile mt-9 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={extras.image.src} alt={extras.image.alt} loading="lazy" className="w-full" />
        </div>
      )}
    </section>
  );
}
