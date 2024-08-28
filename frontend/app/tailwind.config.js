/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-blue": "#070f2b",
        "custom-blue-2": "#1b1a55",
      },
    },
  },
  plugins: [],
};
