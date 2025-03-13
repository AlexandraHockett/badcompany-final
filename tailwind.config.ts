import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Adding dark mode support from the second config
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Add Acertenity colors if any
        primary: "var(--acertenity-primary)",
        secondary: "var(--acertenity-secondary)",
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        // Add more animations if needed
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        // Add more keyframes if needed
      },
      // Add other properties like spacing, typography, etc., from Acertenity
    },
  },
  plugins: [],
} satisfies Config;
