import Link from 'next/link';
import Nav from './Nav';
import Atmosphere from './Atmosphere';
import Parallax from './Parallax';
import Scramble from './Scramble';
import { SECTIONS, sectionBySlug, type SectionSlug } from '@/lib/content';

type Align = 'left' | 'right';

// Shared frame for every sub-page. The page is not a document with a 3D
// accent — it lives INSIDE the same frozen world as the hero: a fixed
// atmosphere (fog, dust, dot-grid, the section's specimen crystal with its
// instrument HUD) sits behind everything, the camera leans with the cursor,
// and the content scrolls above on its own parallax plane. The crystal takes
// the side opposite the title so the two never fight.
export default function PageShell({
  eyebrow,
  title,
  tagline,
  children,
  footer,
  slug,
  align = 'left',
}: {
  eyebrow?: React.ReactNode;
  title: string;
  tagline?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  slug?: SectionSlug;
  align?: Align;
}) {
  const text =
    align === 'right' ? 'items-start text-left md:items-end md:text-right' : 'items-start text-left';
  const meta = slug ? sectionBySlug(slug) : undefined;

  return (
    <>
      <Nav />
      {slug && (
        <Atmosphere
          slug={slug}
          side={align === 'right' ? 'left' : 'right'}
          index={meta?.index}
          title={meta?.title}
        />
      )}
      <main className="relative z-10 min-h-screen">
        <div className="container-editorial pt-32 pb-24 md:pt-40">
          <Parallax amount={6}>
            <header
              className={`flex flex-col gap-8 animate-[fadeIn_700ms_ease-out_both] ${text}`}
            >
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-faint">
                {eyebrow ?? (
                  <>
                    <span className="text-faint/70">{'//////'}</span>{' '}
                    {meta && <Scramble text={`SECTION_${meta.index}`} duration={800} />}
                  </>
                )}
              </div>
              <h1 className="max-w-[16ch] font-serif text-[2.6rem] font-light leading-[0.98] tracking-[-0.015em] text-ink md:text-6xl lg:text-[5rem]">
                {title}
              </h1>
              {tagline && (
                <p className="max-w-[36ch] text-base leading-relaxed text-muted md:text-lg">
                  {tagline}
                </p>
              )}
            </header>
          </Parallax>

          <div className="mt-14 h-px w-full bg-line md:mt-20" />

          <div className="mt-12 animate-[fadeIn_1100ms_ease-out_both] md:mt-14">
            {children}
          </div>

          {footer && (
            <footer className="mt-28 border-t border-line pt-8">{footer}</footer>
          )}
        </div>
      </main>
    </>
  );
}

// A quiet home breadcrumb, reused by section and detail footers.
export function BackHome() {
  return (
    <Link
      href="/"
      className="font-mono text-xs uppercase tracking-label text-muted transition-colors hover:text-accent"
    >
      Index
    </Link>
  );
}

// Previous / home / next navigation across the five sections. No arrows, no
// index numbers — just the names.
export function SectionNav({ slug }: { slug: SectionSlug }) {
  const i = SECTIONS.findIndex((s) => s.slug === slug);
  const prev = i > 0 ? SECTIONS[i - 1] : null;
  const next = i < SECTIONS.length - 1 ? SECTIONS[i + 1] : null;
  const link =
    'font-mono text-xs uppercase tracking-label text-muted transition-colors hover:text-accent';
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
        {prev && (
          <Link href={`/${prev.slug}`} className={link}>
            {prev.title}
          </Link>
        )}
      </div>
      <BackHome />
      <div className="min-w-0 flex-1 text-right">
        {next && (
          <Link href={`/${next.slug}`} className={link}>
            {next.title}
          </Link>
        )}
      </div>
    </div>
  );
}
