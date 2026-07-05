import type { Block, RichText } from './notion';

// ── Brand hygiene for Notion-authored content ───────────────────────
// Two jobs, applied on the way from Notion → rendered blocks:
//   1. Strip every emoji (the brand is mono, cool, and deliberately plain).
//   2. Replace grammatical em/en dashes with proper punctuation, while
//      KEEPING dashes that act as dividers — "Label — value", headings, and
//      numeric ranges (e.g. 2020–2024). Optionally drop status/date-range
//      metadata lines (used for the projects list).

// Pictographs, emoticons, transport, misc symbols, dingbats, flags, plus the
// variation selector and ZWJ that compose them. Deliberately EXCLUDES the
// arrows block (U+2190–21FF) so the site's "→" / "←" affordances survive.
const EMOJI =
  /[\u{1F000}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B00}-\u{2BFF}\u{1F1E6}-\u{1F1FF}️‍]/gu;

export function stripEmoji(s: string): string {
  return s.replace(EMOJI, '');
}

// Emoji-only pass that leaves structure and punctuation untouched. Used for the
// home payload feeding the WebGL scene: the brand forbids emoji everywhere, but
// the hero's scene text must not otherwise change, so we strip emoji WITHOUT
// de-grammaring dashes or dropping disclaimer/status lines.
export function stripEmojiBlocks(blocks: Block[]): Block[] {
  return blocks.map((b) => {
    if ('text' in b && Array.isArray((b as { text?: RichText[] }).text)) {
      const runs = (b as { text: RichText[] }).text.map((r) => ({
        ...r,
        content: stripEmoji(r.content),
      }));
      return { ...(b as object), text: runs } as Block;
    }
    return b;
  });
}

