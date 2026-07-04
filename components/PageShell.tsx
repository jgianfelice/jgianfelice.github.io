import Link from 'next/link';
import Nav from './Nav';
import PageObject from './PageObject';
import { SECTIONS, type SectionSlug } from '@/lib/content';

type Align = 'left' | 'right';

// Shared frame for every sub-page: fixed nav, an editorial masthead pairing a
// big Fraunces title with a floating 3D crystal (the section's emblem, echoing
// the hero) so the page keeps the landing page's world, the content column,
// and a footer slot. On mobile everything left-aligns and the crystal drops
// below the title, so the composition never fights itself on a narrow screen.
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

  return (
    <>
      <Nav />
      <main className="relative z-10 min-h-screen">
        <div className="container-editorial pt-32 pb-24 md:pt-40">
          <header
            className={`flex flex-col items-start gap-10 animate-[fadeIn_700ms_ease-out_both] md:flex-row md:items-center md:gap-14 ${
              align === 'right' ? 'md:flex-row-reverse' : ''
            }`}
          >
            <div className={`flex min-w-0 flex-1 flex-col ${text}`}>
              {eyebrow && (
                <div className="mb-6 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-faint">
                  {eyebrow}
                </div>
              )}
              <h1 className="max-w-[16ch] font-serif text-[2.6rem] font-light leading-[0.98] tracking-[-0.015em] text-ink md:text-6xl lg:text-[5rem]">
                {title}
              </h1>
              {tagline && (
                <p className="mt-6 max-w-[36ch] text-base leading-relaxed text-muted md:text-lg">
                  {tagline}
                </p>
              )}
            </div>

            {slug && (
              <PageObject
                slug={slug}
                className="h-40 w-40 shrink-0 md:h-56 md:w-56 lg:h-64 lg:w-64"
              />
            )}
          </header>

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
