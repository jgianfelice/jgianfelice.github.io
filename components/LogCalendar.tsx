'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type CalEntry = { date: string; title: string };

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const pad = (n: number) => String(n).padStart(2, '0');
const isoOf = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

// Month-view calendar for one log track. Opens on the current month and
// scrolls back through past months; any day with an entry is marked with a
// filled dark circle and links to that day's log. Days without entries are inert.
export default function LogCalendar({
  category,
  entries,
  initialYear,
  initialMonth,
}: {
  category: string;
  entries: CalEntry[];
  initialYear: number;
  initialMonth: number;
}) {
  const [view, setView] = useState({ y: initialYear, m: initialMonth });
  const [today, setToday] = useState<string | null>(null);

  // Correct to the visitor's real current month after mount (the SSR'd HTML
  // uses the build-time month, so first client render matches → no mismatch).
  useEffect(() => {
    const d = new Date();
    setView({ y: d.getFullYear(), m: d.getMonth() });
    setToday(isoOf(d.getFullYear(), d.getMonth(), d.getDate()));
  }, []);

  const byDate = new Map(entries.map((e) => [e.date, e.title]));

  const step = (delta: number) =>
    setView((v) => {
      const next = new Date(v.y, v.m + delta, 1);
      return { y: next.getFullYear(), m: next.getMonth() };
    });

  const firstDay = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const navBtn =
    'flex h-8 w-8 items-center justify-center rounded-md border border-line font-mono text-muted transition-colors hover:border-accent/50 hover:text-accent';

  return (
    <div className="w-full max-w-md rounded-lg border border-line bg-surface/40 p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="font-mono text-sm text-ink">
          {MONTH_NAMES[view.m]}{' '}
          <span className="text-faint">{view.y}</span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => step(-1)} className={navBtn} aria-label="Previous month">
            ←
          </button>
          <button type="button" onClick={() => step(1)} className={navBtn} aria-label="Next month">
            →
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="text-center font-mono text-[0.65rem] uppercase tracking-label text-faint">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} className="aspect-square" />;
          const iso = isoOf(view.y, view.m, day);
          const title = byDate.get(iso);
          const isToday = iso === today;

          if (title) {
            return (
              <Link
                key={i}
                href={`/logs/${category}/${iso}/`}
                title={title}
                aria-label={`${MONTH_NAMES[view.m]} ${day}: ${title}`}
                className="group flex aspect-square items-center justify-center"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-mono text-sm font-medium text-elevated transition-transform duration-300 ease-editorial group-hover:scale-110">
                  {day}
                </span>
              </Link>
            );
          }

          return (
            <div
              key={i}
              className={`flex aspect-square items-center justify-center font-mono text-sm ${
                isToday ? 'text-accent' : 'text-faint/60'
              }`}
            >
              <span className={isToday ? 'flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-accent/40' : ''}>
                {day}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-5 font-mono text-[0.7rem] leading-relaxed text-faint">
        Circled dates have an entry. Use ← → to scroll back through the months.
      </p>
    </div>
  );
}
