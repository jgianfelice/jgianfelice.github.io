'use client';

import { useMemo, useState } from 'react';
import EntryCard from './EntryCard';

export type ProjectListItem = {
  id: string;
  title: string;
  blurb: string;
  tag?: string;
};

// The projects directory with a live search. The right-hand rail (desktop)
// carries the search field; on phones the same field sits above the list.
// Matching is a simple case-insensitive scan of title + blurb.
export default function ProjectsSearch({ projects }: { projects: ProjectListItem[] }) {
  const [q, setQ] = useState('');

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return projects;
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.blurb.toLowerCase().includes(needle)
    );
  }, [projects, q]);

  const field = (
    <label className="block">
      <span className="sr-only">Search projects</span>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search projects…"
        autoComplete="off"
        spellCheck={false}
        className="w-full rounded-lg border border-line bg-elevated/70 px-4 py-2.5 font-mono text-sm text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none"
      />
    </label>
  );

  return (
    <div className="lg:flex lg:gap-16">
      <div className="min-w-0 flex-1">
        {/* Phones: the search field sits right above the list. */}
        <div className="mb-8 lg:hidden">{field}</div>

        {shown.map((p, i) => (
          <EntryCard
            key={p.id}
            href={`/projects/${p.id}/`}
            n={i + 1}
            title={p.title}
            blurb={p.blurb}
            tag={p.tag}
          />
        ))}
        {shown.length === 0 && (
          <p className="border-t border-line py-10 font-mono text-sm text-muted">
            No projects match “{q.trim()}”.
          </p>
        )}
        <div className="border-t border-line" />
      </div>

      {/* Desktop rail — the search bar, kept in the site's glass language. */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="tile sticky top-32 p-6">
          <div className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-accent">
            Search
          </div>
          <div className="mt-4">{field}</div>
          <div className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-faint">
            {shown.length} of {projects.length} projects
          </div>

          <div className="my-6 h-px w-full bg-line" />

          {/* small rising-signal emblem */}
          <svg viewBox="0 0 168 64" className="w-full" aria-hidden="true">
            <path d="M0 56h168M0 36h168M0 16h168" className="text-line" stroke="currentColor" strokeWidth={0.5} />
            <path
              d="M2 54 C28 50 40 34 60 38 S96 58 118 40 150 12 166 18"
              className="text-accent"
              stroke="currentColor"
              strokeWidth={1.5}
              fill="none"
            />
            <circle cx="60" cy="38" r="2.5" className="text-accent" fill="currentColor" />
            <circle cx="118" cy="40" r="2.5" className="text-accent" fill="currentColor" />
          </svg>

          <p className="mt-5 text-xs leading-relaxed text-muted">
            Research, tools, and studies. Built to run, not just to demo.
          </p>
        </div>
      </aside>
    </div>
  );
}
