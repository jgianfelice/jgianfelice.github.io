import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light "concrete + ice" system (igloo.inc): a pale cool-grey field,
        // near-white panels, cool charcoal ink, graphite accents. Near-
        // monochrome — hierarchy comes from weight and darkness, not hue.
        base: '#E8EAED',      // pale cool-grey field (page)
        surface: '#F2F3F5',   // panels / cards
        elevated: '#FAFBFC',  // raised / near-white
        line: '#D4D8DE',      // hairlines / borders
        ink: '#262A30',       // primary text — cool charcoal
        muted: '#5C636B',     // secondary text
        faint: '#8C939B',     // tertiary / labels
        accent: '#2C333B',    // graphite — links, eyebrows, emphasis
        'accent-dim': '#6A727B',
        ice: '#C6CDD4',       // cool light grey — motif marks
        frost: '#EDF0F3',     // lightest cool wash
      },
      fontFamily: {
        // Serif display for headlines, clean grotesque for body.
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Editorial scale
        'display': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'h1': ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'h2': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      letterSpacing: {
        label: '0.18em',
      },
      maxWidth: {
        prose: '68ch',
        wide: '1280px',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
