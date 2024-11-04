import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
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
          'Verdana',
          '"Inter"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        verdana: ['Verdana', 'sans-serif'],
      },
      colors: {
        'si-main': '#707035',
        'si-olive': '#908F51',
        'si-light': '#F8F8F2',
        'si-brown': '#BAAD6F',
        'si-tan': '#D9CDB6',
        'si-accent': '#D4AF37',
        'si-gray': '#DEE2E6',
        'si-dim': '#AAAAAA',
        'si-dark': '#4A4A23',
        'si-slate': '#242424',
      },
    },
  },
  exports: {
    plugins: [require('@vidstack/react/tailwind.cjs')],
  },
} satisfies Config;
