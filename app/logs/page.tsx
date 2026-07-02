import type { Metadata } from 'next';
import PageShell, { SectionNav } from '@/components/PageShell';
import SectionMotif from '@/components/SectionMotif';
import LogCategoryCard from '@/components/LogCategoryCard';
import { LOG_CATEGORIES, loadLogCategory, sectionBySlug, SECTIONS } from '@/lib/content';

export const revalidate = 300;

const meta = sectionBySlug('logs')!;

export const metadata: Metadata = {
  title: `${meta.title} — Justin Gianfelice`,
  description: meta.tagline,
};

export default async function LogsPage() {
  const counts = await Promise.all(
    LOG_CATEGORIES.map(async (c) => (await loadLogCategory(c.slug))?.entries.length ?? 0)
  );

  return (
    <PageShell
      eyebrow={`${meta.index} / ${String(SECTIONS.length).padStart(2, '0')}`}
      title={meta.title}
      tagline={meta.tagline}
      footer={<SectionNav slug="logs" />}
    >
      <SectionMotif slug="logs" />
      <div>
        {LOG_CATEGORIES.map((c, i) => (
          <LogCategoryCard
            key={c.slug}
            href={`/logs/${c.slug}/`}
            index={String(i + 1).padStart(2, '0')}
            title={c.title}
            description={c.description}
            count={counts[i]}
          />
        ))}
        <div className="border-t border-line" />
      </div>
    </PageShell>
  );
}
