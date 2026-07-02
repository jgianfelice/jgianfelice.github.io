import type { Block } from './notion';
import { p, quote, term, termLi, link } from './blocks';

// ── Authored fallbacks ──────────────────────────────────────────────
// Live Notion is the source of truth (parsed at build time). These are the
// resilient defaults shown only if Notion is unreachable during a build, so
// the site never renders empty. Kept faithful to the real content.

export const LEARNING_FALLBACK: Record<string, Block[]> = {
  'technical-skills': [
    term('Python', 'Quantitative modeling, data analysis, backtesting, and ML pipelines. The primary tool across all project work.'),
    term('Excel & Financial Modeling', 'Production-ready financial tools: complex formula architecture, dynamic outputs, and model design.'),
    term('Data Analysis', 'Cleaning, structuring, and extracting insight from real datasets across quant projects and the Gumroad tool.'),
    term('Machine Learning', 'Gradient boosting, ensemble methods, feature engineering, and cross-validation, applied in the live Numerai competition.'),
    term('Automated Trading Systems', 'A personal automated trading model derived from QuantProcess, designed to run consistently without intervention.'),
    term('Dashboard & Interface Design', 'Bloomberg-style browser dashboards for real-time market monitoring: custom layout, live data feeds, and signal display.'),
  ],
  'finance-markets': [
    term('Quantitative Strategy', 'Backtesting frameworks, execution modeling, and strategy design. What makes a strategy robust rather than fragile in real markets.'),
    term('Capital Allocation', 'How great allocators think and make decisions, studied in depth through the CapAxis casebook.'),
    term('Decision Psychology', 'Behavioural finance and investment decision-making: how instinct, bias, and process interact under pressure.'),
    term('Capital Markets', 'Equities, fixed income, and derivatives, studied formally through CMSA and BMC and applied through live market observation.'),
    term('Macroeconomic Analysis', 'Tracking macro indicators and regime conditions, and how the broader environment shapes positioning.'),
    term('Behavioural Finance', 'How cognitive bias and emotion affect investment decisions, studied through Duke and applied through ongoing decision tracking.'),
  ],
  'university-courses': [
    termLi('Calculus 2', 'Mathematical foundations'),
    termLi('Linear Algebra & Probability', 'Vectors, matrices, probability theory, and statistical foundations'),
    termLi('Business Statistics', 'Statistical reasoning and data interpretation for business decisions'),
    termLi('Financial Accounting', 'Financial statements and reporting standards'),
    termLi('Introduction to Finance', 'Corporate finance, valuation, and capital markets'),
    termLi('Managerial Economics', 'Economic reasoning applied to strategic decisions'),
    termLi('The Firm in the Macroeconomy', 'How macro forces shape firm behaviour and investment conditions'),
    termLi('Geography of the World Economy', 'How trade, capital flows, and economic geography shape markets'),
    termLi('International Business', 'Cross-border commerce, global strategy, and market entry'),
    termLi('Information Technology Management', 'Managing technology systems and digital infrastructure'),
    termLi('Digital Consulting', 'Consulting frameworks applied to technology-driven challenges'),
    termLi('Operations Management', 'Process design, efficiency, and systems thinking'),
    termLi('Intro to Political Theory', 'Frameworks for institutions, power, and governance'),
    termLi('Social Psychology', 'How individuals think, influence, and behave in social contexts'),
    termLi('Principles of Marketing', 'Market positioning, consumer behaviour, and strategic communication'),
    termLi('Organizational Behaviour', 'How people and teams operate inside institutions'),
    termLi('Expressive Analysis', 'Structured thinking, argumentation, and written communication'),
    termLi('Data Programming', 'Python and programming foundations'),
  ],
  'soft-skills': [
    term('Problem Solving', 'Breaking complex problems into components, finding the simplest working solution, then improving from there.'),
    term('Structured Execution', 'Systems that work consistently, not just once: checklists, templates, weekly logs, and documentation.'),
    term('Written Communication', 'Translating complex ideas into clear outputs across posts, project write-ups, and research.'),
    term('Client & Team Collaboration', 'Working directly with clients and teams to communicate findings and drive decisions.'),
    term('Discipline & Consistency', 'Showing up to the same process week over week, reflected in logs, Numerai submissions, and ongoing work.'),
    term('Consulting & Client Delivery', 'Translating analysis into usable recommendations. Delivered a full strategic brief and financial model to a founder.'),
  ],
  writing: [
    p({ content: 'Writing publicly about markets, investing, and how I think. Essays and analysis published on an ongoing basis on Substack.' }),
    link('Read on Substack', 'https://substack.com/@jgianfelice'),
  ],
  'reading-list': [
    term('Best Practices of Elite Advisors', 'Matt Oechsli & Stephen Boswell'),
    p({ content: 'What separates top advisors is not product knowledge, it is relationship depth and systematic client development.' }),
    term('Swindlers', 'Al Rosen & Mark Rosen'),
    p({ content: 'How financial fraud works in practice, and how weak accounting standards and analyst incentives let it persist.' }),
    term('Big Money Thinks Small', 'Joel Tillinghast'),
    p({ content: 'Patient, bottom-up investing. The edge comes from knowing a business deeply and staying rational when the market is not.' }),
    term('The Intelligent Investor', 'Benjamin Graham'),
    p({ content: 'The foundational text on value investing. Margin of safety and Mr. Market are the two ideas worth internalizing for life.' }),
    term('The Psychology of Money', 'Morgan Housel'),
    p({ content: 'Wealth is built by behaviour more than intelligence. Time in the market and avoiding catastrophic mistakes matter most.' }),
    term('Confessions of a Stockbroker', 'Alfie Bruton'),
    p({ content: 'A candid look at the sales culture inside brokerage, and how client interests and broker incentives diverge.' }),
    term('The Gorilla Game', 'Geoffrey Moore, Paul Johnson & Tom Kippola'),
    p({ content: 'How to identify and invest in technology companies positioned to dominate high-growth categories.' }),
    term('Secrets of the Millionaire Mind', 'T. Harv Eker'),
    p({ content: 'Mindset and money blueprints. The internal framework you operate from matters as much as the external strategy.' }),
    term('Gung Ho!', 'Ken Blanchard & Sheldon Bowles'),
    p({ content: 'Three principles for building motivated, high-performing teams, drawn from how natural systems work.' }),
    term('Outliers', 'Malcolm Gladwell'),
    p({ content: 'Success is shaped far more by circumstance, timing, and accumulated opportunity than by talent alone.' }),
    term('Good to Great', 'Jim Collins'),
    p({ content: 'What separates good companies from great ones: disciplined people, disciplined thought, and disciplined action over time.' }),
  ],
};

