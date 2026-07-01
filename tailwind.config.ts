import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cool ink-black base, frosted off-white ink, light-blue accent —
        // the palette of the ice hero, carried across every page.
        base: '#0B1017',
        surface: '#10161F',
        elevated: '#161E29',
        line: '#243040',
        ink: '#EAF2FB',
        muted: '#8FA6BC',
        faint: '#54657A',
        accent: '#7FB6E6', // light blue — the crystal's own tone
        'accent-dim': '#3E6E99',
        ice: '#BFE0F5',
        frost: '#DCEEFF',
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
