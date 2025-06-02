/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // scan app folder
    './components/**/*.{js,ts,jsx,tsx}', // scan components folder
    // add other folders if needed
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
