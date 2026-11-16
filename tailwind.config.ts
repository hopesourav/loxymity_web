import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette (2026-10-25 rebrand, "Loxymity." wordmark + "Loxy." icon):
        // midnight navy base, ivory type, and the indigo of the logo's dot as the one accent.
        // Buttons keep dark text on `primary` (6.4:1), links keep `text-primary` on navy (6.4:1).
        // The old palette was black + gold (#C9A227).
        primary: '#7C88FF',
        'primary-dark': '#6371F5',
        accent: {
          cyan:   '#5F82A5',
          orange: '#8B5E34',
          gold:   '#B9C1FF', // key kept for existing classes; now a pale indigo, not gold
        },
        dark: {
          bg:      '#080A1C',
          surface: '#11142A',
          border:  '#252A47',
          text:    '#F5F3EE',
          muted:   '#A3A8C3',
        },
        brand: {
          success: '#5C8F6B',
          danger:  '#B5453F',
          warning: '#C08B3E',
        },
        // The app's own semantic hues (src/lib/palette.ts in the app repo), used by the public
        // pages so the site and the phone speak the same colour language. Text/icon use only —
        // white text on these fails 4.5:1; `brand.*` above stays for the dashboard and admin.
        status: {
          ok:   '#10B981',
          sos:  '#EF4444',
          warn: '#F59E0B',
        },
        // The app's brand-coloured text on dark surfaces (palette.primaryOnDark).
        'primary-soft': '#8C97FF',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
        hud: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        // The logo's face (Instrument Serif). Public pages use it for ONE accent word per heading.
        serif: ['var(--font-instrument)', 'Georgia', '"Times New Roman"', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
