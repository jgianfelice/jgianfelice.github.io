import {
  NOTION_PAGES,
  getBlocks,
  getChildPages,
  getEntry,
  getHomeContent,
  plain,
  type Block,
  type HomeContent,
  type RichText,
} from './notion';
import { sanitizeBlocks, stripEmoji, stripEmojiBlocks, cleanTitle } from './sanitize';
import { p, rt } from './blocks';
import {
  LEARNING_FALLBACK,
  LOG_FALLBACK,
  PROJECT_FALLBACK,
} from './fallback';

// ── Section metadata — one source of truth for the five sub-pages ────
export type SectionSlug =
  | 'projects'
  | 'certifications'
  | 'learning'
  | 'logs'
  | 'about';

export type SectionMeta = {
  slug: SectionSlug;
  index: string;
  title: string;
  tagline: string;
  notionKey: keyof typeof NOTION_PAGES;
  kind: 'index' | 'prose';
};

export const SECTIONS: SectionMeta[] = [
  {
    slug: 'projects',
    index: '01',
    title: 'Projects',
    notionKey: 'projects',
    kind: 'index',
    tagline:
      'Quant research, machine learning, and the tools built to execute on markets.',
  },
  {
    slug: 'certifications',
    index: '02',
    title: 'Certifications',
    notionKey: 'certifications',
    kind: 'prose',
    tagline:
      'Credentials across financial modeling, markets, and wealth management.',
  },
  {
    slug: 'learning',
    index: '03',
    title: 'Learning',
    notionKey: 'learning',
    kind: 'prose',
    tagline: 'A standing record of what I am studying, reading, and sharpening.',
  },
  {
    slug: 'logs',
    index: '04',
    title: 'Logs',
    notionKey: 'logs',
    kind: 'index',
    tagline: 'Thinking in the open: the principles and decisions that compound.',
  },
  {
    slug: 'about',
    index: '05',
    title: 'About',
    notionKey: 'about',
    kind: 'prose',
    tagline: 'Finance at McGill. Markets, data, and disciplined execution.',
  },
];

export const sectionBySlug = (slug: string): SectionMeta | undefined =>
  SECTIONS.find((s) => s.slug === slug);

export const SECTION_SLUGS = SECTIONS.map((s) => s.slug);

// ── Certifications ───────────────────────────────────────────────────
// Curated grouping (issuer → credentials) with the actual certificate
// image beside each one. Names, dates, and blurbs mirror the Notion page;
// the images are the local assets in /public/certs. The "Name — Date"
// dash is a divider and is rendered structurally, not as prose.
export type Cert = {
  slug: string;
  name: string;
  date: string;
  image: string;
  blurb: string;
};
export type CertGroup = { issuer: string; certs: Cert[] };

export const CERT_INTRO =
  'Formal credentials earned. Each one reflects focused study in a specific area of finance and markets.';

export const CERT_GROUPS: CertGroup[] = [
  {
    issuer: 'Duke University',
    certs: [
      {
        slug: 'behavioural-finance',
        name: 'Behavioural Finance',
        date: 'Issued June 2026',
        image: '/certs/duke.png',
        blurb:
          'Cognitive biases, emotional decision-making, and how psychological factors systematically affect investment behaviour and market outcomes.',
      },
    ],
  },
  {
    issuer: 'Corporate Finance Institute (CFI)',
    certs: [
      {
        slug: 'fmva',
        name: 'Financial Modeling & Valuation Analyst (FMVA®)',
        date: 'Issued Mar 2026',
        image: '/certs/fmva.png',
        blurb:
          'Building and interpreting financial models, DCF valuation, comparable company analysis, and precedent transactions.',
      },
      {
        slug: 'cmsa',
        name: 'Capital Markets & Securities Analyst (CMSA®)',
        date: 'Issued Mar 2026',
        image: '/certs/cmsa.png',
        blurb:
          'Fixed income, equities, derivatives, and how capital markets actually function at an institutional level.',
      },
      {
        slug: 'fpwmp',
        name: 'Financial Planning & Wealth Management (FPWMP®)',
        date: 'Issued Mar 2026',
        image: '/certs/fpwmp.png',
        blurb:
          'Personal financial planning, portfolio construction, and wealth management frameworks.',
      },
    ],
  },
  {
    issuer: 'Bloomberg',
    certs: [
      {
        slug: 'bmc',
        name: 'Bloomberg Market Concepts (BMC)',
        date: 'Issued Apr 2026',
        image: '/certs/bmc.png',
        blurb:
          "Core financial market concepts: economics, currencies, fixed income, and equities through Bloomberg's terminal lens.",
      },
      {
        slug: 'esg',
        name: 'Environmental Social Governance (ESG)',
        date: 'Issued Apr 2026',
        image: '/certs/esg.png',
        blurb:
          'ESG frameworks, sustainable investing principles, and how ESG data integrates into investment analysis.',
      },
    ],
  },
  {
    issuer: 'IBM',
    certs: [
      {
        slug: 'build-ai-agent',
        name: 'Build an AI Agent',
        date: 'Issued July 2026',
        image: '/certs/ibm-ai-agent.png',
        blurb:
          'Designing AI agents that use tools and reason through multi-step tasks: agent architecture, orchestration, and where autonomy earns its place.',
      },
    ],
  },
  {
    issuer: 'Canadian Securities Institute',
    certs: [
      {
        slug: 'csc',
        name: 'Canadian Securities Course (CSC)',
        date: 'Issued Mar 2026',
        image: '/certs/csi.png',
        blurb:
          'Foundational credential for the Canadian financial industry. Covers equities, fixed income, mutual funds, and regulatory frameworks.',
      },
    ],
  },
];

