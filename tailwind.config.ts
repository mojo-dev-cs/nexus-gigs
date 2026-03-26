import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // This is the crucial line!
  ],
  theme: {
    extend: {
      colors: {
        nexusBlue: "#00f2ff",
      }
    },
  },
  plugins: [],
};
export default config;