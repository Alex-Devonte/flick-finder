/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,jsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#2d2d2d", // Softer black for backgrounds or text
        "vibrant-red": "#e11d48", // Vibrant red
        "dark-red": "#9f1239", // Darker shade of red for text or accents
        "neutral-gray": "#6b7280", // Neutral gray
        cream: "#ffedd5", // Base cream color
        "dark-cream": "#fcdcb2", // Darker cream for accents
        "light-cream": "#fff7eb", // Lighter cream for backgrounds or highlights
      },
    },
  },
  plugins: [],
};
