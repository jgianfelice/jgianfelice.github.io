import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Prose from '@/components/Prose';
import PageShell, { BackHome } from '@/components/PageShell';
import {
  LEARNING_TOPICS,
  learningTopicBySlug,
  loadLearningTopic,
  sectionBySlug,
} from '@/lib/content';

export const revalidate = 300;
export const dynamicParams = false;

const meta = sectionBySlug('learning')!;
const link =
  'font-mono text-xs uppercase tracking-label text-muted transition-colors hover:text-accent';

export function generateStaticParams() {
  return LEARNING_TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { topic: string };
}): Promise<Metadata> {
  const t = learningTopicBySlug(params.topic);
  return t ? { title: `${t.title} — Justin Gianfelice`, description: t.blurb } : {};
}

export default async function LearningTopicPage({
  params,
}: {
  params: { topic: string };
}) {
  const loaded = await loadLearningTopic(params.topic);
  if (!loaded) notFound();
  const { topic, blocks } = loaded;

  return (
    <PageShell
      slug="learning"
      eyebrow={
        <Link href="/learning/" className={link}>
          {'//////'} {meta.title}
        </Link>
      }
      title={topic.title}
      tagline={topic.blurb}
      footer={
        <div className="flex items-center justify-between gap-4">
          <Link href="/learning/" className={link}>
            All {meta.title}
          </Link>
          <BackHome />
        </div>
      }
    >
      <Prose blocks={blocks} />
    </PageShell>
  );
}
