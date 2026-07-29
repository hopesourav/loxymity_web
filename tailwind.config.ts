import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF2E9A',
        'primary-dark': '#D6178A',
        accent: {
          cyan:   '#00F0FF',
          orange: '#FF7A18',
          gold:   '#FFC24B',
        },
        dark: {
          bg:      '#0B0620',
          surface: '#1B1042',
          border:  '#3D2B6F',
          text:    '#F4EEFF',
          muted:   '#B9A9E0',
        },
        brand: {
          success: '#39FF88',
          danger:  '#FF3B5C',
          warning: '#FFC24B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        hud: ['Rajdhani', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
