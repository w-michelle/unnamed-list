import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        cutive: ["var(--font-cutive)"],
        special: ["var(--font-special)"],
      },
      colors: {
        black: "#333",
        gray: "rgb(246, 248, 246)",
      },
      backgroundColor: {
        gray: "rgb(246, 248, 246)",
        grayGreen: "#F6F8F6",
      },
    },
  },
  plugins: [],
};
export default config;
