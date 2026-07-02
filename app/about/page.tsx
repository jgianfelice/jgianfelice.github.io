import type { Metadata } from 'next';
import PageShell, { SectionNav } from '@/components/PageShell';
import SectionMotif from '@/components/SectionMotif';
import Prose from '@/components/Prose';
import { ABOUT, sectionBySlug, SECTIONS } from '@/lib/content';

export const revalidate = 300;

const meta = sectionBySlug('about')!;

export const metadata: Metadata = {
  title: `${meta.title} — Justin Gianfelice`,
  description: meta.tagline,
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow={`${meta.index} / ${String(SECTIONS.length).padStart(2, '0')}`}
      title={meta.title}
      tagline={meta.tagline}
      footer={<SectionNav slug="about" />}
    >
      <SectionMotif slug="about" />

      <Prose blocks={ABOUT.intro} />

      <section className="mt-16">
        <h2 className="mb-5 font-mono text-sm uppercase tracking-label text-accent">
          {ABOUT.recentlyLabel}
        </h2>
        <ul className="space-y-3">
          {ABOUT.recently.map((item, i) => (
            <li key={i} className="relative pl-6 leading-relaxed text-muted">
              <span className="absolute left-0 top-[0.6em] h-px w-3 bg-accent/70" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 border-t border-line pt-10">
        <h2 className="mb-3 font-mono text-sm uppercase tracking-label text-accent">
          {ABOUT.contactHeading}
        </h2>
        <p className="max-w-prose leading-relaxed text-muted">{ABOUT.contactLead}</p>
        <a
          href={ABOUT.contact.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block font-mono text-accent link-underline"
        >
          {ABOUT.contact.label} →
        </a>
      </section>
    </PageShell>
  );
}
