/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        'mobile': '430px',
      },
      colors: {
        mondrian: {
          red: '#FF0000',
          yellow: '#FFD700',
          blue: '#0000FF',
          black: '#000000',
          white: '#FFFFFF',
          gray: '#F3F4F6',
        },
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '8': '8px',
      },
      spacing: {
        'grid': '20px',
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
        'color-shift': 'color-shift 0.2s ease',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'color-shift': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

