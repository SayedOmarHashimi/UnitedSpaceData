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
        background: "var(--background)",
        foreground: "var(--foreground)",
        space: {
          black: "#000000",
          deep: "#030712",
          navy: "#0A0E27",
          blue: "#0D1B4B",
          cyan: "#00D4FF",
          "cyan-dim": "#0088AA",
          electric: "#3B82F6",
          purple: "#8B5CF6",
          "purple-bright": "#A855F7",
          glow: "#00FFFF",
          gold: "#F59E0B",
          "text-primary": "#F0F4FF",
          "text-muted": "#94A3B8",
          "glass-bg": "rgba(255,255,255,0.04)",
          "glass-border": "rgba(255,255,255,0.08)",
        },
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        exo: ["Exo 2", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
      backgroundImage: {
        "cyber-grid":
          "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)",
        "hero-gradient":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,212,255,0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 50%, rgba(139,92,246,0.1), transparent)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        "glow-blue": "radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)",
        "glow-purple": "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "glass": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glow-cyan": "0 0 20px rgba(0,212,255,0.3), 0 0 60px rgba(0,212,255,0.1)",
        "glow-purple": "0 0 20px rgba(139,92,246,0.3), 0 0 60px rgba(139,92,246,0.1)",
        "glow-sm": "0 0 10px rgba(0,212,255,0.2)",
        "card-hover": "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(0,212,255,0.1)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "scan": "scan 3s linear infinite",
        "spin-slow": "spin 20s linear infinite",
        "orbit": "orbit 15s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,212,255,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0,212,255,0.6), 0 0 80px rgba(0,212,255,0.2)" },
        },
        scan: {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateX(120px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(120px) rotate(-360deg)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
