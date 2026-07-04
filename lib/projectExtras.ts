// Supplemental links + media for specific projects, kept OUT of Notion so they
// can be added/edited here freely. Matched by a lowercased title substring, so
// they survive Notion edits and id changes. Drop screenshots into
// /public/projects/… and reference them via `image` when you have them.
export type ProjectLink = {
  label: string;
  href: string;
  kind: 'buy' | 'demo' | 'external';
};

export type ProjectExtras = {
  // Short tag shown on the projects index (e.g. "For sale", "Demo", "Live").
  tag?: string;
  links: ProjectLink[];
  image?: { src: string; alt: string };
  // Optional rising sparkline (e.g. Numerai cumulative compare score).
  spark?: { data: number[]; caption: string };
};

const EXTRAS: { match: string; extras: ProjectExtras }[] = [
  {
    // Gumroad Excel Tool — Profit Engine
    match: 'gumroad',
    extras: {
      tag: 'For sale',
      links: [
        {
          label: 'Get it on Gumroad',
          href: 'https://gianfelice6.gumroad.com/l/ltvvl',
          kind: 'buy',
        },
      ],
    },
  },
  {
    // Personal Bloomberg — Market War Room
    match: 'war room',
    extras: {
      tag: 'Demo',
      links: [
        {
          label: 'Watch the demo',
          href: 'https://drive.google.com/file/d/1HRxB8_WDrKchsWZxYHyQoDQS2WG4chmX/view',
          kind: 'demo',
        },
      ],
    },
  },
  {
    // Numerai Challenge
    match: 'numerai',
    extras: {
      links: [
        { label: 'View on Numerai', href: 'https://numer.ai/jgianfelice', kind: 'external' },
      ],
      // Cumulative compare score (MMC20) trend over recent rounds — rising.
      spark: {
        data: [
          0.013, 0.028, 0.04, 0.038, 0.048, 0.051, 0.059, 0.074, 0.08, 0.083,
          0.084, 0.082, 0.095, 0.103, 0.103, 0.096, 0.106,
        ],
        caption: 'Cumulative compare score · recent rounds',
      },
    },
  },
];

export function projectExtras(title: string): ProjectExtras | null {
  const t = (title || '').toLowerCase();
  return EXTRAS.find((e) => t.includes(e.match))?.extras ?? null;
}

// Explicit display titles for specific projects (matched on a lowercased
// substring of the Notion title). Some drop the dash entirely, some use a
// colon; projects not listed here keep their Notion title verbatim.
const TITLE_OVERRIDES: { match: string; title: string }[] = [
  { match: 'backtrader', title: 'Backtrader RealisticExecutionModel' },
  { match: 'capaxis', title: 'CapAxis Investment Decision Study' },
  { match: 'equity research', title: 'Equity Research Report : Spotify Technology S.A.' },
  { match: 'gumroad', title: 'Gumroad Excel Tool : Profit Engine' },
  { match: 'kynexis', title: 'Kynexis Decision Intelligence Platform' },
  { match: 'rainmark', title: 'Rainmark: Growth Strategy Engagement' },
];

export function projectTitle(original: string): string {
  const t = (original || '').toLowerCase();
  return TITLE_OVERRIDES.find((o) => t.includes(o.match))?.title ?? original;
}
