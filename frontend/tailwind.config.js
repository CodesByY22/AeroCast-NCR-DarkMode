/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: '#f5f5f7',
        surface: '#ffffff',
        accent: '#0066cc',
        textMain: '#1d1d1f',
        textMuted: '#6e6e73',
        textSubtle: '#8e8e93',
        borderSubtle: '#e5e5ea',
        aqi: {
          good: "#34c759",
          satisfactory: "#30d158",
          moderate: "#ffd60a",
          poor: "#ff9f0a",
          verypoor: "#ff453a",
          severe: "#d70015",
          hazard: "#990000"
        }
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ]
      }
    },
  },
  plugins: [],
}
