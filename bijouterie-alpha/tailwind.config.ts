import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        or: {
          50:  "#fdf8ed",
          100: "#f8ecc8",
          200: "#f0d48e",
          300: "#e8bc54",
          400: "#d4a017",
          500: "#c9a84c",
          600: "#a8852a",
          700: "#8a6d1e",
          800: "#6b5218",
          900: "#4a380f",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
        floatUp: "floatUp 6s ease-in-out infinite",
        sparkle: "sparkle 2.5s ease-in-out infinite",
        fadeUp: "fadeUp 0.8s ease-out forwards",
        scaleIn: "scaleIn 0.6s ease-out forwards",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        floatUp: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.85)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
