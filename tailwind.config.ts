import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50:"#fff7ed",100:"#ffedd5",200:"#fed7aa",300:"#fdba74",400:"#fb923c",500:"#f97316",600:"#ea580c",700:"#c2410c",800:"#9a3412",900:"#7c2d12" },
        tealBrand: { 50:"#f0fdfa",100:"#ccfbf1",200:"#99f6e4",300:"#5eead4",400:"#2dd4bf",500:"#14b8a6",600:"#0d9488",700:"#0f766e" }
      },
      borderRadius: { xl: "1rem", "2xl":"1.25rem" },
      boxShadow: { soft: "0 4px 24px rgba(0,0,0,0.06)", card: "0 2px 12px rgba(0,0,0,0.08)" }
    }
  },
  plugins: []
};
export default config;
