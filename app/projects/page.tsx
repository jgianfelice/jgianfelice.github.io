import type { Metadata } from 'next';
import PageShell, { SectionNav } from '@/components/PageShell';
import SectionMotif from '@/components/SectionMotif';
import ProjectsSearch from '@/components/ProjectsSearch';
import { loadProjects, sectionBySlug } from '@/lib/content';

export const revalidate = 300;

const meta = sectionBySlug('projects')!;

export const metadata: Metadata = {
  title: `${meta.title} — Justin Gianfelice`,
  description: meta.tagline,
};

export default async function ProjectsPage() {
  const projects = await loadProjects();
  const items = projects.map((p) => ({
    id: p.id,
    title: p.title,
    blurb: p.blurb,
  }));

  return (
    <PageShell
      slug="projects"
      title={meta.title}
      footer={<SectionNav slug="projects" />}
    >
      <SectionMotif slug="projects" />
      <ProjectsSearch projects={items} />
    </PageShell>
  );
}
