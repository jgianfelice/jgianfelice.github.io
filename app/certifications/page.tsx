import type { Metadata } from 'next';
import PageShell, { SectionNav } from '@/components/PageShell';
import SectionMotif from '@/components/SectionMotif';
import CertCard from '@/components/CertCard';
import { CERTS, CERT_INTRO, sectionBySlug, SECTIONS } from '@/lib/content';

export const revalidate = 300;

const meta = sectionBySlug('certifications')!;

export const metadata: Metadata = {
  title: `${meta.title} — Justin Gianfelice`,
  description: meta.tagline,
};

export default function CertificationsPage() {
  return (
    <PageShell
      eyebrow={`${meta.index} / ${String(SECTIONS.length).padStart(2, '0')}`}
      title={meta.title}
      tagline={meta.tagline}
      footer={<SectionNav slug="certifications" />}
    >
      <SectionMotif slug="certifications" />
      <div className="flex items-baseline justify-between gap-4">
        <p className="max-w-prose leading-relaxed text-muted">{CERT_INTRO}</p>
        <span className="hidden shrink-0 font-mono text-xs uppercase tracking-label text-faint sm:block">
          {CERTS.length} credentials
        </span>
      </div>

      <div className="mt-12 divide-y divide-line border-t border-line">
        {CERTS.map((cert) => (
          <div key={cert.slug} className="py-9">
            <CertCard cert={cert} />
          </div>
        ))}
      </div>
    </PageShell>
  );
}
