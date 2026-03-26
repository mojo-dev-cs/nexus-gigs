import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nexusBlue: "#00f2ff",
        nexusGreen: "#00ff88", 
        nexusRed: "#ff003c", 
        background: "#020617", 
        card: "rgba(30, 41, 59, 0.5)", 
      },
      backgroundImage: {
        "neon-gradient": "linear-gradient(to right, #00f2ff, #00ff88)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))",
      },
      boxShadow: {
        "neon-blue": "0 0 20px rgba(0, 242, 255, 0.5)",
        "neon-green": "0 0 20px rgba(0, 255, 136, 0.5)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;