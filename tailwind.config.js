/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: {
          deep: "#0B0F1A",
          surface: "#161B2E",
        },
        neon: {
          cyan: "#00F3FF",
          purple: "#BF00FF",
          pink: "#FF00E5",
        },
      },
      spacing: {
        '18': '4.5rem',
      },
    },
  },
  plugins: [],
}

