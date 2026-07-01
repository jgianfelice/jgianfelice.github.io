import { notFound } from 'next/navigation';
import Prose from '@/components/Prose';
import EntryCard from '@/components/EntryCard';
import PageShell, { SectionNav } from '@/components/PageShell';
import { loadSection, SECTIONS, sectionBySlug } from '@/lib/content';

export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return SECTIONS.map((s) => ({ section: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { section: string };
}) {
  const meta = sectionBySlug(params.section);
  if (!meta) return {};
  return {
    title: `${meta.title} — Justin Gianfelice`,
    description: meta.tagline,
  };
}

export default async function SectionPage({
  params,
}: {
  params: { section: string };
}) {
  const meta = sectionBySlug(params.section);
  if (!meta) notFound();

  const s = await loadSection(meta.slug);
  if (!s) notFound();

  return (
    <PageShell
      eyebrow={`${meta.index} — ${meta.kind === 'index' ? 'Index' : 'Section'}`}
      title={meta.title}
      tagline={meta.tagline}
      footer={<SectionNav slug={meta.slug} />}
    >
      <Prose blocks={s.intro} />

      {s.entries.length > 0 && (
        <div className="mt-16">
          <div className="mb-1 font-mono text-xs uppercase tracking-label text-faint">
            {s.entries.length} {meta.slug === 'logs' ? 'entries' : 'projects'}
          </div>
          {s.entries.map((e, i) => (
            <EntryCard
              key={e.id}
              href={`/${meta.slug}/${e.id}`}
              n={i + 1}
              title={e.title}
              blurb={e.blurb}
            />
          ))}
          <div className="border-t border-line" />
        </div>
      )}
    </PageShell>
  );
}
