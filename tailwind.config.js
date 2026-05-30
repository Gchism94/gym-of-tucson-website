/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,js,html}"],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: "#79992F",
          light: "#8aad35",
          dark: "#5c751f",
        },
        dark: {
          DEFAULT: "#0f0f0f",
          card: "#1a1a1a",
          border: "#2a2a2a",
        },
      },
      fontFamily: {
        heading: ['"Barlow Condensed"', "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      screens: {
        sm: "480px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};
