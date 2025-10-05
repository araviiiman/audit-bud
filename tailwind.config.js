/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0d0f12',
        'dark-bg-secondary': '#111317',
        'dark-sidebar': '#1b1e23',
        'dark-card': '#1b1e23',
        'dark-text': '#d1d5db',
        'dark-text-secondary': '#9ca3af',
        'accent-blue': '#3b82f6',
        'accent-grey': '#64748b',
      }
    },
  },
  plugins: [],
}
