/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        heritage: {
          50:  '#fdf8f0',
          100: '#faefd8',
          200: '#f4dba8',
          300: '#ecc06e',
          400: '#e39f3c',
          500: '#c8811c',
          600: '#a86316',
          700: '#864a13',
          800: '#6d3b14',
          900: '#5a3113',
        },
        slate: {
          850: '#1a2235',
          900: '#0f172a',
          950: '#080e1a',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'Segoe UI', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
