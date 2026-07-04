import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Prose from '@/components/Prose';
import PageShell, { BackHome } from '@/components/PageShell';
import { loadLogEntry, logParams } from '@/lib/content';

export const revalidate = 300;
export const dynamicParams = false;

const link =
  'font-mono text-xs uppercase tracking-label text-muted transition-colors hover:text-accent';

export async function generateStaticParams() {
  return logParams();
}

export async function generateMetadata({
  params,
}: {
  params: { category: string; date: string };
}): Promise<Metadata> {
  const loaded = await loadLogEntry(params.category, params.date);
  return loaded ? { title: `${loaded.entry.title} — Justin Gianfelice` } : {};
}

export default async function LogEntryPage({
  params,
}: {
  params: { category: string; date: string };
}) {
  const loaded = await loadLogEntry(params.category, params.date);
  if (!loaded) notFound();
  const { category, entry } = loaded;

  return (
    <PageShell
      slug="logs"
      eyebrow={
        <Link href={`/logs/${category.slug}/`} className={link}>
          ← {category.title}
        </Link>
      }
      title={entry.title}
      footer={
        <div className="flex items-center justify-between gap-4">
          <Link href={`/logs/${category.slug}/`} className={link}>
            Back to {category.title}
          </Link>
          <BackHome />
        </div>
      }
    >
      <Prose blocks={entry.blocks} />
    </PageShell>
  );
}
