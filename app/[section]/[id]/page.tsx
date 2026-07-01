import { notFound } from 'next/navigation';
import Link from 'next/link';
import Prose from '@/components/Prose';
import PageShell, { BackHome } from '@/components/PageShell';
import { loadEntry, entryIds, sectionBySlug, SECTIONS } from '@/lib/content';

export const revalidate = 300;
// Static export enumerates every entry at build time (live Notion child ids
// plus placeholder slugs), so unknown ids fall through to the 404 page.
export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { section: string; id: string }[] = [];
  for (const s of SECTIONS.filter((x) => x.kind === 'index')) {
    const ids = await entryIds(s.slug);
    ids.forEach((id) => params.push({ section: s.slug, id }));
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { section: string; id: string };
}) {
  const meta = sectionBySlug(params.section);
  if (!meta) return {};
  const e = await loadEntry(meta.slug, params.id);
  if (!e) return {};
  return { title: `${e.title} — Justin Gianfelice` };
}

export default async function EntryPage({
  params,
}: {
  params: { section: string; id: string };
}) {
  const meta = sectionBySlug(params.section);
  if (!meta || meta.kind !== 'index') notFound();

  const e = await loadEntry(meta.slug, params.id);
  if (!e) notFound();

  const link =
    'font-mono text-xs uppercase tracking-label text-muted transition-colors hover:text-accent';

  return (
    <PageShell
      eyebrow={
        <Link href={`/${meta.slug}`} className={link}>
          ← {meta.index} {meta.title}
        </Link>
      }
      title={e.title}
      footer={
        <div className="flex items-center justify-between gap-4">
          <Link href={`/${meta.slug}`} className={link}>
            ← All {meta.title}
          </Link>
          <BackHome />
        </div>
      }
    >
      <Prose blocks={e.blocks} />
    </PageShell>
  );
}
