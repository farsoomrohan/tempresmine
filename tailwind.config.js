/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bgColor: "#F1F1F1",
        bgWhite: "#fafafa",
        btnColor: "#D5292B",
        btnHover: "#F04343",
        textHeading: "#2C4B84",
        normalText: "#000929",
        lighterText: "#6c727f",
      },
      animation: {
        slideUpFadeIn: 'fadeIn 2s ease-in-out',
        typing1: 'typing1 1.5s steps(1, end) infinite',
        typing2: 'typing2 1.5s steps(1, end) infinite',
        typing3: 'typing3 1.5s steps(1, end) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        typing1: {
          '0%': { opacity: '0' },
          '33%': { opacity: '1' },
          '100%': { opacity: '1' }
        },
        typing2: {
          '0%': { opacity: '0' },
          '33%': { opacity: '0' },
          '66%': { opacity: '1' },
          '100%': { opacity: '1' }
        },
        typing3: {
          '0%': { opacity: '0' },
          '66%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      },
      fontSize: {
        nmlText: "14px",
      },

      fontFamily: {
        sans: ["Quicksand", "sans-serif"],
      },
    },
  },
  plugins: [],
};