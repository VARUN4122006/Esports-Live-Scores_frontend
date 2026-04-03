/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'esports-dark': 'var(--color-bg-dark)',
        'esports-card': 'var(--color-card)',
        'gold': 'var(--color-gold)',
        'amber': 'var(--color-amber)',
        'neon-red': 'var(--color-neon-red)',
        'electric-cyan': 'var(--color-electric-cyan)',
        'crimson': 'var(--color-neon-red)', // Re-mapped to red
        'purple': 'var(--color-electric-cyan)', // Re-mapped to cyan
        'bg-dark': 'var(--color-bg-dark)',
        'bg-mid': 'var(--color-bg-mid)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
