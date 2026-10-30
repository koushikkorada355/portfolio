/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          50: "#f6f8fa",
          950: "#0a0e14",
          900: "#0e131a",
          850: "#11161f",
          800: "#161c26",
          700: "#1e2530",
          600: "#2a3240",
        },
        ink: {
          DEFAULT: "#e6ebf2",
          dim: "#9aa7b5",
          faint: "#5f6b7a",
        },
        accent: {
          DEFAULT: "#60a5fa",
          soft: "#93c5fd",
          mute: "#172554",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      maxWidth: {
        shell: "72rem",
      },
    },
  },
  plugins: [],
};
