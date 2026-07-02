import type { Metadata } from 'next';
import PageShell, { SectionNav } from '@/components/PageShell';
import SectionMotif from '@/components/SectionMotif';
import EntryCard from '@/components/EntryCard';
import { loadProjects, sectionBySlug, SECTIONS } from '@/lib/content';

export const revalidate = 300;

const meta = sectionBySlug('projects')!;

export const metadata: Metadata = {
  title: `${meta.title} — Justin Gianfelice`,
  description: meta.tagline,
};

export default async function ProjectsPage() {
  const projects = await loadProjects();

  return (
    <PageShell
      eyebrow={`${meta.index} / ${String(SECTIONS.length).padStart(2, '0')}`}
      title={meta.title}
      tagline={meta.tagline}
      footer={<SectionNav slug="projects" />}
    >
      <SectionMotif slug="projects" />
      <div className="mb-1 font-mono text-xs uppercase tracking-label text-faint">
        {projects.length} projects
      </div>
      {projects.map((p, i) => (
        <EntryCard
          key={p.id}
          href={`/projects/${p.id}/`}
          n={i + 1}
          title={p.title}
          blurb={p.blurb}
        />
      ))}
      <div className="border-t border-line" />
    </PageShell>
  );
}
