/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",     // If using pages/
    "./app/**/*.{js,ts,jsx,tsx}",       // If using app/
    "./src/**/*.{js,ts,jsx,tsx}",       // If using src/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
