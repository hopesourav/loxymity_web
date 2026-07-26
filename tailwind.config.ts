import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5C6BF8',
        'primary-dark': '#4251E8',
        dark: {
          bg:      '#0F172A',
          surface: '#1E293B',
          border:  '#334155',
          text:    '#F1F5F9',
          muted:   '#94A3B8',
        },
        brand: {
          success: '#10B981',
          danger:  '#EF4444',
          warning: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
