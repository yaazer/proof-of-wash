/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Proof of Wash brand palette
        linen: {
          50:  '#FBF5E9',  // Paper — main background
          100: '#F4ECD8',  // Label Cream — cards / labels
          200: '#EFE4CC',
          300: '#E4D6B8',
          400: '#CBB68C',
          500: '#b8a47a',
          600: '#9a8a60',
          700: '#7c6f4a',
          800: '#5c5236',
          900: '#3d3628',
        },
        charcoal: {
          50:  '#f5f2ee',
          100: '#e4dfd8',
          200: '#c8bfb5',
          300: '#a89e94',
          400: '#8a8278',
          500: '#6e6760',
          600: '#5c5550',
          700: '#4a443c',
          800: '#2e2926',
          900: '#1A1714',  // Ink — primary text / lines
          950: '#0f0d0b',
        },
        bitcoin: {
          DEFAULT: '#F7931A',
          dark: '#C56A12',
        },
      },
      fontFamily: {
        sans:  ['var(--font-archivo)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-archivo-black)', 'system-ui', 'sans-serif'],
        mono:  ['var(--font-space-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
