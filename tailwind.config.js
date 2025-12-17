/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        'brand': {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          900: '#14532d'
        },
        'dark': {
          800: '#1e293b',
          900: '#0f172a'
        }
      }
    },
  },
  plugins: [],
}