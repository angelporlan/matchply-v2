import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0f19",
        paper: "#f7f5f0",
      },
    },
  },
  plugins: [],
};

export default config;
