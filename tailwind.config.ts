import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vert: {
          50:  "#f0faf4",
          100: "#d9f2e3",
          200: "#b3e5c8",
          300: "#7dcfaa",
          400: "#45b485",
          500: "#1d9c68",
          600: "#0e7d52",
          700: "#0a6342",
          800: "#094f35",
          900: "#07402b",
          950: "#042c1d",
        },
        or: {
          50:  "#fafafa",
          100: "#f5f5f5",
          200: "#e8e8e8",
          300: "#d0d0d0",
          400: "#ffffff",
          500: "#111111",
          600: "#333333",
          700: "#555555",
          800: "#777777",
          900: "#999999",
          950: "#000000",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        arabic: ["Amiri", "serif"],
      },
      backgroundImage: {
        "gradient-touba":
          "linear-gradient(135deg, #07402b 0%, #0a6342 60%, #111111 100%)",
        "gradient-hero":
          "linear-gradient(180deg, rgba(7,64,43,0.97) 0%, rgba(10,99,66,0.90) 60%, rgba(0,0,0,0.4) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
