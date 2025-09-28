/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'poly': ['var(--font-poly)', 'serif'],
        'outfit': ['var(--font-outfit)', 'sans-serif'],
      },
      colors: {
        'eggshell': '#F0EAD6',
        'slate-gray': '#7D8491',
        'space-cadet': '#212842',
      },
    },
  },
  plugins: [],
}
