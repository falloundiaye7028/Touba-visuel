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
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#d4af37",
          600: "#b8960c",
          700: "#92750a",
          800: "#785f0d",
          900: "#64500f",
          950: "#3a2d04",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        arabic: ["Amiri", "serif"],
      },
      backgroundImage: {
        "gradient-touba":
          "linear-gradient(135deg, #07402b 0%, #0a6342 50%, #d4af37 100%)",
        "gradient-hero":
          "linear-gradient(180deg, rgba(7,64,43,0.95) 0%, rgba(10,99,66,0.85) 60%, rgba(212,175,55,0.3) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
