/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  prefix: "",
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      scrollbar: {
        default: {
          size: "spacing.1",
          track: { background: "lightgray" },
          thumb: { background: "gray" },
          hover: { background: "darkgray" },
        },
        thin: {
          size: "2px",
          track: { background: "lightgray" },
          thumb: { background: "gray" },
          hover: { background: "darkgray" },
        },
        primary: {
          size: "1rem",
          track: { background: "#FFD1D7" },
          thumb: { background: "#FFB6C1" },
          hover: { background: "#FF7086" },
        },
        secondary: {
          size: ".5rem",
          track: { background: "#FFD1D7" },
          thumb: { background: "#FFB6C1" },
          hover: { background: "#FF7086" },
        },
        light: {
          size: "1rem",
          track: { background: "#ffffff" },
          thumb: { background: "#FAF7F7" },
          hover: { background: "#CCD5DE" },
        },
        dark: {
          size: "1rem",
          track: { background: "#5E738A" },
          thumb: { background: "#212B36" },
          hover: { background: "#00000075" },
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        light: {
          default: "#FAF7F7",
          variant: "#ffffff",
        },
        dark: {
          default: "#212B36",
          shadow: "#00000075",
          variant: "#000000",
        },
        primary: {
          default: "#FFB6C1",
          variant: "#FFC0CB",
          accent: "#FF7086",
          t2: "#FFCDD5",
          t3: "#FFD1D7",
          t4: "#FFDBE0",
          t5: "#FFE5E9",
        },
        secondary: {
          default: "#FF45AA",
          variant: "#FF7AC2",
          accent: "#FF1493",
          t2: "#FF9FD3",
          t3: "#FFAFDB",
          t4: "#FFC1E3",
          t5: "#FFDBEF",
        },
        neutral: {
          primary: "#212B36",
          secondary: "#5E738A",
          800: "#333F4D",
          700: "#425263",
          600: "#516579",
          300: "#8D9DAE",
          200: "#ADB9C6",
          100: "#CCD5DE",
          50: "#F4F6F8",
        },
      },
    },
  },
  plugins: [
    require("@gradin/tailwindcss-scrollbar"),
    require("tailwindcss-debug-screens"),
    require("tailwind-scrollbar-hide"),
    require("tailwindcss-animate"),
    require("daisyui"),
  ],
};
