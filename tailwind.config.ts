import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  // If we want to define custom breakpoints for screen sizes, we need to
  // define the `smallAudioLayoutQuery` hook for the vid stack media player
  // screens: {
  //   sm: "640px",
  //   md: "768px",
  //   lg: "1024px",
  //   xl: "1280px",
  //   "2xl": "1536px",
  // },
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
} satisfies Config;
