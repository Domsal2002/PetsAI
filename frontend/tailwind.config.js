/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", 
    ],
    theme: {
      extend: {
        colors: {
          primary: "#f79533", // Orange gradient color
          secondary: "#f37055", // Pink gradient color
          accent: "#ef4e7b", // Red gradient color
          dark: "#333333", // Dark gray
          light: "#f4f4f9", // Light background
        },
        fontFamily: {
          sans: ["Arial", "sans-serif"], // Default font family
        },
        spacing: {
          // Custom spacing for padding/margin
          "72": "18rem",
          "84": "21rem",
          "96": "24rem",
        },
      },
    },
    plugins: [],
  };
  