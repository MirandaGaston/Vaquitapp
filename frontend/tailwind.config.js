/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        vaq: {
          50:  "#fff8f0",
          100: "#ffe8cc",
          200: "#ffc980",
          300: "#ffaa33",
          400: "#ff8c00",
          500: "#e07b00",
          600: "#b86400",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in":   "fadeIn 0.4s ease-out",
        "slide-up":  "slideUp 0.3s ease-out",
        "bounce-in": "bounceIn 0.5s ease-out",
        "spin-slow": "spin 2s linear infinite",
      },
      keyframes: {
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:  { from: { opacity: 0, transform: "translateY(16px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        bounceIn: { "0%": { transform: "scale(0.9)", opacity: 0 }, "60%": { transform: "scale(1.05)" }, "100%": { transform: "scale(1)", opacity: 1 } },
      },
    },
  },
  plugins: [],
};
