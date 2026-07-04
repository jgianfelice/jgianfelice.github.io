import type { Metadata } from 'next';
import PageShell, { SectionNav } from '@/components/PageShell';
import SectionMotif from '@/components/SectionMotif';
import EntryCard from '@/components/EntryCard';
import { loadProjects, sectionBySlug } from '@/lib/content';
import { projectExtras } from '@/lib/projectExtras';

export const revalidate = 300;

const meta = sectionBySlug('projects')!;

export const metadata: Metadata = {
  title: `${meta.title} — Justin Gianfelice`,
  description: meta.tagline,
};

// A quiet at-a-glance panel, pinned to the right of the list on wide screens.
// It echoes the market/quant language of the site without duplicating content.
function ProjectsAside({ count }: { count: number }) {
  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <div className="sticky top-32 rounded-xl border border-line bg-elevated/50 p-6">
        <div className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-accent">
          Index
        </div>
        <div className="mt-2 font-serif text-6xl font-light leading-none tabular-nums text-ink">
          {String(count).padStart(2, '0')}
        </div>
        <div className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-faint">
          projects
        </div>

        <div className="my-6 h-px w-full bg-line" />

        {/* small rising-signal emblem */}
        <svg viewBox="0 0 168 64" className="w-full" aria-hidden="true">
          <path d="M0 56h168M0 36h168M0 16h168" className="text-line" stroke="currentColor" strokeWidth={0.5} />
          <path
            d="M2 54 C28 50 40 34 60 38 S96 58 118 40 150 12 166 18"
            className="text-accent"
            stroke="currentColor"
            strokeWidth={1.5}
            fill="none"
          />
          <circle cx="60" cy="38" r="2.5" className="text-accent" fill="currentColor" />
          <circle cx="118" cy="40" r="2.5" className="text-accent" fill="currentColor" />
        </svg>

        <p className="mt-5 text-xs leading-relaxed text-muted">
          Research, tools, and studies. Built to run, not just to demo.
        </p>
      </div>
    </aside>
  );
}

export default async function ProjectsPage() {
  const projects = await loadProjects();

  return (
    <PageShell
      slug="projects"
      title={meta.title}
      tagline={meta.tagline}
      footer={<SectionNav slug="projects" />}
    >
      <SectionMotif slug="projects" />

      <div className="lg:flex lg:gap-16">
        <div className="min-w-0 flex-1">
          <div className="mb-1 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-faint lg:hidden">
            {projects.length} projects
          </div>
          {projects.map((p, i) => (
            <EntryCard
              key={p.id}
              href={`/projects/${p.id}/`}
              n={i + 1}
              title={p.title}
              blurb={p.blurb}
              tag={projectExtras(p.title)?.tag}
            />
          ))}
          <div className="border-t border-line" />
        </div>

        <ProjectsAside count={projects.length} />
      </div>
    </PageShell>
  );
}
