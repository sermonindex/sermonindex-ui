import LineClamp from "@tailwindcss/line-clamp";
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  screens: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Verdana",
          '"Inter"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        verdana: ["Verdana", "sans-serif"],
      },
      colors: {
        "si-main": "#707035",
      },
    },
  },

  plugins: [LineClamp],
  // daisyui: {
  //   themes: ["retro", "dark", "bumblebee"],
  // },
} satisfies Config;
