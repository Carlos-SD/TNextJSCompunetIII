/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1DB954',
          600: '#17a34a',
          400: '#3ad06a',
        },
        accent: '#16a34a',
        neutral: {
          700: '#0f1720',
          500: '#1f2937',
          300: '#9CA3AF',
        },
        success: '#34D399',
        danger: '#F87171',
        warning: '#FBBF24',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg,#1DB954 0%,#16a34a 100%)',
      },
      boxShadow: {
        'soft-green': '0 6px 18px rgba(29,185,84,0.14)',
      },
    },
  },
  plugins: [],
}
