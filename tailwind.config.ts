import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Migration light : les anciens tokens "ink" pointent maintenant
        // vers la nouvelle échelle slate. Tout `bg-ink-XXX` ou `text-ink-XXX`
        // restant dans le code rendra une couleur claire cohérente.
        ink: {
          950: "#FFFFFF",
          900: "#F8FAFC",
          800: "#F1F5F9",
          700: "#E2E8F0",
          600: "#CBD5E1",
        },
        brand: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
        whatsapp: {
          DEFAULT: "#25D366",
          dark: "#1EBE5C",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(15,23,42,0.06)",
        card: "0 10px 40px -10px rgba(15,23,42,0.12)",
        glow: "0 0 0 1px rgba(16,185,129,.18), 0 18px 40px -16px rgba(16,185,129,.35)",
        "glow-amber":
          "0 0 0 1px rgba(245,158,11,.22), 0 18px 40px -16px rgba(245,158,11,.40)",
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(rgba(15,23,42,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.06) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(ellipse at top, rgba(16,185,129,.10), transparent 60%)",
      },
      animation: {
        "fade-in": "fadeIn .8s ease-out both",
        "fade-up": "fadeUp .9s ease-out both",
        shine: "shine 6s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shine: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
