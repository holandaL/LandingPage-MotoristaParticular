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
        display: ['Sora', 'Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: '#050910',
        night: '#050910',
        steel: '#0b1621',
        brandBlue: '#2458ff',
        pine: '#0b1621',
        ocean: '#2458ff',
        citrus: '#ffffff',
        tealsoft: '#eef3ff',
        coral: '#2458ff',
        gold: '#2458ff',
        mist: '#f6f8ff',
        paper: '#ffffff'
      },
      boxShadow: {
        soft: '0 18px 55px rgba(5, 9, 16, 0.12)',
        punch: '0 24px 70px rgba(36, 88, 255, 0.22)'
      }
    }
  },
  plugins: []
};
