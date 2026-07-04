import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Prose from '@/components/Prose';
import PageShell, { BackHome } from '@/components/PageShell';
import ProjectResources from '@/components/ProjectResources';
import { loadProject, projectIds, sectionBySlug } from '@/lib/content';
import { projectExtras } from '@/lib/projectExtras';

export const revalidate = 300;
export const dynamicParams = false;

const meta = sectionBySlug('projects')!;
const link =
  'font-mono text-xs uppercase tracking-label text-muted transition-colors hover:text-accent';

export async function generateStaticParams() {
  const ids = await projectIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const p = await loadProject(params.id);
  return p ? { title: `${p.title} — Justin Gianfelice` } : {};
}

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const p = await loadProject(params.id);
  if (!p) notFound();
  const extras = projectExtras(p.title);

  return (
    <PageShell
      slug="projects"
      eyebrow={
        <Link href="/projects/" className={link}>
          ← {meta.title}
        </Link>
      }
      title={p.title}
      footer={
        <div className="flex items-center justify-between gap-4">
          <Link href="/projects/" className={link}>
            All {meta.title}
          </Link>
          <BackHome />
        </div>
      }
    >
      <Prose blocks={p.blocks} />
      {extras && <ProjectResources extras={extras} />}
    </PageShell>
  );
}
