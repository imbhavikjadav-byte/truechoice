export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'navy': '#0A0F1E',
        'bg-primary': '#080C14',
        'bg-secondary': '#0E1420',
        'bg-tertiary': '#141B2D',
        'tc-border': '#1E2A45',
        'accent-blue': '#2563EB',
        'accent-purple': '#7C3AED',
        'light-bg': '#F8F9FF',
        'text-primary': '#F0F4FF',
        'text-secondary': '#8896B3',
        'tc-success': '#10B981',
        'tc-danger': '#EF4444',
        'tc-warning': '#F59E0B',
      },
      fontFamily: {
        'display': ['Outfit', 'sans-serif'],
        'body': ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
