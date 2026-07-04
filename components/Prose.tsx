import Link from 'next/link';
import type { Block, RichText } from '@/lib/notion';

// Render Notion rich-text runs, preserving bold / italic / links.
function Runs({ runs }: { runs: RichText[] }) {
  return (
    <>
      {(runs || []).map((r, i) => {
        let node: React.ReactNode = r.content;
        if (r.bold) node = <strong className="font-medium text-ink">{node}</strong>;
        if (r.italic) node = <em className="font-serif italic">{node}</em>;
        if (r.href) {
          const external = /^https?:\/\//.test(r.href);
          node = (
            <Link
              href={r.href}
              className="text-ink underline decoration-accent/40 decoration-1 underline-offset-[3px] transition-colors hover:decoration-accent"
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
// The first paragraph of a page takes a Fraunces drop-cap — a small editorial
// signal that a person set this type, not a template.
export default function Prose({ blocks }: { blocks: Block[] }) {
  const out: React.ReactNode[] = [];
  let bucket: Block[] = [];
  const leadIsPara = blocks[0]?.type === 'p';

  const flushBullets = (key: string) => {
    if (!bucket.length) return;
    out.push(
      <ul key={key} className="my-7 space-y-3 pl-0">
        {bucket.map((b, i) => (
          <li key={i} className="relative pl-7 leading-[1.7] text-muted">
            <span className="absolute left-0 top-[0.72em] h-px w-4 bg-accent/60" />
            <Runs runs={(b as { text: RichText[] }).text} />
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
          <h2
            key={i}
            className="mt-16 mb-5 max-w-[20ch] font-serif text-[1.7rem] font-light leading-[1.1] tracking-[-0.01em] text-ink md:text-[2.1rem]"
          >
            <Runs runs={b.text} />
          </h2>
        );
        break;
      case 'h2':
        out.push(
          <div key={i} className="mt-14 mb-5 flex items-center gap-3">
            <span className="h-px w-6 shrink-0 bg-accent/40" />
            <h2 className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.24em] text-accent">
              <Runs runs={b.text} />
            </h2>
          </div>
        );
        break;
      case 'h3':
        out.push(
          <h3
            key={i}
            className="mt-10 mb-3 font-mono text-[0.95rem] font-medium tracking-tight text-ink"
          >
            <Runs runs={b.text} />
          </h3>
        );
        break;
      case 'p':
        out.push(
          <p
            key={i}
            className={
              i === 0 && leadIsPara
                ? 'mb-5 leading-[1.75] text-muted [&::first-letter]:float-left [&::first-letter]:mr-2.5 [&::first-letter]:mt-1 [&::first-letter]:font-serif [&::first-letter]:text-[3.4rem] [&::first-letter]:font-light [&::first-letter]:leading-[0.72] [&::first-letter]:text-ink'
                : 'my-5 leading-[1.75] text-muted'
            }
          >
            <Runs runs={b.text} />
          </p>
        );
        break;
      case 'quote':
        out.push(
          <blockquote
            key={i}
            className="my-10 max-w-[34ch] font-serif text-xl font-light italic leading-snug text-ink md:text-2xl"
          >
            <span className="mr-1 select-none text-accent/50">“</span>
            <Runs runs={b.text} />
          </blockquote>
        );
        break;
      case 'callout':
        out.push(
          <div key={i} className="tile my-8 flex gap-3 px-5 py-4">
            {b.emoji && <span className="select-none text-lg leading-6">{b.emoji}</span>}
            <div className="text-sm leading-relaxed text-muted">
              <Runs runs={b.text} />
            </div>
          </div>
        );
        break;
      case 'divider':
        out.push(
          <div key={i} className="my-12 flex items-center gap-2 text-line" aria-hidden>
            <span className="h-px flex-1 bg-current" />
            <span className="h-1 w-1 rotate-45 bg-faint/50" />
            <span className="h-px flex-1 bg-current" />
          </div>
        );
        break;
    }
  });
  flushBullets('ul-end');

  return <div className="max-w-prose">{out}</div>;
}
