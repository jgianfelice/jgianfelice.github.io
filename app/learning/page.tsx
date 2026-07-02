import type { Metadata } from 'next';
import PageShell, { SectionNav } from '@/components/PageShell';
import SectionMotif from '@/components/SectionMotif';
import TopicCard from '@/components/TopicCard';
import { LEARNING_TOPICS, sectionBySlug, SECTIONS } from '@/lib/content';

export const revalidate = 300;

const meta = sectionBySlug('learning')!;

export const metadata: Metadata = {
  title: `${meta.title} — Justin Gianfelice`,
  description: meta.tagline,
};

export default function LearningPage() {
  return (
    <PageShell
      eyebrow={`${meta.index} / ${String(SECTIONS.length).padStart(2, '0')}`}
      title={meta.title}
      tagline={meta.tagline}
      footer={<SectionNav slug="learning" />}
    >
      <SectionMotif slug="learning" />
      <div className="grid gap-4 sm:grid-cols-2">
        {LEARNING_TOPICS.map((t) => (
          <TopicCard
            key={t.slug}
            href={`/learning/${t.slug}/`}
            title={t.title}
            blurb={t.blurb}
            glyph={t.glyph}
          />
        ))}
      </div>
    </PageShell>
  );
}
