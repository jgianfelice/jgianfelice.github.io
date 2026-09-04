import type { Metadata } from 'next';
import PageShell, { SectionNav } from '@/components/PageShell';
import SectionMotif from '@/components/SectionMotif';
import CertCard from '@/components/CertCard';
import { CERTS, sectionBySlug } from '@/lib/content';

export const revalidate = 300;

const meta = sectionBySlug('certifications')!;

export const metadata: Metadata = {
  title: `${meta.title} — Justin Gianfelice`,
  description: meta.tagline,
};

export default function CertificationsPage() {
  return (
    <PageShell
      slug="certifications"
      align="right"
      title={meta.title}
      footer={<SectionNav slug="certifications" />}
    >
      <SectionMotif slug="certifications" />
      <div className="divide-y divide-line border-t border-line">
        {CERTS.map((cert) => (
          <div key={cert.slug} className="py-9">
            <CertCard cert={cert} />
          </div>
        ))}
      </div>
    </PageShell>
  );
}
