/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbf4',
          100: '#d6f5e3',
          200: '#b0e9cb',
          300: '#7cd7ad',
          400: '#46bd8b',
          500: '#22a271',
          600: '#15825b',
          700: '#11684a',
          800: '#10523c',
          900: '#0e4433',
          950: '#06261d',
        },
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5dae3',
          300: '#b0b9ca',
          400: '#8593ac',
          500: '#657592',
          600: '#505d78',
          700: '#424c62',
          800: '#3a4253',
          900: '#343a47',
          950: '#0f1218',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(15 18 24 / 0.05)',
        card: '0 1px 2px 0 rgb(15 18 24 / 0.04), 0 8px 24px -12px rgb(15 18 24 / 0.12)',
        'card-hover': '0 2px 4px 0 rgb(15 18 24 / 0.05), 0 18px 40px -16px rgb(15 18 24 / 0.18)',
        brand: '0 10px 24px -10px rgb(21 130 91 / 0.55)',
        'brand-lg': '0 16px 34px -12px rgb(21 130 91 / 0.6)',
        inset: 'inset 0 1px 0 0 rgb(255 255 255 / 0.08)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #22a271 0%, #15825b 55%, #11684a 100%)',
        'ink-gradient': 'linear-gradient(160deg, #0f1218 0%, #101a18 55%, #0b2320 100%)',
        sheen: 'linear-gradient(180deg, rgb(255 255 255 / 0.16) 0%, rgb(255 255 255 / 0) 60%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        blob: 'blob 14s infinite ease-in-out',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
}