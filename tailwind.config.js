/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#131315',
          dim: '#131315',
          bright: '#39393b',
          container: {
            lowest: '#0e0e10',
            low: '#1b1b1d',
            DEFAULT: '#201f21',
            high: '#2a2a2c',
            highest: '#353537',
          },
        },
        'on-surface': {
          DEFAULT: '#e5e2e3',
          variant: '#c7c6c7',
          secondary: '#b4b4bd',
          tertiary: '#ffffff',
        },
        primary: {
          DEFAULT: '#27272a',
          foreground: '#e4e4e7',
          container: '#3f3f46',
        },
        border: {
          DEFAULT: '#27272a',
          subtle: '#3f3f46',
        },
        success: '#34d399',
        danger: '#f87171',
        brand: '#ffbb4b',
      },
    },
  },
  plugins: [],
};
