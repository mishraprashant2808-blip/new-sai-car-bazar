import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dealer: {
          red: "#ED0000",
          "red-hover": "#D10000",
          "red-dark": "#990000",
          navy: "#0F172A",
          "navy-dark": "#0A0F1D",
          "navy-surface": "#162032",
          "navy-card": "#1C293A",
          "navy-border": "#273549",
          slate: "#334155",
          muted: "#94A3B8",
          light: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
