import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#e6e6f0",
          100: "#c0c0d8",
          200: "#9a9ac0",
          300: "#7474a8",
          400: "#4e4e90",
          500: "#000080",
          600: "#000073",
          700: "#000060",
          800: "#00004d",
          900: "#00003a",
          DEFAULT: "#000080",
        },
        gold: {
          50: "#fffde7",
          100: "#fff9c4",
          200: "#fff59d",
          300: "#fff176",
          400: "#ffee58",
          500: "#FFD700",
          600: "#fdd835",
          700: "#f9a825",
          800: "#f57f17",
          900: "#e65100",
          DEFAULT: "#FFD700",
        },
      },
      fontFamily: {
        display: ["var(--font-barlow)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulse_glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255,215,0,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255,215,0,0.7)" },
        },
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
        float: "float 6s ease-in-out infinite",
        pulse_glow: "pulse_glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
