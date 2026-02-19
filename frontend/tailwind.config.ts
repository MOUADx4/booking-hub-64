import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // bleu simple
      },
    },
  },

  plugins: [],
};

export default config;
