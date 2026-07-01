import {
  NOTION_PAGES,
  getSection,
  getEntry,
  plain,
  type Block,
  type RichText,
} from './notion';

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
  kind: 'index' | 'prose'; // index → cards of entries; prose → long-form page
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
    tagline: 'Thinking in the open — the principles and decisions that compound.',
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

// ── Terse builders for placeholder blocks ────────────────────────────
const rt = (content: string, extra: Partial<RichText> = {}): RichText => ({
  content,
  ...extra,
});
const h2 = (t: string): Block => ({ type: 'h2', text: [rt(t)] });
const h3 = (t: string): Block => ({ type: 'h3', text: [rt(t)] });
const p = (...text: RichText[]): Block => ({ type: 'p', text });
const li = (t: string): Block => ({ type: 'bullet', text: [rt(t)] });
const quote = (t: string): Block => ({ type: 'quote', text: [rt(t)] });
const hr = (): Block => ({ type: 'divider' });
const callout = (t: string, emoji?: string): Block => ({
  type: 'callout',
  text: [rt(t)],
  emoji,
});

// ── Placeholder entries (projects, logs) ─────────────────────────────
type PlaceholderEntry = {
  id: string;
  title: string;
  blurb: string;
  body: Block[];
};

const PLACEHOLDER_ENTRIES: Record<string, PlaceholderEntry[]> = {
  projects: [
    {
      id: 'regime-switching-vol',
      title: 'Regime-Switching Volatility Model',
      blurb:
        'A two-state hidden Markov model that separates calm from stressed markets and re-weights a vol-targeted book in response.',
      body: [
        callout(
          'Python · hmmlearn · pandas · a vol-targeted overlay tested on 20 years of S&P 500 data.',
          '📈'
        ),
        h2('The idea'),
        p(
          rt(
            'Volatility is not stationary — it clusters. Rather than fit one model to every environment, this project treats the market as switching between a small number of hidden regimes and lets the data decide which one we are in.'
          )
        ),
        h2('Method'),
        li('Fit a two-state Gaussian HMM on daily log-returns and realized volatility.'),
        li('Decode the most likely regime path with the Viterbi algorithm.'),
        li('Scale exposure inversely to the posterior probability of the stressed state.'),
        li('Walk forward with an expanding window so no future information leaks in.'),
        h2('Result'),
        p(
          rt(
            'Against a static vol-target baseline the regime overlay cut peak-to-trough drawdown by roughly a third while giving back only a small slice of return — most of the improvement came from stepping down before the worst clusters, not from timing the top.'
          )
        ),
        quote(
          'The edge was never prediction. It was sizing down fast enough when the state changed.'
        ),
      ],
    },
    {
      id: 'limit-order-book-sim',
      title: 'Limit-Order-Book Market-Maker',
      blurb:
        'An event-driven order-book simulator and a queue-aware market-making agent, tuned against replayed level-2 data.',
      body: [
        callout('C++ core · Python bindings · replayed L2 message data.', '🧮'),
        h2('The idea'),
        p(
          rt(
            'Market making is a game of inventory and queue position. This simulator rebuilds the book message-by-message so a strategy can be tested against the exact sequence of events it would have seen live.'
          )
        ),
        h2('What it does'),
        li('Reconstructs a full depth-of-book from add / cancel / execute messages.'),
        li('Models queue priority so fills depend on where an order actually sits.'),
        li('Runs an Avellaneda–Stoikov style quoting agent with inventory skew.'),
        li('Reports fill rate, adverse selection, and end-of-day inventory risk.'),
        h2('What I learned'),
        p(
          rt(
            'Most naive spreads look profitable until you charge them for adverse selection. Getting the queue model right mattered more than getting the pricing model clever.'
          )
        ),
      ],
    },
    {
      id: 'factor-backtest-engine',
      title: 'Cross-Sectional Factor Engine',
      blurb:
        'A vectorized backtester for equity factors with point-in-time data, transaction costs, and turnover control.',
      body: [
        callout('Python · NumPy · a point-in-time universe to kill survivorship bias.', '🧱'),
        h2('The idea'),
        p(
          rt(
            'A backtest is only as honest as its data. This engine was built to make the honest version easy: point-in-time membership, realistic costs, and turnover you can actually trade.'
          )
        ),
        h2('Design'),
        li('Rank names each month on value, momentum, and quality composites.'),
        li('Build long-short portfolios with sector and turnover constraints.'),
        li('Charge slippage and commission per rebalance, not just at the end.'),
        li('Decompose returns into factor exposure versus alpha.'),
        h2('Takeaway'),
        p(
          rt(
            'The clean-looking factors thinned out once costs and turnover were charged fairly — which is exactly the point of building the honest engine first.'
          )
        ),
      ],
    },
    {
      id: 'earnings-drift-ml',
      title: 'Post-Earnings Drift Classifier',
      blurb:
        'A gradient-boosted model that ranks names on the likelihood of continued drift after an earnings surprise.',
      body: [
        callout('Python · gradient boosting · purged, embargoed cross-validation.', '🤖'),
        h2('The idea'),
        p(
          rt(
            'Prices keep drifting in the direction of an earnings surprise for weeks. The question is which surprises drift and which fade — a ranking problem, not a point forecast.'
          )
        ),
        h2('Features'),
        li('Standardized unexpected earnings and revenue surprise.'),
        li('Analyst revision breadth in the days after the print.'),
        li('Pre-announcement drift and short interest.'),
        li('Liquidity and size controls so the signal is not just microcap noise.'),
        h2('Validation'),
        p(
          rt(
            'Cross-validation was purged and embargoed to stop leakage across the event window — without it the model looked far better than it had any right to.'
          )
        ),
        quote('Most of the work in ML for markets is refusing to fool yourself.'),
      ],
    },
  ],
  logs: [
    {
      id: '2026-06-half-life-of-an-edge',
      title: 'On the Half-Life of an Edge',
      blurb:
        'Every edge decays. The discipline is knowing whether you are being crowded out or were simply wrong from the start.',
      body: [
        p(rt('June 2026', { italic: true })),
        p(
          rt(
            'An edge that stops working tells you nothing on its own. Either the world learned it and arbitraged it away, or it was overfit and never real. Those two look identical on an equity curve and demand opposite responses.'
          )
        ),
        li('Crowding shows up as falling returns with rising correlation to known factors.'),
        li('Overfitting shows up as a live curve that never resembles the backtest at all.'),
        li('The honest test is out-of-sample data you had never seen when you built the thing.'),
        quote('Assume every edge is temporary and you will build systems that survive it being temporary.'),
      ],
    },
    {
      id: '2026-05-sizing-before-selection',
      title: 'Sizing Before Selection',
      blurb:
        'Which name you pick matters less than how much you bet on it. Position sizing is the decision that compounds.',
      body: [
        p(rt('May 2026', { italic: true })),
        p(
          rt(
            'It is tempting to spend all your energy on selection — the clever signal, the better model. But two people with the same signal and different sizing rules end up in completely different places.'
          )
        ),
        p(
          rt(
            'Fractional Kelly, volatility targeting, hard risk limits: none of them are glamorous, and all of them matter more than one more feature in the model.'
          )
        ),
        quote('Survive first. Optimize second.'),
      ],
    },
    {
      id: '2026-04-notebook-to-pipeline',
      title: 'From Notebook to Pipeline',
      blurb:
        'A result that only exists in a notebook is a story, not a system. The gap between the two is where discipline lives.',
      body: [
        p(rt('April 2026', { italic: true })),
        p(
          rt(
            'A notebook lets you cheat without noticing — re-running the good cell, quietly peeking at the test set. A pipeline forces the discipline: fixed inputs, fixed order, reproducible output.'
          )
        ),
        li('Same command, same result, on any machine.'),
        li('Point-in-time data so the past cannot see the future.'),
        li('Config, not hard-coded constants buried three cells down.'),
        p(
          rt(
            'The move from notebook to pipeline is the move from "I think this worked" to "this works, and here is the proof."'
          )
        ),
      ],
    },
  ],
};

