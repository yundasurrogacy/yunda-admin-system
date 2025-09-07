/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F3F5F1',
          100: '#E7EBE3',
          200: '#D0D8C9',
          300: '#B8C4AF',
          400: '#A1B196',
          500: '#899D7C',
          600: '#6E7E63',
          700: '#525E4A',
          800: '#373F31',
          900: '#1B1F19',
        },
      },
      fontFamily: {
        serif: ['Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
