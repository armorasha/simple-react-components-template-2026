/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Ubuntu', 'Noto Sans', 'Liberation Sans', 'DejaVu Sans', 'Arial', 'sans-serif'],
      },
      colors: {
        pptx: {
          charcoal: { DEFAULT: '#0e0e0e', light: '#1a1a1e', dark: '#050505' },
          cream: { DEFAULT: '#e6edf7', dark: '#aab4c2' },
          amber: { DEFAULT: '#ff7700', light: '#ff9b40', dark: '#cc5f00' },
          gold: { DEFAULT: '#fab400', light: '#fdc74a', dark: '#c89000' },
          tan: { DEFAULT: '#7a8ca3', light: '#9db0c7', dark: '#5a6a7d' },
          blue: { DEFAULT: '#00508c', light: '#1670b0', dark: '#003a66' },
          green: { DEFAULT: '#17824d', light: '#20b66b', dark: '#0f5733' },
          red: { DEFAULT: '#931515', light: '#c91d1d', dark: '#670f0f' },
          magenta: { DEFAULT: '#ff4dd8', light: '#ff80e0', dark: '#cc22aa' },
        },
      },
    },
  },
  plugins: [],
};