// ── Placeholder long-form intros ─────────────────────────────────────
const PLACEHOLDER_INTRO: Record<SectionSlug, Block[]> = {
  projects: [
    p(
      rt(
        'A working portfolio of quant research and the infrastructure around it — models on the left, the honest tooling that keeps them honest on the right. Each one started as a question about markets and ended as something I could run.'
      )
    ),
  ],
  certifications: [
    p(
      rt(
        'Formal credentials across markets, financial modeling, and wealth management — the structured half of an education that mostly happens by building.'
      )
    ),
    h2('Completed'),
    li('Bloomberg Market Concepts (BMC) — economics, currencies, fixed income, equities.'),
    li('CFA Institute Investment Foundations — ethics, instruments, and industry structure.'),
    li('Wall Street Prep — Financial Statement & DCF Modeling.'),
    h2('In progress'),
    li('Canadian Securities Course (CSC).'),
    li('CFA Level I — candidate, target sitting next cycle.'),
    hr(),
    callout(
      'Certificates are the floor, not the ceiling — the projects are where the learning actually shows.',
      '📜'
    ),
  ],
  learning: [
    p(
      rt(
        'What I am actively studying right now. This page is deliberately a moving target — it is a log of the frontier, not a résumé.'
      )
    ),
    h2('Reading'),
    li('Advances in Financial Machine Learning — Marcos López de Prado.'),
    li('Options, Futures, and Other Derivatives — Hull.'),
    li('Active Portfolio Management — Grinold & Kahn.'),
    h2('Coursework & skills'),
    li('Stochastic calculus and the mathematics behind derivative pricing.'),
    li('Time-series econometrics — cointegration, GARCH, state-space models.'),
    li('Sharpening C++ for latency-sensitive simulation, alongside daily Python.'),
    quote('Study the thing you are about to need, not the thing that is comfortable.'),
  ],
  logs: [
    p(
      rt(
        'Short notes on markets, models, and the discipline of executing — written to think in the open and to keep myself honest over time.'
      )
    ),
  ],
  about: [
    p(
      rt(
        'I study Finance at McGill and build at the intersection of markets, data, and disciplined execution. I am drawn to the parts of investing that can be made rigorous — where a hypothesis can be written down, tested against history, and either survive the evidence or be discarded.'
      )
    ),
    h2('How I work'),
    p(
      rt(
        'I like turning vague market intuition into something concrete: a model, a backtest, a simulation I can actually run and stress. Most of that work is unglamorous — cleaning data, guarding against leakage, charging honest costs — and that is exactly the part I trust.'
      )
    ),
    h2('What I care about'),
    li('Process over outcome — good decisions, judged before the result is known.'),
    li('Risk first — survive, then compound.'),
    li('Reproducibility — if it only ran once, it never really ran.'),
    hr(),
    p(
      rt('Reach me at '),
      rt('justin.gianfelice@mail.mcgill.ca', {
        href: 'mailto:justin.gianfelice@mail.mcgill.ca',
      }),
      rt('.')
    ),
  ],
};

