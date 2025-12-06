/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Oswald', 'sans-serif'], 
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        background: '#050505',
        surface: '#111111',
        primary: '#F0F0F0',
        secondary: '#666666',
        accent: '#FFFFFF', 
        line: '#333333',
      },
      borderRadius: {
        DEFAULT: '0px',
        'none': '0px',
        'sm': '0px',
        'md': '0px',
        'lg': '0px',
        'xl': '0px',
        '2xl': '0px',
        'full': '0px', 
      }
    }
  },
  plugins: [],
}