export type FallbackLogEntry = { date: string; title: string; blocks: Block[] };

export const LOG_FALLBACK: Record<string, FallbackLogEntry[]> = {
  'thinking-evolution': [
    {
      date: '2026-06-26',
      title: 'June 26, 2026',
      blocks: [
        p({ content: 'The quality of a system matters more than the quality of any single output it produces. I am more interested in building the underlying systems and habits than in optimizing individual deliverables.' }),
        quote('Finishing things and launching things are not the same.'),
      ],
    },
    {
      date: '2026-06-01',
      title: 'June 1, 2026',
      blocks: [
        p({ content: 'Consistency compounds. The edge is in staying in the game long enough for small advantages to accumulate, not in finding a single large one.' }),
      ],
    },
    {
      date: '2026-04-27',
      title: 'April 27, 2026',
      blocks: [
        p({ content: 'Execution separates people more than ideas do. Most people can form a reasonable thesis; fewer can build the model, run the test, write the report, and deliver it. That gap is where I am focused.' }),
      ],
    },
    {
      date: '2026-04-01',
      title: 'April 2026',
      blocks: [
        p({ content: 'Markets are harder to beat than most people admit. I am more interested in process than returns right now: how decisions get made matters more to me than what the decision was.' }),
      ],
    },
  ],
  'pattern-analysis': [
    {
      date: '2026-06-26',
      title: 'June 26, 2026 — Second Entry',
      blocks: [
        p({ content: 'Looking back over the last three months (April to June 2026). The mix shifted from pure technical building to a combination of building and operating.' }),
      ],
    },
    {
      date: '2026-04-01',
      title: 'April 2026 — First Entry',
      blocks: [
        p({ content: 'Looking back over the last six months (October 2025 to April 2026). Quantitative modeling dominated, and a clear thread emerged: I keep gravitating toward systematic approaches.' }),
      ],
    },
  ],
};

export type FallbackProject = { id: string; title: string; blurb: string; body: Block[] };

const proj = (id: string, title: string, blurb: string): FallbackProject => ({
  id,
  title,
  blurb,
  body: [p({ content: blurb })],
});

export const PROJECT_FALLBACK: FallbackProject[] = [
  proj('339c4504-c682-81a5-9578-fdb3f1a1aaf0', 'Backtrader — RealisticExecutionModel', 'An open-source contribution to the Backtrader framework: a realistic execution model that charges the trading costs most backtests quietly ignore.'),
  proj('339c4504-c682-81fa-9ff9-cd460c88b40b', 'QuantProcess Trading Model', 'A systematic trading model built end to end, from research process to a repeatable, testable strategy.'),
  proj('339c4504-c682-811a-8bdd-d545d7899261', 'Numerai Challenge', 'Competing in the live Numerai tournament, where gradient-boosted models ranked in the top 10% by showing up every week.'),
  proj('339c4504-c682-817f-b5b8-f3b6562d826d', 'CapAxis — Investment Decision Study', 'A three-part study of capital allocation, natural decision style, and behaviour under pressure, synthesized into one concluding report.'),
  proj('350c4504-c682-81ee-b2e1-f134d2a3178f', 'Equity Research Report — Spotify Technology S.A.', 'An initiating equity research report on Spotify Technology S.A. with a stated rating and price target.'),
  proj('339c4504-c682-8160-ae1f-d3c996b7c128', 'Gumroad Excel Tool — Profit Engine', 'A production-ready Excel profit-engine tool, built and shipped for sale.'),
  proj('350c4504-c682-8188-af13-f4cc411364f2', 'Rainmark — Growth Strategy Engagement', 'A growth strategy engagement: a full strategic brief and financial model delivered to a founder.'),
  proj('37ec4504-c682-8192-bcd1-fbb17af185d0', 'Personal Bloomberg — Market War Room', 'A personal Bloomberg-style market war room for real-time monitoring and macro regime tracking.'),
  proj('339c4504-c682-8186-895d-c2a6692a7e79', 'Kynexis — Decision Intelligence Platform', 'A decision intelligence platform bringing structure to how decisions actually get made.'),
];