// ── Loaders (live Notion first, placeholder fallback) ────────────────
export type SectionEntry = { id: string; title: string; blurb: string };

export type LoadedSection = {
  meta: SectionMeta;
  intro: Block[];
  entries: SectionEntry[];
  live: boolean;
};

export async function loadSection(
  slug: SectionSlug
): Promise<LoadedSection | null> {
  const meta = sectionBySlug(slug);
  if (!meta) return null;

  const { blocks, children } = await getSection(NOTION_PAGES[meta.notionKey]);
  const intro = blocks.length ? blocks : PLACEHOLDER_INTRO[slug];

  let entries: SectionEntry[] = [];
  let live = blocks.length > 0;

  if (meta.kind === 'index') {
    if (children.length) {
      live = true;
      entries = await Promise.all(
        children.map(async (c) => {
          const { blocks: b } = await getEntry(c.id);
          const firstP = b.find((x) => x.type === 'p') as
            | { text: RichText[] }
            | undefined;
          return {
            id: c.id,
            title: c.title,
            blurb: firstP ? plain(firstP.text) : '',
          };
        })
      );
    } else {
      entries = (PLACEHOLDER_ENTRIES[slug] || []).map((e) => ({
        id: e.id,
        title: e.title,
        blurb: e.blurb,
      }));
    }
  }

  return { meta, intro, entries, live };
}

export type LoadedEntry = { meta: SectionMeta; title: string; blocks: Block[] };

export async function loadEntry(
  slug: SectionSlug,
  id: string
): Promise<LoadedEntry | null> {
  const meta = sectionBySlug(slug);
  if (!meta) return null;

  const entry = await getEntry(id);
  if (entry.title && entry.blocks.length) {
    return { meta, title: entry.title, blocks: entry.blocks };
  }

  const ph = (PLACEHOLDER_ENTRIES[slug] || []).find((e) => e.id === id);
  if (ph) return { meta, title: ph.title, blocks: ph.body };

  if (entry.title || entry.blocks.length) {
    return { meta, title: entry.title || 'Untitled', blocks: entry.blocks };
  }
  return null;
}

// For generateStaticParams — union of live child ids and placeholder ids.
export async function entryIds(slug: SectionSlug): Promise<string[]> {
  const meta = sectionBySlug(slug);
  if (!meta || meta.kind !== 'index') return [];
  const { children } = await getSection(NOTION_PAGES[meta.notionKey]);
  const live = children.map((c) => c.id);
  const ph = (PLACEHOLDER_ENTRIES[slug] || []).map((e) => e.id);
  return Array.from(new Set([...live, ...ph]));
}
