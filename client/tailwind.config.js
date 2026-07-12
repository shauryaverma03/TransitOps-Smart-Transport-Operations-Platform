/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#10131a',
        surface: '#1d2027',
        'surface-border': '#272a31',
        primary: '#adc6ff',
        'primary-hover': '#98b6ff',
        secondary: '#a6c8ff',
        tertiary: '#ffb786',
        error: '#ffb4ab',
        text: {
          primary: '#e3e2e6',
          secondary: '#c4c6d0',
          muted: '#8e9099'
        },
        status: {
          available: '#81c995', // green
          ontrip: '#adc6ff',   // blue
          inshop: '#ffb786',   // orange
          retired: '#ffb4ab'   // red
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