// ── About ────────────────────────────────────────────────────────────
export type About = {
  intro: Block[];
  recentlyLabel: string;
  recently: string[];
  contactHeading: string;
  contactLead: string;
  contact: { label: string; href: string };
};

export const ABOUT: About = {
  intro: [
    p(
      rt(
        'Finance student at McGill University (Desautels Faculty of Management), focused on investment management and capital markets.'
      )
    ),
    p(
      rt(
        'I am interested in how strategies perform in real markets, not just in theory. Most of my work lives at the intersection of systematic thinking, data, and disciplined execution.'
      )
    ),
    p(
      rt(
        'My experience includes building quantitative models and tools, contributing to open-source financial software, competing in live ML tournaments, and leading early-stage growth projects. I am comfortable working with clients and teams, and I care about communicating findings clearly, not just producing them.'
      )
    ),
    p(
      rt(
        'This page is a public version of how I operate. It is where I document what I am building, what I am learning, and how I think.'
      )
    ),
  ],
  recentlyLabel: 'Recently',
  recently: [
    'Finance student at Desautels Faculty of Management, McGill University',
    'Administrative Associate at CIBC Wood Gundy',
    'Building Kynexis, a decision intelligence platform',
    'Reading capital allocation and decision psychology',
  ],
  contactHeading: 'Reach out',
  contactLead:
    'Open to interesting conversations: markets, ideas, problems worth solving.',
  contact: {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/justingianfelice',
  },
};

// ── Learning topics (six subtabs) ────────────────────────────────────
export type LearningTopic = {
  slug: string;
  title: string;
  blurb: string;
  glyph: string;
};

export const LEARNING_TOPICS: LearningTopic[] = [
  {
    slug: 'technical-skills',
    title: 'Technical Skills',
    blurb: 'The tools I build with: Python, modeling, data, and machine learning.',
    glyph: 'code',
  },
  {
    slug: 'finance-markets',
    title: 'Finance & Markets',
    blurb: 'How markets work, and how capital gets allocated under uncertainty.',
    glyph: 'chart',
  },
  {
    slug: 'university-courses',
    title: 'University Courses',
    blurb: 'Formal coursework across finance, mathematics, economics, and beyond.',
    glyph: 'grid',
  },
  {
    slug: 'soft-skills',
    title: 'Soft Skills & Operating Principles',
    blurb: 'How I operate: process, communication, and disciplined execution.',
    glyph: 'nodes',
  },
  {
    slug: 'writing',
    title: 'Writing',
    blurb: 'Essays and analysis on markets and how I think, published on Substack.',
    glyph: 'pen',
  },
  {
    slug: 'reading-list',
    title: 'Reading List',
    blurb: 'The books shaping how I think about markets, money, and decisions.',
    glyph: 'book',
  },
];

export const learningTopicBySlug = (slug: string): LearningTopic | undefined =>
  LEARNING_TOPICS.find((t) => t.slug === slug);

