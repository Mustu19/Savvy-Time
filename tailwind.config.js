/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // Enabling class-based dark mode
  theme: {
    extend: {
      colors: {
        dark: {
          background: "#1a1a1a",
          text: "#eaeaea",
        },
        light: {
          background: "#f8f9fa",
          text: "#212529",
        },
      },
    },
  },
  plugins: [],
};
