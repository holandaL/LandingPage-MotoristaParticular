/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    files: ['./index.html', './src/**/*.{ts,tsx}', '../shared/**/*.{ts,tsx}']
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif']
      },
      colors: {
        ink: '#10201d',
        night: '#050910',
        steel: '#0b1621',
        brandBlue: '#2458ff',
        pine: '#0f3f3a',
        ocean: '#116a7b',
        citrus: '#d6f15f',
        tealsoft: '#d7f2ed',
        coral: '#e86f51',
        gold: '#f2b84b',
        mist: '#f5f8f6',
        paper: '#fffaf0'
      },
      boxShadow: {
        soft: '0 18px 55px rgba(15, 63, 58, 0.14)',
        punch: '0 24px 70px rgba(16, 32, 29, 0.22)'
      }
    }
  },
  plugins: []
};
