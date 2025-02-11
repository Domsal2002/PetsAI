// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1a73e8",  // Blue color for buttons and accents
        background: "#f7f7f7",
        surface: "#ffffff",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      // You can add custom spacing, border radius, etc.
    },
  },
  plugins: [],
};

export default config;