function learningSlugFor(heading: string): string | null {
  const h = heading.toLowerCase();
  if (h.includes('technical')) return 'technical-skills';
  if (h.includes('finance')) return 'finance-markets';
  if (h.includes('course')) return 'university-courses';
  if (h.includes('soft skill') || h.includes('operating')) return 'soft-skills';
  if (h.includes('writing')) return 'writing';
  if (h.includes('reading')) return 'reading-list';
  return null;
}

function parseLearning(blocks: Block[]): Record<string, Block[]> {
  const out: Record<string, Block[]> = {};
  for (const sec of splitBy(blocks, 'h2')) {
    const slug = learningSlugFor(sec.heading);
    if (slug) {
      const clean = sanitizeBlocks(sec.blocks);
      if (clean.length) out[slug] = clean;
    }
  }
  return out;
}

export async function loadLearningTopic(
  slug: string
): Promise<{ topic: LearningTopic; blocks: Block[] } | null> {
  const topic = learningTopicBySlug(slug);
  if (!topic) return null;
  const parsed = parseLearning(await getBlocks(NOTION_PAGES.learning));
  const blocks = parsed[slug]?.length ? parsed[slug] : LEARNING_FALLBACK[slug] || [];
  return { topic, blocks };
}

// ── Logs (two tracks, each with dated entries) ───────────────────────
export type LogCategory = {
  slug: string;
  title: string;
  blurb: string;
  description: string;
};

export type LogEntry = { date: string; title: string; blocks: Block[] };

export const LOG_CATEGORIES: LogCategory[] = [
  {
    slug: 'thinking-evolution',
    title: 'Thinking Evolution',
    blurb: 'How my thinking has changed over time, entry by entry.',
    description:
      'A running record of how my thinking evolves. Each entry is a snapshot of what I believed, and why, at a single point in time.',
  },
  {
    slug: 'pattern-analysis',
    title: 'Pattern Analysis',
    blurb: 'Periodic reviews, looking back for patterns across the work.',
    description:
      'Periodic step-backs to look for patterns across months of work: what shifted, what stayed constant, and what that says about the direction.',
  },
];

export const logCategoryBySlug = (slug: string): LogCategory | undefined =>
  LOG_CATEGORIES.find((c) => c.slug === slug);

const MONTHS: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
};

// "June 26, 2026" → 2026-06-26; "April 2026" → 2026-04-01. A trailing
// " — Second Entry" style subtitle is dropped before parsing.
function parseLogDate(title: string): string {
  const head = title.split(/\s*[—–]\s*/)[0].trim();
  const m = head.match(/([A-Za-z]{3,9})\.?\s+(?:(\d{1,2})\s*,?\s+)?(\d{4})/);
  if (!m) return '';
  const mon = MONTHS[m[1].slice(0, 3).toLowerCase()];
  if (!mon) return '';
  const day = m[2] ? m[2].padStart(2, '0') : '01';
  return `${m[3]}-${mon}-${day}`;
}

function logSlugFor(heading: string): string | null {
  const h = heading.toLowerCase();
  if (h.includes('pattern')) return 'pattern-analysis';
  if (h.includes('thinking') || h.includes('evolution')) return 'thinking-evolution';
  return null;
}

function parseLogs(blocks: Block[]): Record<string, LogEntry[]> {
  const out: Record<string, LogEntry[]> = {};
  for (const track of splitBy(blocks, 'h1')) {
    const slug = logSlugFor(track.heading);
    if (!slug) continue;
    const entries: LogEntry[] = [];
    for (const entry of splitBy(track.blocks, 'h2')) {
      const date = parseLogDate(entry.heading);
      if (!date) continue;
      entries.push({
        date,
        title: cleanTitle(entry.heading),
        blocks: sanitizeBlocks(entry.blocks),
      });
    }
    if (entries.length) out[slug] = entries;
  }
  return out;
}

const byDateDesc = (a: LogEntry, b: LogEntry) => (a.date < b.date ? 1 : -1);

export async function loadLogCategory(
  slug: string
): Promise<{ category: LogCategory; entries: LogEntry[] } | null> {
  const category = logCategoryBySlug(slug);
  if (!category) return null;
  const parsed = parseLogs(await getBlocks(NOTION_PAGES.logs));
  const entries = (parsed[slug]?.length ? parsed[slug] : LOG_FALLBACK[slug] || [])
    .slice()
    .sort(byDateDesc);
  return { category, entries };
}

