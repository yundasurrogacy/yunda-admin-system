/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: false,
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'main-bg': '#FBF0DA', // 统一背景色
        // 'page-bg': '#F9F6F0', // 页面背景
        'page-bg': ' #FBF0DA',
        'card-bg': '#FBF0DA', // 卡片背景
        // 'card-bg': '#F9F6F0', // 卡片背景
        'brand-green': '#A6A99F', // 品牌绿色
        'brand-brown': {
          light: '#D4C0A8',
          DEFAULT: '#8B6F47',
          dark: '#6B4F3A',
        },
        'brand-yellow': '#E8E2D5',
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
        serif: ['Cormorant', 'SourceHanSerifCN', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
}
