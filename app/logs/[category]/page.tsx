import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Prose from '@/components/Prose';
import PageShell, { BackHome } from '@/components/PageShell';
import LogCalendar from '@/components/LogCalendar';
import {
  LOG_CATEGORIES,
  logCategoryBySlug,
  loadLogCategory,
  sectionBySlug,
} from '@/lib/content';

export const revalidate = 300;
export const dynamicParams = false;

const meta = sectionBySlug('logs')!;
const link =
  'font-mono text-xs uppercase tracking-label text-muted transition-colors hover:text-accent';

export function generateStaticParams() {
  return LOG_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const c = logCategoryBySlug(params.category);
  return c ? { title: `${c.title} — Justin Gianfelice`, description: c.blurb } : {};
}

export default async function LogCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const loaded = await loadLogCategory(params.category);
  if (!loaded) notFound();
  const { category, entries } = loaded;
  const recent = entries[0];
  const now = new Date();

  return (
    <PageShell
      slug="logs"
      eyebrow={
        <Link href="/logs/" className={link}>
          {'//////'} {meta.title}
        </Link>
      }
      title={category.title}
      tagline={category.description}
      footer={
        <div className="flex items-center justify-between gap-4">
          <Link href="/logs/" className={link}>
            All {meta.title}
          </Link>
          <BackHome />
        </div>
      }
    >
      {recent && (
        <section className="mb-16">
          <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-line pb-3">
            <h2 className="font-mono text-xs uppercase tracking-label text-accent">
              Most recent entry
            </h2>
            <span className="font-mono text-xs text-faint">{recent.title}</span>
          </div>
          <Prose blocks={recent.blocks} />
        </section>
      )}

      <h2 className="mb-5 font-mono text-xs uppercase tracking-label text-faint">
        Browse by date
      </h2>
      <LogCalendar
        category={category.slug}
        entries={entries.map((e) => ({ date: e.date, title: e.title }))}
        initialYear={now.getFullYear()}
        initialMonth={now.getMonth()}
      />
    </PageShell>
  );
}