export async function loadLogEntry(
  categorySlug: string,
  date: string
): Promise<{ category: LogCategory; entry: LogEntry } | null> {
  const loaded = await loadLogCategory(categorySlug);
  if (!loaded) return null;
  const entry = loaded.entries.find((e) => e.date === date);
  return entry ? { category: loaded.category, entry } : null;
}

// For generateStaticParams on /logs/[category]/[date].
export async function logParams(): Promise<{ category: string; date: string }[]> {
  const out: { category: string; date: string }[] = [];
  for (const c of LOG_CATEGORIES) {
    const loaded = await loadLogCategory(c.slug);
    loaded?.entries.forEach((e) => out.push({ category: c.slug, date: e.date }));
  }
  return out;
}

// ── Projects ─────────────────────────────────────────────────────────
export type ProjectSummary = { id: string; title: string; blurb: string };

export async function loadProjects(): Promise<ProjectSummary[]> {
  const children = await getChildPages(NOTION_PAGES.projects);
  if (!children.length) {
    return PROJECT_FALLBACK.map((p) => ({ id: p.id, title: p.title, blurb: p.blurb }));
  }
  return Promise.all(
    children.map(async (c) => {
      const blocks = sanitizeBlocks(await getBlocks(c.id), { dropStatus: true });
      const firstP = blocks.find((b) => b.type === 'p') as
        | { text: RichText[] }
        | undefined;
      return {
        id: c.id,
        title: cleanTitle(c.title),
        blurb: firstP ? plain(firstP.text) : '',
      };
    })
  );
}

export async function loadProject(
  id: string
): Promise<{ title: string; blocks: Block[] } | null> {
  const entry = await getEntry(id);
  if (entry.title && entry.blocks.length) {
    return {
      title: cleanTitle(entry.title),
      blocks: sanitizeBlocks(entry.blocks, { dropStatus: true }),
    };
  }
  const fb = PROJECT_FALLBACK.find((p) => p.id === id);
  if (fb) return { title: fb.title, blocks: fb.body };
  if (entry.title || entry.blocks.length) {
    return {
      title: cleanTitle(entry.title || 'Untitled'),
      blocks: sanitizeBlocks(entry.blocks, { dropStatus: true }),
    };
  }
  return null;
}

export async function projectIds(): Promise<string[]> {
  const children = await getChildPages(NOTION_PAGES.projects);
  const live = children.map((c) => c.id);
  const fb = PROJECT_FALLBACK.map((p) => p.id);
  return Array.from(new Set([...live, ...fb]));
}

// ── Home payload ─────────────────────────────────────────────────────
// The hero's WebGL scene is fed by getHomeContent. The brand forbids emoji
// everywhere, and the raw payload carries a couple (in non-rendered headings),
// so strip emoji from every field. This is emoji-ONLY: dashes, disclaimers, and
// paragraph structure are left intact so the hero's scene text is unchanged.
export async function loadHomeContent(): Promise<HomeContent> {
  const c = await getHomeContent();
  return {
    ...c,
    heroIntro: stripEmoji(c.heroIntro),
    heroQuote: stripEmoji(c.heroQuote),
    projectsIntro: stripEmoji(c.projectsIntro),
    certifications: stripEmojiBlocks(c.certifications),
    learning: stripEmojiBlocks(c.learning),
    logs: stripEmojiBlocks(c.logs),
    about: stripEmojiBlocks(c.about),
  };
}

// ── Shared parsing helper ────────────────────────────────────────────
// Split a flat block list into sections at each heading of `type`. Blocks
// before the first such heading are ignored (section intros we don't need).
type HeadingSection = { heading: string; blocks: Block[] };
function splitBy(blocks: Block[], type: 'h1' | 'h2'): HeadingSection[] {
  const out: HeadingSection[] = [];
  let cur: HeadingSection | null = null;
  for (const b of blocks) {
    if (b.type === type) {
      cur = { heading: plain((b as { text: RichText[] }).text), blocks: [] };
      out.push(cur);
    } else if (cur) {
      cur.blocks.push(b);
    }
  }
  return out;
}
