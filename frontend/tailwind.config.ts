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
        accent: "var(--background-accent)",
        foreground: "var(--foreground)",
        secondary: "var(--secondary)",
        primary: "var(--primary)",
        destructive: "var(--destructive)",
        positive: "var(--positive)",
      },
    },
  },
  plugins: [],
} satisfies Config;
