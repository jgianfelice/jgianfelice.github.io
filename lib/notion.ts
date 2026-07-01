import { Client } from '@notionhq/client';

// ── Notion as headless CMS ─────────────────────────────────────────
// The site reads live from your Notion workspace. You keep editing in
// Notion exactly as before; the deployed site reflects every change.
//
// Page IDs from your actual workspace:
export const NOTION_PAGES = {
  home: '32fc4504-c682-80a0-9b9d-c8d93ee5b7f8',
  projects: '32fc4504-c682-80ba-bacd-cd289f577551',
  certifications: '32fc4504-c682-8071-bcf7-db2160635fe1',
  learning: '339c4504-c682-813b-b0fe-d641033a9356',
  logs: '32fc4504-c682-80c2-a22a-f3198e54ec11',
  about: '32fc4504-c682-8053-a1ef-eb115308cfe0',
};

const notionToken = process.env.NOTION_TOKEN;

export const notion = notionToken
  ? new Client({ auth: notionToken })
  : null;

// Real Notion ids are 32 hex chars (dashed or not). Our placeholder
// entries use human slugs — skip the API for those so the build stays
// quiet and we fall straight through to placeholder content.
const isNotionId = (id: string): boolean =>
  /^[0-9a-f]{32}$/i.test(id.replace(/-/g, ''));

// Convert Notion blocks → plain structured content our components render.
export type Block =
  | { type: 'h1' | 'h2' | 'h3' | 'p' | 'quote'; text: RichText[] }
  | { type: 'bullet'; text: RichText[] }
  | { type: 'divider' }
  | { type: 'callout'; text: RichText[]; emoji?: string };

export type RichText = {
  content: string;
  bold?: boolean;
  italic?: boolean;
  href?: string | null;
};

function parseRichText(rich: any[]): RichText[] {
  return (rich || []).map((r) => ({
    content: r.plain_text,
    bold: r.annotations?.bold,
    italic: r.annotations?.italic,
    href: r.href,
  }));
}

export async function getBlocks(pageId: string): Promise<Block[]> {
  if (!notion || !isNotionId(pageId)) return [];
  const blocks: Block[] = [];
  let cursor: string | undefined = undefined;
  try {
    do {
      const res: any = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      });
      for (const b of res.results) {
        switch (b.type) {
          case 'heading_1':
            blocks.push({ type: 'h1', text: parseRichText(b.heading_1.rich_text) });
            break;
          case 'heading_2':
            blocks.push({ type: 'h2', text: parseRichText(b.heading_2.rich_text) });
            break;
          case 'heading_3':
            blocks.push({ type: 'h3', text: parseRichText(b.heading_3.rich_text) });
            break;
          case 'paragraph':
            blocks.push({ type: 'p', text: parseRichText(b.paragraph.rich_text) });
            break;
          case 'bulleted_list_item':
            blocks.push({ type: 'bullet', text: parseRichText(b.bulleted_list_item.rich_text) });
            break;
          case 'numbered_list_item':
            blocks.push({ type: 'bullet', text: parseRichText(b.numbered_list_item.rich_text) });
            break;
          case 'quote':
            blocks.push({ type: 'quote', text: parseRichText(b.quote.rich_text) });
            break;
          case 'callout':
            blocks.push({
              type: 'callout',
              text: parseRichText(b.callout.rich_text),
              emoji: b.callout.icon?.emoji,
            });
            break;
          case 'divider':
            blocks.push({ type: 'divider' });
            break;
        }
      }
      cursor = res.has_more ? res.next_cursor : undefined;
    } while (cursor);
  } catch {
    // Notion unreachable or page not shared with the integration — return
    // whatever we gathered so callers can fall back to placeholder content.
  }
  return blocks;
}

// Child pages of a parent (e.g. all project pages, all log entries).
export async function getChildPages(
  pageId: string
): Promise<{ id: string; title: string }[]> {
  if (!notion) return [];
  const out: { id: string; title: string }[] = [];
  let cursor: string | undefined = undefined;
  try {
    do {
      const res: any = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      });
      for (const b of res.results) {
        if (b.type === 'child_page') {
          out.push({ id: b.id, title: b.child_page.title });
        }
      }
      cursor = res.has_more ? res.next_cursor : undefined;
    } while (cursor);
  } catch {
    // Degrade gracefully to placeholder listings upstream.
  }
  return out;
}

// Retrieve a single page's title — used by detail routes addressed only by id.
export async function getPageTitle(pageId: string): Promise<string> {
  if (!notion || !isNotionId(pageId)) return '';
  try {
    const page: any = await notion.pages.retrieve({ page_id: pageId });
    const props = page.properties || {};
    for (const key of Object.keys(props)) {
      const prop = props[key];
      if (prop?.type === 'title') {
        return (prop.title || []).map((t: any) => t.plain_text).join('');
      }
    }
    return page.child_page?.title || '';
  } catch {
    return '';
  }
}

export type Entry = { id: string; title: string; blocks: Block[] };

// A single detail page (a project or a log entry): title + rendered blocks.
export async function getEntry(pageId: string): Promise<Entry> {
  const [title, blocks] = await Promise.all([getPageTitle(pageId), getBlocks(pageId)]);
  return { id: pageId, title, blocks };
}

export type Section = { blocks: Block[]; children: { id: string; title: string }[] };

// A section landing page: its own prose plus any child pages beneath it.
export async function getSection(pageId: string): Promise<Section> {
  const [blocks, children] = await Promise.all([getBlocks(pageId), getChildPages(pageId)]);
  return { blocks, children };
}

// ── Homepage content model ─────────────────────────────────────────
// The interactive home experience reads everything from Notion in one
// server-side pass, shaped into the five sections it diagrams in 3D.

export const plain = (rt: RichText[]) => (rt || []).map((r) => r.content).join('');
const firstParagraph = (blocks: Block[]) =>
  plain(((blocks.find((b) => b.type === 'p') as any)?.text) || []);

export type ProjectItem = { id: string; title: string; blurb: string };

export type HomeContent = {
  heroIntro: string;
  heroQuote: string;
  projectsIntro: string;
  projects: ProjectItem[];
  certifications: Block[];
  learning: Block[];
  logs: Block[];
  about: Block[];
};

export async function getHomeContent(): Promise<HomeContent> {
  if (!notion) {
    return {
      heroIntro: '',
      heroQuote: '',
      projectsIntro: '',
      projects: [],
      certifications: [],
      learning: [],
      logs: [],
      about: [],
    };
  }

  const [home, projectsBlocks, certifications, learning, logs, about, projectPages] =
    await Promise.all([
      getBlocks(NOTION_PAGES.home),
      getBlocks(NOTION_PAGES.projects),
      getBlocks(NOTION_PAGES.certifications),
      getBlocks(NOTION_PAGES.learning),
      getBlocks(NOTION_PAGES.logs),
      getBlocks(NOTION_PAGES.about),
      getChildPages(NOTION_PAGES.projects),
    ]);

  const projects: ProjectItem[] = await Promise.all(
    projectPages.map(async (p) => {
      const blocks = await getBlocks(p.id);
      return { id: p.id, title: p.title, blurb: firstParagraph(blocks) };
    })
  );

  const quote = plain(((home.find((b) => b.type === 'quote') as any)?.text) || []);

  return {
    heroIntro: firstParagraph(home),
    heroQuote: quote,
    projectsIntro: firstParagraph(projectsBlocks),
    projects,
    certifications,
    learning,
    logs,
    about,
  };
}
