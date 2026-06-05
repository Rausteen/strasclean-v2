import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Warm-paper neutral scale ──────────────────────────────────
           Overrides Tailwind's built-in cool `slate` with warm paper
           tones. This is the lever that recolors the ENTIRE site: every
           existing `bg-slate-50`, `text-slate-900`, `border-slate-200`,
           etc. across all components instantly shifts to the warm palette
           with zero component edits. Contrast relationships are preserved
           (50 = lightest paper … 950 = darkest ink). */
        slate: {
          50:  "#FBFAF4",
          100: "#F3F1E9",
          200: "#E2DECF",
          300: "#D6D1BE",
          400: "#A8A593",
          500: "#6C7262",
          600: "#4C5142",
          700: "#383D30",
          800: "#232A1C",
          900: "#15190F",
          950: "#0B0E07",
        },
        // Legacy "ink" tokens kept (warmed) for any lingering bg-ink-* usage.
        ink: {
          950: "#FBFAF4",
          900: "#F3F1E9",
          800: "#EEEBE0",
          700: "#E2DECF",
          600: "#D6D1BE",
        },
        brand: {
          50:  "#ECFDF5",
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
        // NEW — deep forest green for dark sections (Final CTA, Footer…).
        forest: {
          DEFAULT: "#0B241A",
          600: "#0F3024",
          900: "#081A12",
        },
        whatsapp: {
          DEFAULT: "#25D366",
          dark: "#1EBE5C",
        },
      },
      fontFamily: {
        // Body → Plus Jakarta Sans (was Inter). Display → Sora (unchanged).
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(21,25,15,0.12)",
        card: "0 26px 60px -22px rgba(21,25,15,0.28)",
        glow: "0 0 0 1px rgba(16,185,129,.22), 0 22px 48px -20px rgba(16,185,129,.42)",
        "glow-amber":
          "0 0 0 1px rgba(224,161,0,.22), 0 18px 40px -16px rgba(224,161,0,.42)",
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(rgba(21,25,15,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(21,25,15,.05) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(ellipse at top, rgba(16,185,129,.14), transparent 60%)",
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
