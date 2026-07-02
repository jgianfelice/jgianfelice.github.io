import type { Block, RichText } from './notion';

// Terse builders for authoring structured content in code (fallbacks and
// hand-authored sections). Mirrors the shape getBlocks() produces from Notion.
export const rt = (content: string, extra: Partial<RichText> = {}): RichText => ({
  content,
  ...extra,
});

export const h2 = (t: string): Block => ({ type: 'h2', text: [rt(t)] });
export const h3 = (t: string): Block => ({ type: 'h3', text: [rt(t)] });
export const p = (...text: RichText[]): Block => ({ type: 'p', text });
export const li = (...text: RichText[]): Block => ({ type: 'bullet', text });
export const quote = (t: string): Block => ({ type: 'quote', text: [rt(t)] });
export const hr = (): Block => ({ type: 'divider' });

// "Label — value": a bold label, an em-dash divider, then the description.
// The em-dash here is intentional and preserved by the sanitizer.
export const term = (label: string, desc: string): Block => ({
  type: 'p',
  text: [rt(label, { bold: true }), rt(` — ${desc}`)],
});

// A bullet whose lead-in term is bold, then a dash divider, then detail.
export const termLi = (label: string, desc: string): Block => ({
  type: 'bullet',
  text: [rt(label, { bold: true }), rt(` — ${desc}`)],
});

export const link = (label: string, href: string): Block => ({
  type: 'p',
  text: [rt(label, { href })],
});
