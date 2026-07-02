import type { Metadata } from 'next';
import PageShell, { SectionNav } from '@/components/PageShell';
import SectionMotif from '@/components/SectionMotif';
import CertCard from '@/components/CertCard';
import { CERT_GROUPS, CERT_INTRO, sectionBySlug, SECTIONS } from '@/lib/content';

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
      <p className="max-w-prose leading-relaxed text-muted">{CERT_INTRO}</p>

      <div className="mt-12 divide-y divide-line border-t border-line">
        {CERT_GROUPS.map((group) => (
          <section key={group.issuer} className="py-10">
            <h2 className="mb-6 font-mono text-sm uppercase tracking-label text-accent">
              {group.issuer}
            </h2>
            <div className="space-y-8">
              {group.certs.map((cert) => (
                <CertCard key={cert.slug} cert={cert} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
