import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          forest: "#2F5D3A",
          light: "#3D7A4A",
          dark: "#1F3D28",
        },
        cream: "#F5F0E8",
        terracota: "#FF6B35",
        brand: {
          primary: "#2F5D3A",
          secondary: "#F5F0E8",
          accent: "#FF6B35",
          text: "#1A1A1A",
        },
      },
      fontFamily: {
        serif: ["Instrument Serif", "serif"],
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      animation: {
        "leaf-spin": "leaf-spin 2s linear infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
      },
      keyframes: {
        "leaf-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
