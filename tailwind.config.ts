import aspectRatio from '@tailwindcss/aspect-ratio';
import scrollbarHide from 'tailwind-scrollbar-hide';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './containers/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        red: {
          DEFAULT: 'var(--red)',
        },
        green: {
          DEFAULT: 'var(--green)',
        },
        gray: {
          DEFAULT: 'var(--gray)',
        },
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      borderColor: {
        DEFAULT: '#efefef',
      },
      fontSize: {
        smp: '15px',
        xsp: '13px',
      },
    },
  },
  plugins: [scrollbarHide, aspectRatio],
} satisfies Config;
