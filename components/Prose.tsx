import Link from 'next/link';
import type { Block, RichText } from '@/lib/notion';

// Render Notion rich-text runs, preserving bold / italic / links.
function Runs({ runs }: { runs: RichText[] }) {
  return (
    <>
      {(runs || []).map((r, i) => {
        let node: React.ReactNode = r.content;
        if (r.bold) node = <strong className="font-medium text-ink">{node}</strong>;
        if (r.italic) node = <em>{node}</em>;
        if (r.href) {
          const external = /^https?:\/\//.test(r.href);
          node = (
            <Link
              href={r.href}
              className="text-accent link-underline"
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {node}
            </Link>
          );
        }
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

// Turn a flat Block[] (with runs of bullets) into styled long-form prose.
export default function Prose({ blocks }: { blocks: Block[] }) {
  const out: React.ReactNode[] = [];
  let bucket: Block[] = [];

  const flushBullets = (key: string) => {
    if (!bucket.length) return;
    out.push(
      <ul key={key} className="my-6 space-y-2.5 pl-0">
        {bucket.map((b, i) => (
          <li key={i} className="relative pl-6 text-muted leading-relaxed">
            <span className="absolute left-0 top-[0.6em] h-px w-3 bg-accent/70" />
            <Runs runs={(b as any).text} />
          </li>
        ))}
      </ul>
    );
    bucket = [];
  };

  blocks.forEach((b, i) => {
    if (b.type === 'bullet') {
      bucket.push(b);
      return;
    }
    flushBullets(`ul-${i}`);

    switch (b.type) {
      case 'h1':
        out.push(
          <h2 key={i} className="mt-14 mb-4 font-mono text-2xl tracking-tight text-ink">
            <Runs runs={b.text} />
          </h2>
        );
        break;
      case 'h2':
        out.push(
          <h2
            key={i}
            className="mt-12 mb-4 font-mono text-sm uppercase tracking-label text-accent"
          >
            <Runs runs={b.text} />
          </h2>
        );
        break;
      case 'h3':
        out.push(
          <h3 key={i} className="mt-8 mb-3 font-mono text-base text-ink">
            <Runs runs={b.text} />
          </h3>
        );
        break;
      case 'p':
        out.push(
          <p key={i} className="my-4 text-muted leading-relaxed">
            <Runs runs={b.text} />
          </p>
        );
        break;
      case 'quote':
        out.push(
          <blockquote
            key={i}
            className="my-8 border-l border-accent/50 pl-6 font-mono text-lg italic text-ink/90"
          >
            <Runs runs={b.text} />
          </blockquote>
        );
        break;
      case 'callout':
        out.push(
          <div
            key={i}
            className="my-8 flex gap-3 rounded-lg border border-line bg-surface/60 px-5 py-4"
          >
            {b.emoji && <span className="select-none text-lg leading-6">{b.emoji}</span>}
            <div className="text-sm leading-relaxed text-muted">
              <Runs runs={b.text} />
            </div>
          </div>
        );
        break;
      case 'divider':
        out.push(<hr key={i} className="my-12 border-line" />);
        break;
    }
  });
  flushBullets('ul-end');

  return <div className="max-w-prose">{out}</div>;
}
