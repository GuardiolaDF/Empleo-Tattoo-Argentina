/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'display-2xl': ['var(--text-display-2xl)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-xl': ['var(--text-display-xl)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'display-lg': ['var(--text-display-lg)', { lineHeight: '1.1' }],
        'h1': ['var(--text-h1)', { lineHeight: '1.2' }],
        'h2': ['var(--text-h2)', { lineHeight: '1.3' }],
        'h3': ['var(--text-h3)', { lineHeight: '1.4' }],
        'subtitle': ['var(--text-subtitle)', { lineHeight: '1.5' }],
        'body-lg': ['var(--text-body-lg)', { lineHeight: '1.75' }],
        'body': ['var(--text-body)', { lineHeight: '1.6' }],
        'body-sm': ['var(--text-body-sm)', { lineHeight: '1.5' }],
        'label-lg': ['var(--text-label-lg)', { letterSpacing: '0.2em' }],
        'label': ['var(--text-label)', { letterSpacing: '0.2em' }],
        'label-sm': ['var(--text-label-sm)', { letterSpacing: '0.2em' }],
        'caption': ['var(--text-caption)', { lineHeight: '1.4' }],
        'caption-sm': ['var(--text-caption-sm)', { lineHeight: '1.3' }],
        'button-lg': ['var(--text-button-lg)', { letterSpacing: '0.1em' }],
        'button': ['var(--text-button)', { letterSpacing: '0.1em' }],
        'button-sm': ['var(--text-button-sm)', { letterSpacing: '0.1em' }],
        'nav': ['var(--text-nav)', { letterSpacing: '0.15em' }],
      },
      boxShadow: {
        'card-hover': 'var(--shadow-elevation-1)',
        'dropdown': 'var(--shadow-elevation-2)',
        'modal': 'var(--shadow-elevation-3)',
      },
      borderRadius: {
        none: '0px',
      },
    },
  },
  plugins: [],
}
