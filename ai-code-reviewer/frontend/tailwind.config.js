/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1e1e1e',
          surface: '#252526',
          border: '#3e3e42',
          text: '#cccccc',
          'text-secondary': '#858585',
        },
        light: {
          bg: '#ffffff',
          surface: '#f3f4f6',
          border: '#e5e7eb',
          text: '#1f2937',
          'text-secondary': '#6b7280',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}
