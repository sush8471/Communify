// tailwind.config.js - Communify Design Token System
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#000000',
          secondary: '#0a0a0a',
          tertiary: '#111111',
          quaternary: '#161616',
        },
        border: {
          primary: '#1f1f1f',
          secondary: '#2e2e2e',
          tertiary: '#3a3a3a',
          focus: '#ffffff',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a1a1a1',
          tertiary: '#6b6b6b',
          quaternary: '#4a4a4a',
        },
        accent: {
          primary: '#8b5cf6',
          secondary: '#a78bfa',
          tertiary: '#c4b5fd',
          muted: 'rgba(139, 92, 246, 0.15)',
          glow: 'rgba(139, 92, 246, 0.4)',
        },
        status: {
          online: '#10b981',
          away: '#f59e0b',
          busy: '#ef4444',
          offline: '#6b6b6b',
        },
      },
      fontFamily: {
        sans: ['Geist Sans', 'Geist', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Geist Mono', 'SF Mono', 'Fira Code', 'monospace'],
        display: ['Geist Sans', 'Geist', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '3.5rem' }],
      },
      borderRadius: {
        'sm': '0.125rem',
        'base': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'glow-sm': '0 0 8px rgba(139, 92, 246, 0.3)',
        'glow-md': '0 0 16px rgba(139, 92, 246, 0.4)',
        'glow-lg': '0 0 24px rgba(139, 92, 246, 0.5)',
        'glow-xl': '0 0 32px rgba(139, 92, 246, 0.6)',
        'card': '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
        'elevated': '0 4px 8px 0 rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'slide-up': 'slideUp 300ms ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(139, 92, 246, 0.3)' },
          '50%': { boxShadow: '0 0 16px rgba(139, 92, 246, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
