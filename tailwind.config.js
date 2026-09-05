/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: [
    './index.html',
    './*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#4054FF',
        'brand-yellow': '#FFC700',
        'brand-dark': '#0B0E14',
        'brand-light': '#EDEFF3',
        'slate-850': '#1A1F26',
        'slate-950': '#07090D',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
