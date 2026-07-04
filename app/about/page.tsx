import type { Metadata } from 'next';
import PageShell, { SectionNav } from '@/components/PageShell';
import SectionMotif from '@/components/SectionMotif';
import Prose from '@/components/Prose';
import { ABOUT, sectionBySlug } from '@/lib/content';

export const revalidate = 300;

const meta = sectionBySlug('about')!;

export const metadata: Metadata = {
  title: `${meta.title} — Justin Gianfelice`,
  description: meta.tagline,
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="h-px w-6 bg-accent/40" />
      <h2 className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.24em] text-accent">
        {children}
      </h2>
    </div>
  );
}

export default function AboutPage() {
  return (
    <PageShell
      slug="about"
      title={meta.title}
      tagline={meta.tagline}
      footer={<SectionNav slug="about" />}
    >
      <SectionMotif slug="about" />

      <Prose blocks={ABOUT.intro} />

      <section className="mt-20">
        <Label>{ABOUT.recentlyLabel}</Label>
        <ul className="space-y-5 border-l border-line pl-6">
          {ABOUT.recently.map((item, i) => (
            <li
              key={i}
              className="relative text-lg font-light leading-relaxed text-ink/90"
            >
              <span className="absolute -left-6 top-[0.8em] h-px w-3 bg-accent/60" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 border-t border-line pt-12">
        <Label>{ABOUT.contactHeading}</Label>
        <p className="max-w-[32ch] font-serif text-2xl font-light leading-snug text-ink md:text-[1.95rem]">
          {ABOUT.contactLead}
        </p>
        <a
          href={ABOUT.contact.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-7 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.16em] text-accent"
        >
          <span className="link-underline">{ABOUT.contact.label}</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
      </section>
    </PageShell>
  );
}
