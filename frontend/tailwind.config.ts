import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00FFFF', // Cyan
          dark: '#00CCCC',
        },
        secondary: {
          success: '#10B981', // Green
          error: '#EF4444',   // Red
        },
        dark: {
          bg: '#000000',
          surface: '#121212',
          text: '#FFFFFF',
        },
        light: {
          bg: '#FFFFFF',
          surface: '#F3F4F6',
          text: '#1F2937',
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};

export default config;
