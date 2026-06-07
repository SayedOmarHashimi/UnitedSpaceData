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
        sand: {
          DEFAULT: "#F5F0E8",
          dark: "#EDE8DC",
          deeper: "#D4C9B0",
          border: "#C8BBAA",
        },
        cream: "#FDFAF5",
        navy: {
          DEFAULT: "#0A1628",
          mid: "#1B3A6B",
          light: "#2952A3",
          faint: "rgba(10,22,40,0.08)",
          subtle: "rgba(10,22,40,0.04)",
        },
        sky: {
          DEFAULT: "#4A90D9",
          dark: "#2F6BB8",
          light: "#EBF4FF",
        },
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "display": ["clamp(2.8rem, 7vw, 5.5rem)", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        "headline": ["clamp(1.8rem, 4vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "title": ["clamp(1.2rem, 2.5vw, 1.6rem)", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
      },
      boxShadow: {
        "card": "0 1px 3px rgba(10,22,40,0.06), 0 4px 16px rgba(10,22,40,0.04)",
        "card-hover": "0 4px 8px rgba(10,22,40,0.08), 0 12px 32px rgba(10,22,40,0.08)",
        "btn": "0 1px 2px rgba(10,22,40,0.12)",
        "btn-hover": "0 4px 12px rgba(74,144,217,0.3)",
      },
      borderRadius: {
        "card": "12px",
        "btn": "8px",
        "tag": "4px",
      },
      transitionTimingFunction: {
        "editorial": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
