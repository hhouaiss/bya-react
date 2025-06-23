/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        notion: {
          bg: '#191919',
          card: '#2f2f2f',
          text: '#ffffff',
          muted: '#9b9b9b',
          border: '#3f3f3f',
          accent: '#2383e2',
        },
      },
    },
  },
  plugins: [],
}

