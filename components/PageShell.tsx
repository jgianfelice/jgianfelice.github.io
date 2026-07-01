import Link from 'next/link';
import Nav from './Nav';
import { SECTIONS, type SectionSlug } from '@/lib/content';

// Shared frame for every sub-page: fixed nav, a mono editorial header,
// the content column, and a slot for footer navigation. The cool ice
// palette and grain come from the global body, so pages stay on-brand
// with the crystal hero without repeating themselves.
export default function PageShell({
  eyebrow,
  title,
  tagline,
  children,
  footer,
}: {
  eyebrow?: React.ReactNode;
  title: string;
  tagline?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="relative z-10 min-h-screen">
        <div className="container-editorial pt-36 pb-24 md:pt-44">
          <header className="animate-[fadeIn_700ms_ease-out_both]">
            {eyebrow && (
              <div className="mb-5 font-mono text-xs uppercase tracking-label text-accent">
                {eyebrow}
              </div>
            )}
            <h1 className="font-mono text-4xl leading-[1.05] tracking-tight text-ink md:text-6xl">
              {title}
            </h1>
            {tagline && (
              <p className="mt-5 max-w-prose text-base leading-relaxed text-muted md:text-lg">
                {tagline}
              </p>
            )}
          </header>

          <div className="mt-14 h-px w-full bg-line" />

          <div className="mt-12 animate-[fadeIn_900ms_ease-out_both]">{children}</div>

          {footer && (
            <footer className="mt-24 border-t border-line pt-8">{footer}</footer>
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
      ← Index
    </Link>
  );
}

// Previous / home / next navigation across the five sections.
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
            ← {prev.index} {prev.title}
          </Link>
        )}
      </div>
      <BackHome />
      <div className="min-w-0 flex-1 text-right">
        {next && (
          <Link href={`/${next.slug}`} className={link}>
            {next.index} {next.title} →
          </Link>
        )}
      </div>
    </div>
  );
}
