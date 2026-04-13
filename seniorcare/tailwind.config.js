/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0f1f3d', light: '#162a52', dark: '#0a1528' },
        gold: { DEFAULT: '#c9a84c', light: '#dfc278', dark: '#a8882e' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
