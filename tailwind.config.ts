import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#22B14C',
          light:   '#3FCB6A',
          dark:    '#1A8E3D',
        },
        carbon: {
          900: '#0a0a0a',
          800: '#161616',
          700: '#1f1f1f',
          600: '#2a2a2a',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
