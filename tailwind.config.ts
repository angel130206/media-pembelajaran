import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Krem hangat base
        cream: { 50: "#FFFBEB", 100: "#FEF3C7", 200: "#FDE68A", 300: "#FDE68A" },
        brand: { 50: "#FFF7ED", 100: "#FFEDD5", 200: "#FED7AA", 300: "#FDBA74", 400: "#FB923C", 500: "#F97316", 600: "#EA580C", 700: "#C2410C", 800: "#9A3412", 900: "#7C2D12" },
        tealBrand: { 50: "#F0FDFA", 100: "#CCFBF1", 200: "#99F6E4", 300: "#5EEAD4", 400: "#2DD4BF", 500: "#14B8A6", 600: "#0D9488", 700: "#0F766E" },
        ink: { 50: "#FFF8F0", 100: "#FFEDD6", 900: "#1C0A00", 800: "#3F1D0A" },
        paper: "#FFFBEB",
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial"],
        display: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui"],
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem", "3xl": "1.75rem" },
      boxShadow: { soft: "0 8px 30px rgba(124,45,18,0.08)", card: "0 4px 20px rgba(124,45,18,0.07)", lifted: "0 12px 40px rgba(124,45,18,0.12)" },
      maxWidth: { "8xl": "88rem" },
    },
  },
  plugins: [],
};
export default config;
