import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  future: {
    hoverOnlyWhenSupported: true,
  },
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
        'si-light': '#F8F8F2',
        'si-blend': 'rgba(243,243,243,0.7)',
        'si-gray': '#DEE2E6',
        'si-tan': '#D9CDB6',
        'si-brown': '#BAAD6F',
        'si-dim': '#AAAAAA',
        'si-olive': '#908F51',
        'si-accent': '#D4AF37',
        'si-main': '#707035',
        'si-official': '#595935',
        'si-official-light': '#B2A364',
        'si-dark': '#4A4A23',
        'si-rock': '#333333',
        'si-slate': '#242424',
        'media-brand': 'rgb(var(--media-brand) / <alpha-value>)',
        'media-focus': 'rgb(var(--media-focus) / <alpha-value>)',
      },
    },
  },
  safelist: ['indent-4', 'indent-8', 'indent-12', 'indent-16'],
  darkMode: 'class',
  plugins: [
    require('tailwindcss-animate'),
    require('@vidstack/react/tailwind.cjs')({
      prefix: 'media',
    }),
    customVariants,
  ],
} satisfies Config;

// @ts-ignore
function customVariants({ addVariant, matchVariant }) {
  // Strict version of `.group` to help with nesting.
  matchVariant('parent-data', (value: any) => `.parent[data-${value}] > &`);

  addVariant('hocus', ['&:hover', '&:focus-visible']);
  addVariant('group-hocus', ['.group:hover &', '.group:focus-visible &']);
}
