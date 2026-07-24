/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        genomic: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        cyber: {
          bg: '#0a0d14',
          card: '#121824',
          border: '#1e293b',
          accent: '#38bdf8',
          purple: '#818cf8',
          emerald: '#34d399',
          rose: '#fb7185',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(20, 184, 166, 0.4), 0 0 20px rgba(20, 184, 166, 0.2)' },
          '100%': { boxShadow: '0 0 15px rgba(20, 184, 166, 0.8), 0 0 30px rgba(20, 184, 166, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}
