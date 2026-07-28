import Tilt from './Tilt';

// ── Bespoke case-study layout for Kynexis, the flagship project. ──────────
// Instead of the generic Prose stack, this renders a designed, varied,
// "alive" page: every band has its own shape (stat grid, pull-quote,
// stepped pipeline, signal wall, privacy boundary, build grid, hand-over),
// tied to the site's ice world with glass tiles, idle drift, cursor tilt,
// and a few slow instrument ornaments. Motion is idle/hover only — the page
// loads whole, no scroll-staged reveals — and all of it respects
// prefers-reduced-motion via the injected stylesheet below.

const STATS = [
  { v: '18', l: 'behavioral signals', s: 'plus 2 desk-level detectors' },
  { v: '490', l: 'synthetic traders', s: 'every signal tested blind' },
  { v: '30 yrs', l: 'of real market data', s: 'behind the validation' },
  { v: '3', l: 'desktop platforms', s: 'macOS · Windows · Linux' },
];

const PIPELINE = [
  { n: '01', t: 'Trade placed', d: 'The professional trades normally, on TradingView or any other platform.' },
  { n: '02', t: 'Screen read', d: 'A local vision service reads the order on-device by OCR: ticker, direction, platform.' },
  { n: '03', t: 'Behavior scored', d: 'Eighteen signals weigh the decision against the trader’s own history.' },
  { n: '04', t: 'Insight surfaces', d: 'A plain-language alert appears, with the evidence that triggered it.' },
  { n: '05', t: 'Firm footprint', d: 'Only a sealed envelope, pattern and severity, ever leaves the machine.' },
];

const SIGNALS: { tier: string; note: string; items: string[] }[] = [
  {
    tier: 'Strong',
    note: 'held up cleanly in blind testing',
    items: ['Loss aversion', 'Revenge trading', 'Overconfidence', 'Attribution error', 'Emotional sizing', 'Conviction sizing'],
  },
  {
    tier: 'Footprint',
    note: 'a measurable trace, reported as behavior, not proven bias',
    items: ['Trend following', 'Herding'],
  },
  {
    tier: 'Desk-level',
    note: 'patterns across a team, never an individual',
    items: ['Consensus clustering', 'Senior-influence clustering'],
  },
  {
    tier: 'Lower-confidence',
    note: 'kept, but deliberately down-weighted',
    items: ['Stop discipline', 'Contrarian courage', 'Bias self-correction'],
  },
];

const BUILT = [
  { t: 'Behavioral engine', d: 'A scoring engine, an on-device vision service, a desktop application, and web views for firms and desks.' },
  { t: 'Privacy boundary', d: 'Envelope-only messaging over a closure-table model of a firm’s reporting structure, proven in code and covered by tests.' },
  { t: 'Validation harness', d: 'A synthetic-trader generator and a written report that grades every signal on real market data.' },
  { t: 'Signing-ready builds', d: 'Reproducible installers for three platforms, full documentation, and a diligence data room.' },
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="font-mono text-[0.72rem] text-faint/80">{'//////'}</span>
      <h2 className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.24em] text-accent">
        {children}
      </h2>
    </div>
  );
}

