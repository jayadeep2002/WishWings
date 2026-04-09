/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wwPrimary: '#0A0E1A',
        wwSecondary: '#111827',
        wwCard: '#1A2035',
        wwGold: '#FFB830',
        wwCoral: '#FF6B6B',
        wwTextPrimary: '#F8F9FA',
        wwTextSecondary: '#9CA3AF',
        wwSuccess: '#10B981',
        wwBorder: '#2D3748',
        fkBlue: '#2874f0',
        fkYellow: '#ffc200',
        fkOrange: '#fb641b',
        fkGreen: '#388e3c',
        fkText: '#212121',
        fkTextLight: '#878787',
        fkLightBlue: '#f1f3f6',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        dm: ['"DM Sans"', 'sans-serif'],
        dancing: ['"Dancing Script"', 'cursive'],
        fk: ['Roboto', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'fkCard': '0 2px 4px 0 rgba(0,0,0,.08)'
      }
    },
  },
  plugins: [],
}
