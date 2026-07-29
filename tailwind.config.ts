import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C9A227',
        'primary-dark': '#A9841E',
        accent: {
          cyan:   '#5F82A5',
          orange: '#8B5E34',
          gold:   '#D9C27E',
        },
        dark: {
          bg:      '#0A0C10',
          surface: '#14171D',
          border:  '#262B33',
          text:    '#F5F3EE',
          muted:   '#A8A29E',
        },
        brand: {
          success: '#5C8F6B',
          danger:  '#B5453F',
          warning: '#C08B3E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        hud: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