export default function KynexisShowcase() {
  return (
    <div className="[perspective:1200px]">
      <style>{kxStyles}</style>

      {/* ── Lead: tagline + instrument signal-field ornament ───────────── */}
      <section className="relative">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.24em] text-faint">
          Passive behavioral intelligence for investment professionals
        </p>
        <p className="mt-5 max-w-[18ch] font-serif text-[2.1rem] font-light leading-[1.05] tracking-[-0.015em] text-ink md:max-w-[22ch] md:text-[3.1rem]">
          See the decision, not just the trade.
        </p>

        {/* a quiet instrument field: tick marks with a slow scanning sweep */}
        <div className="kx-field relative mt-9 h-12 overflow-hidden rounded-lg border border-line/70">
          <div className="kx-ticks absolute inset-0" aria-hidden="true" />
          <div className="kx-sweep absolute inset-y-0 -left-1/3 w-1/3" aria-hidden="true" />
        </div>
      </section>

      {/* ── Stat band ──────────────────────────────────────────────────── */}
      <section className="mt-16 grid grid-cols-2 gap-4 md:mt-20 md:grid-cols-4">
        {STATS.map((s, i) => (
          <Tilt key={s.l} max={7}>
            <div
              className="tile tile-lift floaty h-full rounded-2xl p-5 md:p-6"
              style={{ animationDelay: `${i * 0.9}s, 0s`, animationDuration: '7s, 0s' }}
            >
              <div className="font-serif text-4xl font-light leading-none tracking-[-0.01em] text-ink md:text-5xl">
                {s.v}
              </div>
              <div className="mt-3 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-muted">
                {s.l}
              </div>
              <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint/90">
                {s.s}
              </div>
            </div>
          </Tilt>
        ))}
      </section>

      {/* ── The shift: pull-quote + supporting column ──────────────────── */}
      <section className="mt-24 grid grid-cols-1 gap-8 md:mt-28 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-6 md:pr-6">
          <Label>The shift</Label>
          <p className="font-serif text-[1.7rem] font-light leading-[1.15] tracking-[-0.01em] text-ink md:text-[2.2rem]">
            Most tools measure the outcome. Kynexis measures the decision behind it.
          </p>
        </div>
        <div className="space-y-5 text-[1.02rem] leading-[1.7] text-muted md:col-span-6 md:pt-12">
          <p>
            Behavioral risk is the risk a firm can least see. A trader doubles down to win back a
            loss, sizes up on conviction that accuracy does not support, or slides into overtrading,
            and usually none of it is visible until it has already cost money.
          </p>
          <p>
            Journaling tools ask traders to report on themselves, exactly when self-reporting is
            least honest. Trade surveillance watches the fills, not the reasoning. Kynexis was built
            to close that gap.
          </p>
        </div>
      </section>

      {/* ── Pipeline: stepped, with a traveling instrument pulse ───────── */}
      <section className="mt-24 md:mt-28">
        <Label>How it works</Label>

        {/* desktop timeline rail + numbered nodes */}
        <div className="relative mb-3 hidden h-12 md:block" aria-hidden="true">
          <div className="kx-rail absolute left-[10%] right-[10%] top-1/2 h-px -translate-y-1/2">
            <div className="kx-pulse absolute inset-y-0 left-0 w-1/4" />
          </div>
          <div className="relative grid h-full grid-cols-5">
            {PIPELINE.map((p) => (
              <div key={p.n} className="flex items-center justify-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-elevated font-mono text-[0.7rem] text-accent shadow-sm">
                  {p.n}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {PIPELINE.map((p) => (
            <Tilt key={p.n} max={6}>
              <div className="tile tile-lift h-full rounded-2xl p-5">
                <span className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-line font-mono text-[0.62rem] text-accent md:hidden">
                  {p.n}
                </span>
                <div className="font-serif text-[1.12rem] font-normal leading-tight text-ink">
                  {p.t}
                </div>
                <p className="mt-2 text-[0.9rem] leading-[1.55] text-muted">{p.d}</p>
              </div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* ── The engine: signal wall, grouped by confidence ─────────────── */}
      <section className="mt-24 md:mt-28">
        <Label>The engine · eighteen signals</Label>
        <p className="mb-9 max-w-[62ch] text-[1.02rem] leading-[1.7] text-muted">
          Each signal is defined from the academic literature, then tested blind against 490
          synthetic traders across thirty years of real market data. Two more detectors work at the
          desk level, looking across a team instead of a single person.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SIGNALS.map((g) => (
            <div key={g.tier} className="tile rounded-2xl p-5 md:p-6">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-accent">
                  {g.tier}
                </span>
                <span className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-faint">
                  {g.items.length} {g.items.length === 1 ? 'signal' : 'signals'}
                </span>
              </div>
              <p className="mt-1 text-[0.82rem] italic leading-snug text-faint">{g.note}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <span
                    key={it}
                    className="kx-chip rounded-full border border-line bg-elevated/70 px-3 py-1.5 font-mono text-[0.68rem] text-ink/85"
                  >
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Privacy boundary: two nodes, a sealed envelope crossing ────── */}
      <section className="mt-24 md:mt-28">
        <Label>Privacy by construction</Label>
        <div className="tile rounded-2xl p-6 md:p-9">
          <p className="mb-8 max-w-[64ch] text-[1.02rem] leading-[1.7] text-muted">
            Privacy is the architecture, not a setting. On an individual install the sensitive data
            never leaves the machine. When a firm is involved, computers exchange only a sealed
            envelope, and it travels up the firm’s real reporting structure so a manager sees only
            their own direct reports.
          </p>

          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
            {/* on-device */}
            <div className="rounded-xl border border-line bg-elevated/60 p-5">
              <div className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-accent">
                On your machine
              </div>
              <ul className="mt-3 space-y-1.5 text-[0.9rem] text-muted">
                {['Screens', 'Trades and positions', 'Profit and loss', 'Names and tickers'].map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <div className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-faint">
                stays here, always
              </div>
            </div>

            {/* boundary + crossing envelope */}
            <div className="relative flex min-h-[92px] items-center justify-center px-2 md:min-w-[190px]">
              <div className="kx-boundary absolute inset-x-3 top-1/2 hidden h-px -translate-y-1/2 md:block" />
              <div className="kx-envelope absolute left-0 top-1/2 hidden -translate-y-1/2 md:block" aria-hidden="true" />
              <div className="relative rounded-full border border-ink bg-ink px-4 py-2 text-center font-mono text-[0.58rem] uppercase tracking-[0.14em] text-elevated">
                sealed envelope
                <div className="mt-0.5 text-[0.52rem] tracking-[0.1em] text-elevated/70">
                  signal + severity only
                </div>
              </div>
            </div>

            {/* at the firm */}
            <div className="rounded-xl border border-line bg-elevated/60 p-5">
              <div className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-accent">
                At the firm
              </div>
              <ul className="mt-3 space-y-1.5 text-[0.9rem] text-muted">
                {['Pattern type', 'Severity', 'Direct reports only', 'No names, no tickers'].map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <div className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-faint">
                oversight, not surveillance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Validation strip ───────────────────────────────────────────── */}
      <section className="mt-24 md:mt-28">
        <Label>How it was validated</Label>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10">
          <p className="font-serif text-[1.5rem] font-light leading-[1.2] tracking-[-0.01em] text-ink md:col-span-5 md:text-[1.9rem]">
            Tested blind. Nothing shipped on intuition.
          </p>
          <p className="text-[1.02rem] leading-[1.7] text-muted md:col-span-7 md:pt-2">
            A generator built 490 traders with biases drawn from the research and ran them across
            thirty years of real market data. The biases were injected as academic constructs, never
            as the detectors’ own rules, so the test could not quietly grade itself. Signals that did
            not hold up were re-scoped, relabeled more honestly, or down-weighted, never kept for
            show.
          </p>
        </div>
      </section>

      {/* ── What I built ──────────────────────────────────────────────── */}
      <section className="mt-24 md:mt-28">
        <Label>What I built</Label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {BUILT.map((b) => (
            <Tilt key={b.t} max={5}>
              <div className="tile tile-lift h-full rounded-2xl p-6">
                <div className="font-serif text-[1.25rem] font-normal leading-tight text-ink">
                  {b.t}
                </div>
                <p className="mt-2.5 text-[0.95rem] leading-[1.6] text-muted">{b.d}</p>
              </div>
            </Tilt>
          ))}
        </div>
      </section>

      {/* ── Hand-over + visit ─────────────────────────────────────────── */}
      <section className="mt-24 md:mt-28">
        <Label>Built to hand over</Label>
        <div className="tile rounded-2xl p-7 md:p-10">
          <p className="max-w-[60ch] font-serif text-[1.35rem] font-light leading-[1.3] tracking-[-0.005em] text-ink md:text-[1.6rem]">
            Kynexis was finished as a complete, self-contained asset, packaged so the whole project
            can change hands without entanglement.
          </p>
          <p className="mt-4 max-w-[58ch] text-[1rem] leading-[1.7] text-muted">
            Full source, validation harness, documentation, and a clean licence audit with no strong
            copyleft. Built for trade-surveillance, behavioral-analytics, and RegTech buyers.
          </p>
          <a
            href="https://getkynexis.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex items-center gap-2 rounded-full border border-ink bg-ink px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-elevated transition-colors hover:bg-ink/90"
          >
            Visit getkynexis.github.io
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </section>
    </div>
  );
}

// Scoped instrument ornaments. Kept out of globals.css so the whole flagship
// lives in one file; all motion collapses under prefers-reduced-motion.
const kxStyles = `
.kx-field { background: linear-gradient(180deg, rgba(255,255,255,0.5), rgba(237,240,243,0.4)); }
.kx-ticks {
  background-image: repeating-linear-gradient(90deg, rgba(60,67,75,0.16) 0 1px, transparent 1px 14px);
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}
.kx-sweep {
  background: linear-gradient(90deg, transparent, rgba(44,51,59,0.16), transparent);
  animation: kx-sweep 5.5s cubic-bezier(0.16,1,0.3,1) infinite;
}
@keyframes kx-sweep { 0% { transform: translateX(0); } 100% { transform: translateX(430%); } }

.kx-rail { background: linear-gradient(90deg, transparent, #C6CDD4 12%, #C6CDD4 88%, transparent); overflow: hidden; }
.kx-pulse {
  background: linear-gradient(90deg, transparent, rgba(44,51,59,0.55), transparent);
  animation: kx-travel 4.5s linear infinite;
}
@keyframes kx-travel { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }

.kx-chip { transition: transform .35s cubic-bezier(0.16,1,0.3,1), border-color .35s, background-color .35s; }
.kx-chip:hover { transform: translateY(-2px); border-color: rgba(38,42,48,0.4); background-color: #FAFBFC; }

.kx-boundary { background: linear-gradient(90deg, rgba(198,205,212,0.2), #C6CDD4, rgba(198,205,212,0.2)); }
.kx-envelope {
  width: 12px; height: 9px; border-radius: 2px;
  background: #262A30;
  box-shadow: 0 0 0 3px rgba(250,251,252,0.9);
  animation: kx-cross 4.2s cubic-bezier(0.65,0,0.35,1) infinite;
}
@keyframes kx-cross {
  0%, 8% { left: 0; opacity: 0; transform: translateY(-50%) scale(0.9); }
  18% { opacity: 1; }
  82% { opacity: 1; }
  92%, 100% { left: 100%; opacity: 0; transform: translateY(-50%) scale(0.9); }
}

@media (prefers-reduced-motion: reduce) {
  .kx-sweep, .kx-pulse, .kx-envelope { animation: none !important; }
  .kx-sweep, .kx-envelope { opacity: 0 !important; }
}
`;