// For titles / headings: strip emoji, collapse whitespace, drop a trailing
// status paren like "(Active)", and trim.
export function cleanTitle(s: string): string {
  return stripEmoji(s)
    .replace(/\s*\((?:active|completed?|in[\s-]?progress|ongoing|wip)\)\s*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Replace a spaced em/en dash (or " -- ") with a comma, but keep numeric
// ranges (digit–digit) intact.
export function degrammarDashes(s: string): string {
  return s
    .replace(/(\S)\s*[—–]\s*(\S)/g, (_m, a: string, b: string) =>
      /\d/.test(a) && /\d/.test(b) ? `${a}–${b}` : `${a}, ${b}`
    )
    .replace(/(\S)\s+--\s+(\S)/g, '$1, $2');
}

// Process one paragraph/bullet's runs. A dash at the very start of a run that
// directly follows a bold run is a "Label — value" divider and is preserved.
function sanitizeRuns(runs: RichText[]): RichText[] {
  return (runs || []).map((r, i) => {
    let content = stripEmoji(r.content);
    const prev = runs[i - 1];
    const prevIsLabel = i > 0 && !!prev.bold && !prev.href;
    let lead = '';
    if (prevIsLabel) {
      const m = content.match(/^(\s*[—–]\s*)/);
      if (m) {
        lead = ' — ';
        content = content.slice(m[0].length);
      }
      // A status phrase opening a "Label — value" entry ("Active development.
      // Currently using…") is a badge, not prose — drop it. Scoped to divider
      // values only, so ordinary sentences ("monthly active users") survive.
      content = content.replace(
        /^(?:active|ongoing|in[ -]?progress|completed?)(?:\s+\w+)?\.\s*/i,
        ''
      );
    }
    return { ...r, content: lead + degrammarDashes(content) };
  });
}

const STATUS_LINE =
  /^(completed?|in[\s-]?progress|ongoing|active|done|shipped|live|wip)\s*(?:[|·:—–-]\s*.*)?$/i;
const DATE_RANGE_LINE =
  /^[A-Za-z]{3,9}\.?\s*\d{4}\s*[—–-]\s*[A-Za-z]{3,9}\.?\s*\d{4}$/;
const DISCLAIMER =
  /(this section grows as i do|grows as i do|more being added|deliberately a moving target|added when actively in use|no finished product required|no fixed schedule|not a diary\.?\s*not a checklist)/i;
const TRAIL_STATUS =
  /(?:[,;]\s*|,?\s*now\s+)(completed?|ongoing|in[\s-]?progress|active)\b\.?\s*$/i;
// A leading status badge on a line, e.g. "Active | Competing…" or "Live — …".
const LEADING_STATUS =
  /^(completed?|in[\s-]?progress|ongoing|active|done|shipped|live|wip)\s*[|·:—–-]\s+/i;
// A trailing status clause, e.g. "…pipeline, active competitor in live rounds".
const TRAIL_ACTIVE = /\s*[,;]\s*(active|live|ongoing|in[\s-]?progress)\b[^.;]*$/i;
// A leading "Current " on a status-y heading ("Current Standing" → "Standing").
const LEADING_CURRENT = /^current\s+/i;

// One-line cleanup for standalone strings (blurbs, intros): emoji out,
// leading "Active | …" badges and trailing ", active …" clauses out,
// grammatical dashes to commas.
export function cleanStatusText(s: string): string {
  return degrammarDashes(
    stripEmoji(s || '')
      .replace(LEADING_STATUS, '')
      .replace(TRAIL_ACTIVE, '')
      .replace(TRAIL_STATUS, '.')
  ).trim();
}

// Emoji + de-grammar only, structure-preserving — no disclaimer/status drops.
// Used for the home payload feeding the hero and its mobile tap previews, so
// section descriptions lose their em-dashes without losing whole paragraphs.
export function cleanBlocks(blocks: Block[]): Block[] {
  return blocks.map((b) => {
    if ('text' in b && Array.isArray((b as { text?: RichText[] }).text)) {
      const src = (b as { text: RichText[] }).text;
      const isHeading = b.type === 'h1' || b.type === 'h2' || b.type === 'h3';
      const runs = isHeading
        ? src.map((r) => ({
            ...r,
            // Headings keep their divider dashes but lose emoji and any
            // trailing "(Active)"-style status parens.
            content: stripEmoji(r.content).replace(
              /\s*\((?:active|completed?|in[\s-]?progress|ongoing|wip)\)\s*$/i,
              ''
            ),
          }))
        : sanitizeRuns(src);
      return { ...(b as object), text: runs } as Block;
    }
    return b;
  });
}

const textOf = (b: Block): string => {
  const t = (b as { text?: RichText[] }).text;
  return (t || []).map((r) => r.content).join('');
};

export type SanitizeOpts = { dropStatus?: boolean };

// Clean a run of blocks: drop disclaimers (always) and status/date-range
// metadata lines (when dropStatus), then de-emoji + de-grammar the rest.
export function sanitizeBlocks(blocks: Block[], opts: SanitizeOpts = {}): Block[] {
  const out: Block[] = [];
  for (const b of blocks) {
    const plainText = textOf(b).trim();

    if (plainText && DISCLAIMER.test(plainText)) continue;

    if (opts.dropStatus && (b.type === 'p' || b.type === 'callout' || b.type === 'quote')) {
      const hasYear = /\b(19|20)\d{2}\b/.test(plainText);
      const wordCount = plainText.split(/\s+/).length;
      if ((STATUS_LINE.test(plainText) && (hasYear || wordCount <= 4)) ||
          DATE_RANGE_LINE.test(plainText)) {
        continue;
      }
    }

    if ('text' in b && Array.isArray((b as { text?: RichText[] }).text)) {
      const src = (b as { text: RichText[] }).text;
      // In a heading, a dash is structural ("Part 1 — Casebook", a Label —
      // value divider), so keep it. Only strip emoji there. Prose runs get
      // the full de-grammar treatment.
      const isHeading = b.type === 'h1' || b.type === 'h2' || b.type === 'h3';
      const runs = isHeading
        ? src.map((r) => ({ ...r, content: stripEmoji(r.content) }))
        : sanitizeRuns(src);
      if (opts.dropStatus && runs.length) {
        if (isHeading) {
          // "Current Standing" → "Standing" (drop the active-implying lead).
          runs[0] = { ...runs[0], content: runs[0].content.replace(LEADING_CURRENT, '') };
        } else {
          // Strip a leading status badge ("Active | …") and a trailing status
          // clause ("…, active competitor in live rounds"), plus the older
          // ", now complete" trailer.
          runs[0] = { ...runs[0], content: runs[0].content.replace(LEADING_STATUS, '') };
          const li = runs.length - 1;
          const cleaned = runs[li].content.replace(TRAIL_STATUS, '.').replace(TRAIL_ACTIVE, '');
          if (cleaned !== runs[li].content) runs[li] = { ...runs[li], content: cleaned };
        }
      }
      out.push({ ...(b as object), text: runs } as Block);
    } else {
      out.push(b);
    }
  }
  return out;
}
