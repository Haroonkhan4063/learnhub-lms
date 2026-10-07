/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#E9EEFB",
        surface: "#FAFBFF",
        ink: "#101A3D",
        line: "#CBD3EE",
        mute: "#5A678F",
        brand: { DEFAULT: "#3D3DF5", dark: "#2A2AD0" },
        sun: "#FFC53D",
      },
      fontFamily: {
        display: ["Bricolage Grotesque", "system-ui", "sans-serif"],
        sans: ["Figtree", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
