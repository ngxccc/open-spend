/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#121214',
          dim: '#0c0c0e',
          bright: '#242429',
          container: {
            lowest: '#0e0e10',
            low: '#18181b',
            DEFAULT: '#1e1e22',
            high: '#27272b',
            highest: '#323238',
          },
        },
        'on-surface': {
          DEFAULT: '#f4f4f5',
          variant: '#a1a1aa',
          secondary: '#d4d4d8',
          tertiary: '#ffffff',
        },
        primary: {
          DEFAULT: '#ffffff',
          foreground: '#09090b',
          container: '#3f3f46',
        },
        secondary: {
          DEFAULT: '#27272b',
          foreground: '#f4f4f5',
        },
        muted: {
          DEFAULT: '#27272a',
          foreground: '#a1a1aa',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        border: {
          DEFAULT: '#27272a',
          subtle: '#3f3f46',
          interactive: '#52525b',
        },
        input: '#27272a',
        ring: '#3f3f46',
        background: '#121214',
        foreground: '#f4f4f5',
        success: '#10b981',
        danger: '#ef4444',
        brand: '#f59e0b',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
